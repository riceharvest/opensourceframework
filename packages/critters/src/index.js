/**
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import { readFile } from 'fs';
import { createDocument, serializeDocument } from './dom.js';
import path from 'path';
import {
  applyMarkedSelectors,
  markOnly,
  parseStylesheet,
  serializeStylesheet,
  validateMediaQuery,
  walkStyleRules,
  walkStyleRulesWithReverseMirror
} from './css.js';
import { createLogger, isSubpath } from './util.js';

/**
 * Regular expression to match dangerous URL schemes that could execute JavaScript
 * @constant {RegExp}
 */
const DANGEROUS_URL_PATTERN = /^\s*(javascript|data\s*:\s*text\/html|data\s*:\s*text\/javascript)/i;

/**
 * Regular expression to match script tags that could execute code
 * @constant {RegExp}
 */
const SCRIPT_TAG_PATTERN = /<script[^>]*>[\s\S]*?<\/script>/gi;

/**
 * Regular expression to match script-closing tags that could break out of style contexts
 * @constant {RegExp}
 */
const SCRIPT_BREAKOUT_PATTERN = /<\/script>/gi;

/**
 * Sanitize a URL to prevent JavaScript execution
 * @param {string} url - The URL to sanitize
 * @returns {string} - Sanitized URL or empty string if dangerous
 */
function _sanitizeUrl(url) {
  if (!url) return url;
  // Block dangerous schemes
  if (DANGEROUS_URL_PATTERN.test(url)) {
    return '';
  }
  return url;
}

/**
 * Sanitize an attribute value to prevent XSS
 * @param {string} value - The attribute value to sanitize
 * @returns {string} - Sanitized value
 */
function sanitizeAttributeValue(value) {
  if (!value) return value;
  // Remove any script tags first
  let sanitized = value.replace(SCRIPT_TAG_PATTERN, '');
  // Also remove any remaining script breakout attempts
  sanitized = sanitized.replace(SCRIPT_BREAKOUT_PATTERN, '');
  return sanitized;
}

/**
 * Check if an attribute name is a dangerous event handler
 * @param {string} name - Attribute name
 * @returns {boolean} - True if dangerous
 */
function isDangerousAttribute(name) {
  return /^on/i.test(name);
}

/**
 * The mechanism to use for lazy-loading stylesheets.
 *
 * Note: <kbd>JS</kbd> indicates a strategy requiring JavaScript (falls back to `<noscript>` unless disabled).
 *
 * - **default:** Move stylesheet links to the end of the document and insert preload meta tags in their place.
 * - **"body":** Move all external stylesheet links to the end of the document.
 * - **"media":** Load stylesheets asynchronously by adding `media="not x"` and removing once loaded. <kbd>JS</kbd>
 * - **"swap":** Convert stylesheet links to preloads that swap to `rel="stylesheet"` once loaded ([details](https://www.filamentgroup.com/lab/load-css-simpler/#the-code)). <kbd>JS</kbd>
 * - **"swap-high":** Use `<link rel="alternate stylesheet preload">` and swap to `rel="stylesheet"` once loaded ([details](http://filamentgroup.github.io/loadCSS/test/new-high.html)). <kbd>JS</kbd>
 * - **"js":** Inject an asynchronous CSS loader similar to [LoadCSS](https://github.com/filamentgroup/loadCSS) and use it to load stylesheets. <kbd>JS</kbd>
 * - **"js-lazy":** Like `"js"`, but the stylesheet is disabled until fully loaded.
 * - **false:** Disables adding preload tags.
 * @typedef {(default|'body'|'media'|'swap'|'swap-high'|'js'|'js-lazy')} PreloadStrategy
 * @public
 */

/**
 * Controls which keyframes rules are inlined.
 *
 * - **"critical":** _(default)_ inline keyframes rules that are used by the critical CSS.
 * - **"all":** Inline all keyframes rules.
 * - **"none":** Remove all keyframes rules.
 * @typedef {('critical'|'all'|'none')} KeyframeStrategy
 * @private
 * @property {String} keyframes     Which {@link KeyframeStrategy keyframe strategy} to use (default: `critical`)_
 */

