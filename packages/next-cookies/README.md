# @opensourceframework/next-cookies

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

Tiny little function for getting cookies on both client & server with [next.js](https://nextjs.org).

This enables easy client-side and server-side rendering of pages that depend on cookies.

## Installation

```bash
pnpm add @opensourceframework/next-cookies
```

or

```bash
npm install @opensourceframework/next-cookies
```

## Usage

### Read all cookies:

```typescript
const allCookies = cookies(ctx);
```

`allCookies` will be an object with keys for each cookie.

The `ctx` object is passed to your [`getInitialProps`](https://nextjs.org/docs#fetching-data-and-component-lifecycle) function by next.js.

### Read a single cookie:

```typescript
const { myCookie } = cookies(ctx);
```

or

```typescript
const myCookie = cookies(ctx).myCookie;
```

The `ctx` object is passed to your [`getInitialProps`](https://nextjs.org/docs#fetching-data-and-component-lifecycle) function by next.js.

### Set a cookie:

This library does not support setting cookies. However, this is how to do it in client-side code:

```typescript
document.cookie = `foo=bar; path=/`;
```

This sets a cookie named `foo` to the value `bar`.

The `path` portion is optional but usually desired.

An expiration date may be appended (see below), otherwise the cookie will be deleted whenever the browser is closed.

### Delete a cookie:

This library does not support deleting cookies. However, this is how to do it in client-side code:

```typescript
document.cookie = `foo=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
```

The value doesn't matter, although the `path` does. The expiration date must be in the past.

## Complete Example

```typescript
import React from 'react'
import cookies from '@opensourceframework/next-cookies'

interface NameFormProps {
  initialName: string
}

export default class NameForm extends React.Component<NameFormProps> {
  static async getInitialProps(ctx) {
    return {
      initialName: cookies(ctx).name || ''
    }
  }

  constructor(props: NameFormProps) {
    super(props);
    this.state = { name: props.initialName || '' };
    this.handleChange = this.handleChange.bind(this);
    this.reset = this.reset.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newName = event.target.value;
    this.setState({ name: newName });
    document.cookie = `name=${newName}; path=/`;
  }

  reset() {
    this.setState({ name: '' });
    document.cookie = 'name=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }

  render() {
    return (
      <div>
        <p>Hi {this.state.name}</p>
        <p>Change cookie: <input
            type="text"
            placeholder="Your name here"
            value={this.state.name}
            onChange={this.handleChange}
          />!
        </p>
        <p>Delete cookie: <button onClick={this.reset}>Reset</button></p>
      </div>
    );
  }
}
```

## TypeScript Support

This package includes TypeScript definitions out of the box.

## Attribution

- **Original Author**: Matthew Mueller
- **Original Repository**: https://github.com/matthewmueller/next-cookies
- **Original License**: MIT

## More Information

* https://www.npmjs.com/package/universal-cookie
* https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
* https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
* https://tools.ietf.org/html/rfc6265

## License

MIT
