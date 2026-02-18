# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our packages seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to [security@opensourceframework.dev](mailto:security@opensourceframework.dev) or through our [private vulnerability reporting](https://github.com/riceharvest/opensourceframework/security/advisories) on GitHub.

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information in your report:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

- We will acknowledge your email within 48 hours.
- We will provide an estimated timeline for a fix.
- We will keep you informed of the progress towards a fix.
- Once the issue is fixed, we will announce it in the release notes and credit you (if desired).

## Security Best Practices

When using @opensourceframework packages, please follow these security best practices:

1. **Keep dependencies updated**: Regularly run `pnpm update` to get the latest security patches.
2. **Use environment variables**: Never hardcode secrets in your code. Use environment variables for sensitive configuration.
3. **Review dependencies**: Regularly audit your dependencies with `pnpm audit`.
4. **Enable HTTPS**: Use HTTPS in production, especially for cookie-based security features.
5. **Follow principle of least privilege**: Configure packages with minimal necessary permissions.

## Security Updates

- Security updates are published as patch versions (e.g., 1.2.3 → 1.2.4).
- We recommend subscribing to GitHub security advisories for this repository.
- We use GitHub's Dependabot to automatically update vulnerable dependencies.

## Known Issues

{known-security-issues}

## Acknowledgments

We would like to thank the following security researchers:

{acknowledgments}
