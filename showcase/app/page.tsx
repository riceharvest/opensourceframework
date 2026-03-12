import { ArticleJsonLd, OrganizationJsonLd } from "@opensourceframework/next-seo";
import { Shield, Lock, Zap, MousePointer2, Image as ImageIcon, Layout, Database, Hash, Accessibility } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      {/* SEO Data */}
      <OrganizationJsonLd
        name="OpenSource Framework"
        url="https://opensourceframework.com"
        logo="https://opensourceframework.com/logo.png"
        description="Maintainer of compatibility-first Next.js forks."
      />
      <ArticleJsonLd
        headline="Modernizing the Next.js Ecosystem"
        datePublished="2026-03-12T00:00:00Z"
        author="Rice Harvest"
        description="A showcase of modernized, reliable Next.js packages."
        image="https://opensourceframework.com/og-image.jpg"
      />

      <header className="mb-16 text-center">
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
          OpenSource Framework
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Compatibility-first, modernized forks of the packages you love. 
          Built for Next.js 16 and React 19.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Tier 1: Auth & Security */}
        <section className="p-6 rounded-2xl bg-white shadow-xl border border-gray-100 hover:border-blue-200 transition-all group">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
            <Lock className="text-blue-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">@opensourceframework/next-auth</h2>
          <p className="text-gray-600 mb-4 text-sm">
            Modernized v3 fork with native OAuth 2.x support and structured URL handling.
          </p>
          <Link href="/auth-demo" className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1">
            Try Auth <MousePointer2 size={14} />
          </Link>
        </section>

        <section className="p-6 rounded-2xl bg-white shadow-xl border border-gray-100 hover:border-blue-200 transition-all group">
          <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
            <Shield className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">@opensourceframework/next-csrf</h2>
          <p className="text-gray-600 mb-4 text-sm">
            App Router compatible CSRF protection with async header/cookie support.
          </p>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded font-mono">Secured</span>
          </div>
        </section>

        {/* Tier 2: Performance & Rendering */}
        <section className="p-6 rounded-2xl bg-white shadow-xl border border-gray-100 hover:border-cyan-200 transition-all group">
          <div className="w-12 h-12 rounded-lg bg-cyan-50 flex items-center justify-center mb-4 group-hover:bg-cyan-100 transition-colors">
            <Zap className="text-cyan-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">@opensourceframework/critters</h2>
          <p className="text-gray-600 mb-4 text-sm">
            Optimized critical CSS inlining with improved font preloading.
          </p>
          <span className="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs rounded font-mono">Perf++</span>
        </section>

        <section className="p-6 rounded-2xl bg-white shadow-xl border border-gray-100 hover:border-green-200 transition-all group">
          <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
            <Database className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">@opensourceframework/next-session</h2>
          <p className="text-gray-600 mb-4 text-sm">
            Unified session management supporting both Node.js and Web APIs.
          </p>
          <Link href="/api/session-info" className="text-green-600 font-medium hover:underline inline-flex items-center gap-1">
            Check Session <MousePointer2 size={14} />
          </Link>
        </section>

        {/* Tier 3: Images & Assets */}
        <section className="p-6 rounded-2xl bg-white shadow-xl border border-gray-100 hover:border-purple-200 transition-all group">
          <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
            <ImageIcon className="text-purple-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">@opensourceframework/next-images</h2>
          <p className="text-gray-600 mb-4 text-sm">
            Reliable Webpack image loader for legacy compatibility requirements.
          </p>
        </section>

        {/* Tier 4: Utilities */}
        <section className="p-6 rounded-2xl bg-white shadow-xl border border-gray-100 hover:border-orange-200 transition-all group">
          <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
            <Hash className="text-orange-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">@opensourceframework/seeded-rng</h2>
          <p className="text-gray-600 mb-4 text-sm">
            Deterministic random number generation for game logic and testing.
          </p>
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono">
            Seed: "osframework" → {Math.random().toFixed(5)}
          </div>
        </section>
      </div>

      <footer className="mt-20 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>© 2026 OpenSource Framework Contributors. Modernized for the Future.</p>
      </footer>
    </main>
  );
}
