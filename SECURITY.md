# Security Policy

## Supported Versions

We actively support and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Email the security team directly at: [security@opensourceframework.dev](mailto:security@opensourceframework.dev)
3. Include the following in your report:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Any suggested fixes (optional)

### Response Timeline

| Timeline      | Action                                                |
|---------------|-------------------------------------------------------|
| < 24 hours   | Acknowledgment of receipt                            |
| < 7 days     | Initial assessment and triage                        |
| < 30 days    | Fix development and testing                          |
| < 60 days    | Public disclosure and patch release                  |

### Disclosure Policy

- We follow a **coordinated disclosure** process
- We request that you give us reasonable time to fix the vulnerability before public disclosure
- We will credit reporters in the security advisory (with permission)

## Security Advisories

We publish security advisories for all fixed vulnerabilities:

- [GitHub Security Advisories](https://github.com/opensourceframework/security/advisories)
- [npm Advisory Database](https://www.npmjs.com/advisories)

## Supported Packages

This policy applies to all packages in the `@opensourceframework` scope:

- `@opensourceframework/critters`
- `@opensourceframework/next-csrf`
- `@opensourceframework/next-images`
- `@opensourceframework/next-json-ld`
- `@opensourceframework/next-circuit-breaker`
- `@opensourceframework/react-a11y-utils`
- `@opensourceframework/seeded-rng`

## Security Requirements

### For Production Use

1. **Always use the latest stable version**
2. **Review dependencies regularly** - Use Dependabot or similar tools
3. **Enable security scanning** in your CI/CD pipeline
4. **Follow least privilege** - Don't give packages more permissions than needed

### For Security-Critical Applications

The `seeded-rng` package provides two implementations:

| Class           | Use Case                                    |
|-----------------|---------------------------------------------|
| `SeededRNG`     | Games, testing, simulations (NOT secure)    |
| `SecureSeededRNG`| Passwords, tokens, keys (cryptographically secure) |

**Never use `SeededRNG` for security-sensitive operations!**

## Dependencies

We regularly audit dependencies for vulnerabilities:

- GitHub Dependabot for automated updates
- Snyk for dependency scanning
- npm audit for runtime checks
- GitHub Advanced Security

## Best Practices

1. **Keep packages updated** - Security fixes are released regularly
2. **Use lockfiles** - Ensures consistent installs
3. **Audit your dependencies** - Run `npm audit` or `pnpm audit` regularly
4. **Subscribe to security advisories** - Get notified of new vulnerabilities

## Bug Bounty

We currently do not have a formal bug bounty program, but we appreciate responsible disclosure and may offer public recognition for significant findings.

## Contact

For security-related inquiries:
- Email: [security@opensourceframework.dev](mailto:security@opensourceframework.dev)
- GitHub: [https://github.com/opensourceframework](https://github.com/opensourceframework)

---

**Last Updated:** February 2026
