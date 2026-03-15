# Security Policy

## Supported Versions

| Package | Version | Supported |
| ------- | ------- | --------- |
| @opensourceframework/next-csrf | >= 1.0.0 | :white_check_mark: |
| @opensourceframework/next-images | >= 1.0.0 | :white_check_mark: |
| @opensourceframework/critters | >= 1.0.0 | :white_check_mark: |

## Security-First Approach

Given that we maintain security-critical packages like `next-csrf`, we take security seriously:

1. **Regular dependency audits** - Automated scanning for vulnerable dependencies
2. **Code review** - All changes require review before merge
3. **Automated testing** - Security-related tests in CI pipeline
4. **Responsible disclosure** - Private reporting before public disclosure

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them through GitHub Security Advisories:

1. Go to the [Security Advisories page](https://github.com/opensourceframework/opensourceframework/security/advisories/new)
2. Click "Report a vulnerability"
3. Fill out the form with details about the vulnerability

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Affected package and version(s)
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Next scheduled release

## Security Best Practices

When using our packages:

1. Always use the latest supported version
2. Review security advisories before upgrading
3. Subscribe to GitHub Security Alerts
4. Report any suspicious behavior

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who help keep our packages secure.