/**
 * Controls log level of the plugin. Specifies the level the logger should use. A logger will
 * not produce output for any log level beneath the specified level. Available levels and order
 * are:
 *
 * - **"info"** _(default)_
 * - **"warn"**
 * - **"error"**
 * - **"trace"**
 * - **"debug"**
 * - **"silent"**
 * @typedef {('info'|'warn'|'error'|'trace'|'debug'|'silent')} LogLevel
 * @public
 */

/**
 * Custom logger interface:
 * @typedef {object} Logger
 * @public
 * @property {function(String)} trace - Prints a trace message
 * @property {function(String)} debug - Prints a debug message
 * @property {function(String)} info - Prints an information message
 * @property {function(String)} warn - Prints a warning message
 * @property {function(String)} error - Prints an error message
 */

/**
 * All optional. Pass them to `new Critters({ ... })`.
 * @public
 * @typedef Options
 * @property {String} path     Base path location of the CSS files _(default: `''`)_
 * @property {String} publicPath     Public path of the CSS resources. This prefix is removed from the href _(default: `''`)_
 * @property {Boolean} external     Inline styles from external stylesheets _(default: `true`)_
 * @property {Number} inlineThreshold Inline external stylesheets smaller than a given size _(default: `0`)_
 * @property {Number} minimumExternalSize If the non-critical external stylesheet would be below this size, just inline it _(default: `0`)_
 * @property {Boolean} pruneSource  Remove inlined rules from the external stylesheet _(default: `false`)_
 * @property {Boolean} mergeStylesheets Merged inlined stylesheets into a single `<style>` tag _(default: `true`)_
 * @property {String[]} additionalStylesheets Glob for matching other stylesheets to be used while looking for critical CSS.
 * @property {String} preload       Which {@link PreloadStrategy preload strategy} to use
 * @property {Boolean} noscriptFallback Add `<noscript>` fallback to JS-based strategies
 * @property {Boolean} inlineFonts  Inline critical font-face rules _(default: `false`)_
 * @property {Boolean} preloadFonts Preloads critical fonts _(default: `true`)_
 * @property {Boolean} fonts        Shorthand for setting `inlineFonts` + `preloadFonts`
 * @property {String} keyframes     Controls which keyframes rules are inlined
 * @property {Boolean} compress     Compress resulting critical CSS _(default: `true`)_
 * @property {String} logLevel      Controls log level of the plugin
 * @property {Boolean} reduceInlineStyles Option indicates if inline styles should be evaluated for critical CSS
 * @property {Logger} logger        Provide a custom logger interface
 * @property {(RegExp|String)[]} allowRules List of rules to always include in the critical CSS
 */

/**
 * Create an instance of Critters with custom options.
 * The `.process()` method can be called repeatedly to re-use this instance and its cache.
 * @public
 * @param {Options} options
 * @example
 * const critters = new Critters({
 *   preload: 'swap',
 *   pruneSource: false
 * });
 * const inlined = await critters.process(html);
 */
export default class Critters {
  constructor(options) {
    /** @type {Options} */
    this.options = Object.assign(
      {
        logLevel: 'info',
        path: '',
        publicPath: '',
        reduceInlineStyles: true,
        pruneSource: false,
        preload: undefined,
        noscriptFallback: true,
        inlineFonts: false,
        preloadFonts: true,
        fonts: undefined,
        keyframes: 'critical',
        compress: true,
        mergeStylesheets: true,
        external: true,
        inlineThreshold: 0,
        minimumExternalSize: 0,
        additionalStylesheets: [],
        allowRules: []
      },
      options || {}
    );

    this.logger = this.options.logger
      ? Object.assign(createLogger(this.options.logLevel), this.options.logger)
      : createLogger(this.options.logLevel);

    // The fs module to use for reading files. Can be overridden by webpack plugin.
    this.fs = { readFile };
  }

