import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <>
      <h1>Hello World</h1>
      <Link href='/test-local-module'>test-local-module</Link>
      <br />
      <Link href='/test-npm-module'>test-npm-module</Link>
      <br />
      <Link href='/test-local-typescript-module'>test-local-typescript-module</Link>
      <br />
      <Link href='/test-css-module'>test-css-module</Link>
      <br />
      <Link href='/test-scss-module'>test-scss-module</Link>
      <br />
      <Link href='/test-global-css'>test-global-css</Link>
      <br />
      <Link href='/test-global-scss'>test-global-scss</Link>
    </>
  );
};

export default HomePage;
