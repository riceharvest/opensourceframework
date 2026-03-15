"use client";

import { useSession, signIn, signOut } from "@opensourceframework/next-auth/client";
import { Lock, LogIn, LogOut, User } from "lucide-react";
import Link from "next/link";

export default function AuthDemo() {
  const [session, loading] = useSession();

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto font-sans">
      <nav className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">← Back to Showcase</Link>
      </nav>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="text-blue-600 w-8 h-8" />
          <h1 className="text-3xl font-bold">NextAuth Modernization Demo</h1>
        </div>
        <p className="text-gray-600">
          This page demonstrates the modernized <strong>@opensourceframework/next-auth</strong> (v3 legacy fork) 
          running in a Next.js 16 App Router environment.
        </p>
      </header>

      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : session ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
              <div className="bg-green-100 p-3 rounded-full">
                <User className="text-green-600" />
              </div>
              <div>
                <p className="font-bold text-green-900">Signed in as {session.user?.name}</p>
                <p className="text-sm text-green-700">{session.user?.email}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl font-mono text-xs overflow-auto max-h-48">
              <pre>{JSON.stringify(session, null, 2)}</pre>
            </div>

            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-8 italic">You are currently signed out.</p>
            <button
              onClick={() => signIn()}
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:-translate-y-1 active:translate-y-0 mx-auto"
            >
              <LogIn size={20} /> Sign In to Demo
            </button>
            <p className="mt-6 text-sm text-gray-400">
              Use <strong>admin / admin</strong> to login.
            </p>
          </div>
        )}
      </div>

      <section className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100">
        <h3 className="font-bold text-blue-900 mb-2">Modernization Highlights:</h3>
        <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
          <li>Async <code className="bg-blue-100 px-1 rounded text-blue-900">cookies()</code> support verified</li>
          <li>Refactored <code className="bg-blue-100 px-1 rounded text-blue-900">url</code> object logic</li>
          <li>Zero-dependency native OAuth2 implementation</li>
          <li>React 19 concurrent rendering compatible</li>
        </ul>
      </section>
    </main>
  );
}