  /**
   * Read the contents of a file from the specified filesystem or disk.
   * Override this method to customize how stylesheets are loaded.
   * @param {string} filename
   * @returns {Promise<string>}
   */
  readFile(filename) {
    return new Promise((resolve, reject) => {
      this.fs.readFile(filename, 'utf8', (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  /**
   * Given a stylesheet URL, returns the corresponding CSS asset.
   * Overriding this method requires doing your own URL normalization, so it's generally better to override `readFile()`.
   * @param {string} href
   * @returns {Promise<string | undefined>}
   */
  async getCssAsset(href) {
    const outputPath = this.options.path;
    const publicPath = this.options.publicPath;

    // CHECK - the output path
    // path on disk (with output.publicPath removed)
    let normalizedPath = href.replace(/^\//, '');
    const pathPrefix = (publicPath || '').replace(/(^\/|\/$)/g, '') + '/';
    if (normalizedPath.indexOf(pathPrefix) === 0) {
      normalizedPath = normalizedPath
        .substring(pathPrefix.length)
        .replace(/^\//, '');
    }
    const filename = path.resolve(outputPath, normalizedPath);

    // CHECK - is the path a subpath of the base path
    if (!isSubpath(outputPath, filename)) {
      this.logger.warn(`Path "${normalizedPath}" is not a subpath of "${outputPath}"`);
      return;
    }

    // Try reading the file from disk
    try {
      return await this.readFile(filename);
    } catch {
      this.logger.warn(`Unable to locate stylesheet: ${normalizedPath}`);
    }
  }

  /**
   * Process an HTML document to inline critical CSS from its stylesheets.
   * @param {string} html String containing a full HTML document to be parsed.
   * @returns {Promise<string>} A modified copy of the provided HTML with critical CSS inlined.
   */
  async process(html) {
    const document = createDocument(html);

    // Walk through all stylesheets and process them
    const sheets = [];
    const inlineStyleSheets = [];

    // Collect all external stylesheets
    const externalSheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    // Collect all inline stylesheets
    const inlineStyles = Array.from(document.querySelectorAll('style'));

    // Process external stylesheets
    if (this.options.external !== false) {
      for (const link of externalSheets) {
        const href = link.getAttribute('href');
        if (!href) continue;

        const _media = link.getAttribute('media');
        const style = document.createElement('style');
        style.$$name = href;
        style.$$external = true;
        style.$$links = [link];

        const sheet = await this.getCssAsset(href);
        if (sheet) {
          style.textContent = sheet;
          link.parentNode.insertBefore(style, link);

          // Check if we should inline the whole sheet
          if (this.checkInlineThreshold(link, style, sheet)) {
            // Sheet was fully inlined, continue to next
            continue;
          }

          sheets.push(style);
        }
      }
    }

    // Process inline stylesheets
    if (this.options.reduceInlineStyles !== false) {
      for (const style of inlineStyles) {
        style.$$name = 'inline';
        style.$$reduce = true;
        inlineStyleSheets.push(style);
      }
      sheets.push(...inlineStyleSheets);
    }

    // Process additional stylesheets
    const additionalStyles = await this.embedAdditionalStylesheet(document);
    sheets.push(...additionalStyles);

    // Process all collected sheets
    for (const style of sheets) {
      await this.processStyle(style, document);
    }

    // Handle preload strategy
    if (this.options.preload !== undefined) {
      await this.applyPreloadStrategy(document);
    }

    // Merge stylesheets if requested
    if (this.options.mergeStylesheets !== false && sheets.length > 1) {
      this.mergeStylesheets(document, sheets);
    }

    return serializeDocument(document);
  }

  /**
   * Check if an external stylesheet should be fully inlined based on size threshold.
   * @param {Element} link
   * @param {Element} style
   * @param {string} sheet
   * @returns {boolean}
   */
  checkInlineThreshold(link, style, sheet) {
    const inlineThreshold = this.options.inlineThreshold;
    if (inlineThreshold && sheet.length < inlineThreshold) {
      // Remove the link and keep the inlined style
      link.remove();
      this.logger.info(
        `\u001b[32mInlined all of ${style.$$name} (${sheet.length}b was below threshold of ${inlineThreshold}b)\u001b[39m`
      );
      return true;
    }
    return false;
  }

  /**
   * Embed additional stylesheets specified in options.
   * @param {Document} document
   * @returns {Promise<Element[]>} Array of style elements created
   */
  async embedAdditionalStylesheet(document) {
    const additionalStylesheets = this.options.additionalStylesheets || [];
    const styles = [];
    for (const cssFile of additionalStylesheets) {
      const sheet = await this.getCssAsset(cssFile);
      if (sheet) {
        const style = document.createElement('style');
        style.$$name = cssFile;
        style.$$external = true;
        style.textContent = sheet;
        document.head.appendChild(style);
        styles.push(style);
      }
    }
    return styles;
  }

  /**
   * Apply the preload strategy to remaining external stylesheets.
   * @param {Document} document
   */
  async applyPreloadStrategy(document) {
    const preloadMode = this.options.preload;
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    
    for (const link of links) {
      const href = link.getAttribute('href');
      if (!href) continue;

      const media = link.getAttribute('media');
      const style = link.previousElementSibling;

      // Validate media query if present - remove invalid ones
      if (media && !validateMediaQuery(media)) {
        this.logger.warn(`Invalid media query: ${media}`);
        link.removeAttribute('media');
      }

      // Get the associated style element
      let styleElement = style;
      if (!styleElement || styleElement.tagName !== 'STYLE') {
        styleElement = { $$links: [] };
      }

      this.setupLinkPreload(link, href, link.getAttribute('media'), styleElement, document, preloadMode);
    }
  }

  /**
   * Setup link preload based on strategy.
   * @param {Element} link
   * @param {string} href
   * @param {string} media
   * @param {object} style
   * @param {Document} document
   * @param {string} preloadMode
   */
  setupLinkPreload(link, href, media, style, document, preloadMode) {
    let cssLoaderPreamble =
      "function $loadcss(u,m,l){(l=document.createElement('link')).rel='stylesheet';l.href=u;document.head.appendChild(l)}";
    const lazy = preloadMode === 'js-lazy';
    if (lazy) {
      cssLoaderPreamble = cssLoaderPreamble.replace(
        'l.href',
        "l.media='print';l.onload=function(){l.media=m};l.href"
      );
    }

    // Allow disabling any mutation of the stylesheet link:
    if (preloadMode === false) return;

    // Remove any dangerous event handler attributes from the original link
    const dangerousAttrs = [];
    if (link.attribs) {
      for (const attrName of Object.keys(link.attribs)) {
        if (isDangerousAttribute(attrName)) {
          dangerousAttrs.push(attrName);
        }
      }
      dangerousAttrs.forEach(attr => link.removeAttribute(attr));
    }

    // Sanitize href to prevent script breakout
    const safeHref = sanitizeAttributeValue(href);
    if (safeHref !== href) {
      link.setAttribute('href', safeHref);
    }

    let noscriptFallback = false;
    let updateLinkToPreload = false;
    const noscriptLink = link.cloneNode(false);

    // Also remove dangerous attributes from noscriptLink and sanitize its href
    dangerousAttrs.forEach(attr => noscriptLink.removeAttribute(attr));
    noscriptLink.setAttribute('href', safeHref);

    if (preloadMode === 'body') {
      document.body.appendChild(link);
    } else {
      if (preloadMode === 'js' || preloadMode === 'js-lazy') {
        const script = document.createElement('script');
        script.setAttribute('data-href', safeHref);
        script.setAttribute('data-media', sanitizeAttributeValue(media || 'all'));
        const js = `${cssLoaderPreamble}$loadcss(document.currentScript.dataset.href,document.currentScript.dataset.media)`;
        script.textContent = js;
        link.parentNode.insertBefore(script, link.nextSibling);
        style.$$links.push(script);
        cssLoaderPreamble = '';
        noscriptFallback = true;
        updateLinkToPreload = true;
      } else if (preloadMode === 'media') {
        // Validate and sanitize media value before using it
        const safeMedia = media && validateMediaQuery(media) ? media : 'all';
        link.setAttribute('media', 'print');
        link.setAttribute('onload', `this.media='${safeMedia.replace(/'/g, "\\'")}'`);
        noscriptFallback = true;
      } else if (preloadMode === 'swap-high') {
        link.setAttribute('rel', 'alternate stylesheet preload');
        link.setAttribute('title', 'styles');
        link.setAttribute('onload', `this.title='';this.rel='stylesheet'`);
        noscriptFallback = true;
      } else if (preloadMode === 'swap') {
        link.setAttribute('rel', 'preload');
        link.setAttribute('as', 'style');
        link.setAttribute('onload', "this.rel='stylesheet'");
        noscriptFallback = true;
      } else {
        const bodyLink = link.cloneNode(false);

        // If an ID is present, remove it to avoid collisions.
        bodyLink.removeAttribute('id');

        document.body.appendChild(bodyLink);
        updateLinkToPreload = true;
      }
    }

    if (
      this.options.noscriptFallback !== false &&
      noscriptFallback &&
      !safeHref.includes('</noscript>')
    ) {
      const noscript = document.createElement('noscript');
      noscriptLink.removeAttribute('id');
      noscript.appendChild(noscriptLink);
      link.parentNode.insertBefore(noscript, link.nextSibling);
      style.$$links.push(noscript);
    }

    if (updateLinkToPreload) {
      link.setAttribute('rel', 'preload');
      link.setAttribute('as', 'style');
    }
  }

  /**
   * Merge multiple stylesheets into a single style tag.
   * @param {Document} document
   * @param {Element[]} sheets
   */
  mergeStylesheets(document, sheets) {
    const firstStyle = sheets[0];
    if (!firstStyle || firstStyle.tagName !== 'STYLE') return;

    const mergedContent = sheets
      .filter((s) => s.tagName === 'STYLE' && s.textContent)
      .map((s) => s.textContent)
      .join('\n');

    firstStyle.textContent = mergedContent;

    // Remove other style tags
    for (let i = 1; i < sheets.length; i++) {
      const sheet = sheets[i];
      if (sheet.tagName === 'STYLE' && sheet.parentNode) {
        sheet.remove();
      }
    }
  }

  /**
   * Prune the source CSS files
   */
  pruneSource(style, before, sheetInverse) {
    // if external stylesheet would be below minimum size, just inline everything
    const minSize = this.options.minimumExternalSize;
    const name = style.$$name;
    if (minSize && sheetInverse.length < minSize) {
      this.logger.info(
        `\u001b[32mInlined all of ${name} (non-critical external stylesheet would have been ${sheetInverse.length}b, which was below the threshold of ${minSize})\u001b[39m`
      );
      style.textContent = before;
      // remove any associated external resources/loaders:
      if (style.$$links) {
        for (const link of style.$$links) {
          const parent = link.parentNode;
          if (parent) parent.removeChild(link);
        }
      }

      return true;
    }

    return false;
  }

  /**
   * Parse the stylesheet within a <style> element, then reduce it to contain only rules used by the document.
   */
  async processStyle(style, document) {
    if (style.$$reduce === false) return;

    const name = style.$$name ? style.$$name.replace(/^\//, '') : 'inline CSS';
    const options = this.options;
    const crittersContainer = document.crittersContainer;
    let keyframesMode = options.keyframes || 'critical';
    // we also accept a boolean value for options.keyframes
    if (keyframesMode === true) keyframesMode = 'all';
    if (keyframesMode === false) keyframesMode = 'none';

    let sheet = style.textContent;

    // store a reference to the previous serialized stylesheet for reporting stats
    const before = sheet;

    // Skip empty stylesheets
    if (!sheet) return;

    const ast = parseStylesheet(sheet);
    const astInverse = options.pruneSource ? parseStylesheet(sheet) : null;

    // a string to search for font names (very loose)
    let criticalFonts = '';

    const failedSelectors = [];

    const criticalKeyframeNames = new Set();

    let includeNext = false;
    let includeAll = false;
    let excludeNext = false;
    let excludeAll = false;

    const shouldPreloadFonts =
      options.fonts === true || options.preloadFonts === true;
    const shouldInlineFonts =
      options.fonts !== false && options.inlineFonts === true;

    // Walk all CSS rules, marking unused rules with `.$$remove=true` for removal in the second pass.
    // This first pass is also used to collect font and keyframe usage used in the second pass.
    walkStyleRules(
      ast,
      markOnly((rule) => {
        if (rule.type === 'comment') {
          // we might want to remove a leading ! on comment blocks
          // critters can be part of "legal comments" which aren't striped on build
          const crittersComment = rule.text.match(/^(?<! )critters:(.*)/);
          const command = crittersComment && crittersComment[1];

          if (command) {
            switch (command) {
              case 'include':
                includeNext = true;
                break;
              case 'exclude':
                excludeNext = true;
                break;
              case 'include start':
                includeAll = true;
                break;
              case 'include end':
                includeAll = false;
                break;
              case 'exclude start':
                excludeAll = true;
                break;
              case 'exclude end':
                excludeAll = false;
                break;
            }
          }
        }

        if (rule.type === 'rule') {
          // Handle comment based markers
          if (includeNext) {
            includeNext = false;
            return true;
          }

          if (excludeNext) {
            excludeNext = false;
            return false;
          }

          if (includeAll) {
            return true;
          }

          if (excludeAll) {
            return false;
          }

          // Filter the selector list down to only those match
          rule.filterSelectors((sel) => {
            // Validate rule with 'allowRules' option
            const isAllowedRule = options.allowRules.some((exp) => {
              if (exp instanceof RegExp) {
                return exp.test(sel);
              }
              return exp === sel;
            });
            if (isAllowedRule) return true;

            // Strip pseudo-elements and pseudo-classes, since we only care that their associated elements exist.
            // This means any selector for a pseudo-element or having a pseudo-class will be inlined if the rest of the selector matches.
            if (
              sel === ':root' ||
              sel === 'html' ||
              sel === 'body' ||
              /^::?(before|after)$/.test(sel)
            ) {
              return true;
            }
            sel = sel
              .replace(/(?<!\\)::?[a-z-]+(?![a-z-(])/gi, '')
              .replace(/::?not\(\s*\)/g, '')
              // Remove tailing or leading commas from cleaned sub selector `is(.active, :hover)` -> `is(.active)`.
              .replace(/\(\s*,/g, '(')
              .replace(/,\s*\)/g, ')')
              .trim();
            if (!sel) return false;

            try {
              return crittersContainer.exists(sel);
            } catch (err) {
              failedSelectors.push(sel + ' -> ' + err.message);
              return false;
            }
          });

          // If there are no matched selectors, remove the rule:
          if (!rule.selector) {
            return false;
          }

          if (rule.nodes) {
            for (const decl of rule.nodes) {
              // detect used fonts
              if (
                shouldInlineFonts &&
                decl.prop &&
                /\bfont(-family)?\b/i.test(decl.prop)
              ) {
                criticalFonts += ' ' + decl.value;
              }

              // detect used keyframes
              if (decl.prop === 'animation' || decl.prop === 'animation-name') {
                for (const name of decl.value.split(/\s+/)) {
                  // @todo: parse animation declarations and extract only the name. for now we'll do a lazy match.
                  const nameTrimmed = name.trim();
                  if (nameTrimmed) criticalKeyframeNames.add(nameTrimmed);
                }
              }
            }
          }
        }

        // keep font rules, they're handled in the second pass:
        if (rule.type === 'atrule' && rule.name === 'font-face') return;

        // If there are no remaining rules, remove the whole rule:
        const rules = rule.nodes?.filter((rule) => !rule.$$remove);
        return !rules || rules.length !== 0;
      })
    );

    if (failedSelectors.length !== 0) {
      this.logger.warn(
        `${
          failedSelectors.length
        } rules skipped due to selector errors:\n  ${failedSelectors.join(
          '\n  '
        )}`
      );
    }

    const preloadedFonts = new Set();
    // Second pass, using data picked up from the first
    walkStyleRulesWithReverseMirror(ast, astInverse, (rule) => {
      // remove any rules marked in the first pass
      if (rule.$$remove === true) return false;

      applyMarkedSelectors(rule);

      // prune @keyframes rules
      if (rule.type === 'atrule' && rule.name === 'keyframes') {
        if (keyframesMode === 'none') return false;
        if (keyframesMode === 'all') return true;
        return criticalKeyframeNames.has(rule.params);
      }

      // prune @font-face rules
      if (rule.type === 'atrule' && rule.name === 'font-face') {
        let family, src;
        for (const decl of rule.nodes) {
          if (decl.prop === 'src') {
            // @todo parse this properly and generate multiple preloads with type="font/woff2" etc
            src = (decl.value.match(/url\s*\(\s*(['"]?)(.+?)\1\s*\)/) || [])[2];
          } else if (decl.prop === 'font-family') {
            family = decl.value;
          }
        }

        if (src && shouldPreloadFonts && !preloadedFonts.has(src)) {
          preloadedFonts.add(src);
          const preload = document.createElement('link');
          preload.setAttribute('rel', 'preload');
          preload.setAttribute('as', 'font');
          preload.setAttribute('crossorigin', 'anonymous');
          preload.setAttribute('href', src.trim());
          document.head.appendChild(preload);
        }

        // if we're missing info, if the font is unused, or if critical font inlining is disabled, remove the rule:
        if (
          !shouldInlineFonts ||
          !family ||
          !src ||
          !criticalFonts.includes(family)
        ) {
          return false;
        }
      }
    });

    sheet = serializeStylesheet(ast, {
      compress: this.options.compress !== false
    });

    // If all rules were removed, get rid of the style element entirely
    if (sheet.trim().length === 0) {
      if (style.parentNode) {
        style.remove();
      }
      return;
    }

    let afterText = '';
    let styleInlinedCompletely = false;
    if (options.pruneSource) {
      const sheetInverse = serializeStylesheet(astInverse, {
        compress: this.options.compress !== false
      });

      styleInlinedCompletely = this.pruneSource(style, before, sheetInverse);

      if (styleInlinedCompletely) {
        const percent = (sheetInverse.length / before.length) * 100;
        afterText = `, reducing non-inlined size ${
          percent | 0
        }% to ${formatSize(sheetInverse.length)}`;
      }
    }

    // replace the inline stylesheet with its critical'd counterpart
    if (!styleInlinedCompletely) {
      style.textContent = sheet;
    }

    // output stats
    const percent = ((sheet.length / before.length) * 100) | 0;
    this.logger.info(
      '\u001b[32mInlined ' +
        formatSize(sheet.length) +
        ' (' +
        percent +
        '% of original ' +
        formatSize(before.length) +
        ') of ' +
        name +
        afterText +
        '.\u001b[39m'
    );
  }
}

function formatSize(size) {
  if (size <= 0) {
    return '0 bytes';
  }

  const abbreviations = ['bytes', 'kB', 'MB', 'GB'];
  const index = Math.floor(Math.log(size) / Math.log(1024));
  const roundedSize = size / Math.pow(1024, index);
  // bytes don't have a fraction
  const fractionDigits = index === 0 ? 0 : 2;

  return `${roundedSize.toFixed(fractionDigits)} ${abbreviations[index]}`;
}
