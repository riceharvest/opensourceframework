export default function Home() {
  return (
    <main>
      <h1>PWA Test Application</h1>
      <p>This is a test page for next-pwa integration.</p>
      <div id="hydration-status">Loading...</div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('hydration-status').textContent = 'Hydrated: ' + new Date().toISOString();
          `,
        }}
      />
    </main>
  );
}
