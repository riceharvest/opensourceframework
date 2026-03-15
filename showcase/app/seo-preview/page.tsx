"use client";

import { NextSeo, ArticleJsonLd } from "@opensourceframework/next-seo";
import { Search, Eye, Code, Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SeoPreview() {
  const [title, setTitle] = useState("My Awesome Page");
  const [description, setDescription] = useState("This is a modernized page using @opensourceframework/next-seo.");

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto font-sans">
      <NextSeo
        title={title}
        description={description}
        canonical="https://showcase.opensourceframework.com/seo-preview"
        openGraph={{
          title: title,
          description: description,
          url: "https://showcase.opensourceframework.com/seo-preview",
          type: "website",
        }}
      />
      <ArticleJsonLd
        url="https://showcase.opensourceframework.com/seo-preview"
        headline={title}
        datePublished="2026-03-12T00:00:00Z"
        authorName="Rice Harvest"
        description={description}
        image="https://showcase.opensourceframework.com/og-image.jpg"
      />

      <nav className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">← Back to Showcase</Link>
      </nav>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Search className="text-blue-600 w-8 h-8" />
          <h1 className="text-3xl font-bold">SEO & JSON-LD Preview</h1>
        </div>
        <p className="text-gray-600">
          Dynamically manage your SEO tags and structured data using <strong>@opensourceframework/next-seo</strong>.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Editor */}
        <section className="space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Code size={20} className="text-blue-500" /> Page Metadata
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Tip:</strong> Open your browser's DevTools or view the page source to see the 
              meta tags and JSON-LD scripts update in real-time.
            </p>
          </div>
        </section>

        {/* Mock Search Result */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Eye size={20} className="text-blue-500" /> Google Search Preview
          </h2>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-50">
            <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              opensourceframework.com › seo-preview <Tag size={12} />
            </div>
            <h3 className="text-xl text-blue-800 font-medium mb-1 hover:underline cursor-pointer">
              {title} | OpenSource Framework
            </h3>
            <p className="text-sm text-gray-700 line-clamp-2">
              {description}
            </p>
          </div>

          <div className="p-6 bg-gray-900 rounded-2xl text-green-400 font-mono text-xs overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center mb-4 text-gray-500 border-b border-gray-800 pb-2">
              <span>Generated JSON-LD</span>
              <span className="px-2 py-0.5 rounded bg-gray-800">ld+json</span>
            </div>
            <pre className="overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${title}",
  "author": "Rice Harvest",
  "description": "${description}"
}`}
            </pre>
          </div>
        </section>
      </div>
    </main>
  );
}
