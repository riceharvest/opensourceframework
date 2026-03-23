# @opensourceframework/identity-obj-proxy

> An identity object using ES6 proxies. A maintained drop-in replacement for `identity-obj-proxy`.

This is a modern, actively maintained fork of the [original `identity-obj-proxy`](https://github.com/keyanzhang/identity-obj-proxy) package, which has been abandoned since 2022. It is fully backwards compatible and functions as a drop-in replacement.

## Why use this?

`identity-obj-proxy` is heavily used in the React/Next.js ecosystem for mocking CSS modules in Jest configurations. As the Node.js and Jest ecosystems have modernized, the original unmaintained package can cause compatibility issues or security warnings.

This fork is maintained by the **OpenSource Framework** team, ensuring it stays compatible with modern JavaScript environments (ESM, Node 20+, etc.).

## Installation

```bash
npm install -D @opensourceframework/identity-obj-proxy
# or
yarn add -D @opensourceframework/identity-obj-proxy
# or
pnpm add -D @opensourceframework/identity-obj-proxy
```

## Usage (Jest)

In your `jest.config.js`:

```javascript
module.exports = {
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "@opensourceframework/identity-obj-proxy"
  }
};
```

## How it works

When you import a CSS module in your tests, it replaces the import with a proxy object that simply returns the key.

```javascript
import styles from './styles.module.css';

console.log(styles.foo); // "foo"
console.log(styles.bar); // "bar"
```

## License

MIT
