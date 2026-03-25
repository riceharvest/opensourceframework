#!/usr/bin/env node

/**
 * monitor-upstreams.mjs
 * 
 * This script monitors the original repositories of our forked packages
 * for any new releases or significant commits.
 */

const UPSTREAMS = [
  { package: 'next-auth', repo: 'nextauthjs/next-auth', branch: 'v3' },
  { package: 'next-seo', repo: 'garmeeh/next-seo', branch: 'master' },
  { package: 'next-pwa', repo: 'shadowwalker/next-pwa', branch: 'master' },
  { package: 'critters', repo: 'GoogleChromeLabs/critters', branch: 'main' },
  { package: 'next-iron-session', repo: 'vvo/iron-session', branch: 'main' },
  { package: 'next-connect', repo: 'hoangvvo/next-connect', branch: 'master' },
  { package: 'next-transpile-modules', repo: 'martpie/next-transpile-modules', branch: 'master' },
  { package: 'next-optimized-images', repo: 'cyrilwanner/next-optimized-images', branch: 'master' },
  { package: 'react-query-auth', repo: 'alan2207/react-query-auth', branch: 'main' },
  { package: 'react-virtualized', repo: 'bvaughn/react-virtualized', branch: 'master' },
  { package: 'next-cookies', repo: 'hoangvvo/next-cookies', branch: 'master' },
  { package: 'next-session', repo: 'hoangvvo/next-session', branch: 'master' },
  { package: 'next-csrf', repo: 'j0lv3r4/next-csrf', branch: 'master' },
  { package: 'next-json-ld', repo: 'garmeeh/next-seo', branch: 'master' },
  { package: 'next-compose-plugins', repo: 'cyrilwanner/next-compose-plugins', branch: 'master' },
  { package: 'next-images', repo: 'twopluszero/next-images', branch: 'master' },
  { package: 'next-mdx', repo: 'shadcn/next-mdx', branch: 'main' },
  { package: 'next-circuit-breaker', repo: 'j0lv3r4/next-circuit-breaker', branch: 'master' },
  { package: 'cmdk', repo: 'pacocoursey/cmdk', branch: 'main' },
];

async function checkUpstream(upstream) {
  console.log(`Checking ${upstream.package} (${upstream.repo})...`);
  
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    'User-Agent': 'opensourceframework-monitor',
    ...(token ? { 'Authorization': `token ${token}` } : {}),
  };

  try {
    // Check for latest release
    const releaseRes = await fetch(`https://api.github.com/repos/${upstream.repo}/releases/latest`, { headers });
    const release = await releaseRes.json();

    // Check for latest commit on specific branch
    const commitRes = await fetch(`https://api.github.com/repos/${upstream.repo}/commits?sha=${upstream.branch}&per_page=1`, { headers });
    const commits = await commitRes.json();
    const latestCommit = commits[0];

    return {
      package: upstream.package,
      repo: upstream.repo,
      latestRelease: release.tag_name || 'N/A',
      latestReleaseDate: release.published_at || 'N/A',
      latestCommitHash: latestCommit?.sha?.substring(0, 7) || 'N/A',
      latestCommitDate: latestCommit?.commit?.author?.date || 'N/A',
      latestCommitMessage: latestCommit?.commit?.message?.split('\n')[0] || 'N/A',
    };
  } catch (error) {
    console.error(`Error checking ${upstream.package}:`, error.message);
    return null;
  }
}

async function run() {
  const results = [];
  for (const upstream of UPSTREAMS) {
    const result = await checkUpstream(upstream);
    if (result) results.push(result);
    // Small delay to respect rate limits if no token
    if (!process.env.GITHUB_TOKEN) await new Promise(r => setTimeout(r, 1000));
  }

  console.table(results);
  
  // In a real GH Action, we would compare these with a stored state
  // and open an issue or PR if something new is found.
}

run();
