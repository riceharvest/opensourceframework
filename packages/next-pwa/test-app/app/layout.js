export const metadata = {
  title: 'PWA Test App',
  description: 'A test app for next-pwa integration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
