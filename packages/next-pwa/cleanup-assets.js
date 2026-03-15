'use strict'

const fs = require('fs')
const path = require('path')

function wildcardToRegExp(pattern) {
  const escapedPattern = pattern.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
  return new RegExp(`^${escapedPattern.replace(/\*/g, '.*')}$`)
}

function cleanMatchingFiles(dir, patterns) {
  if (!fs.existsSync(dir)) return

  const matchers = patterns.map(wildcardToRegExp)

  for (const entry of fs.readdirSync(dir)) {
    if (!matchers.some((matcher) => matcher.test(entry))) continue
    fs.rmSync(path.join(dir, entry), { force: true, recursive: true })
  }
}

module.exports = cleanMatchingFiles
