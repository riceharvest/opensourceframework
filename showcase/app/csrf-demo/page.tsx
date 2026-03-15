"use client";

import { Shield, AlertCircle, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CsrfDemo() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const simulateAction = async (withToken: boolean) => {
    setStatus('loading');
    
    try {
      // In a real app, this would be a fetch to an actual API route protected by next-csrf
      // Here we simulate the behavior for the demo.
      await new Promise(r => setTimeout(r, 1000));
      
      if (!withToken) {
        throw new Error('CSRF token mismatch');
      }
      
      setStatus('success');
      setMessage('Action performed successfully! CSRF token was validated.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto font-sans">
      <nav className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">← Back to Showcase</Link>
      </nav>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-red-600 w-8 h-8" />
          <h1 className="text-3xl font-bold">CSRF Protection Demo</h1>
        </div>
        <p className="text-gray-600">
          Secure your Next.js 16 Route Handlers and Server Actions using <strong>@opensourceframework/next-csrf</strong>.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Scenario 1: Unprotected/Malicious */}
        <div className="p-8 rounded-3xl bg-white shadow-xl border border-red-100 flex flex-col">
          <div className="flex items-center gap-2 text-red-600 font-bold mb-4">
            <AlertCircle size={20} /> Malicious Attempt
          </div>
          <p className="text-sm text-gray-500 mb-8 flex-1">
            Simulate a cross-site request where the required CSRF token is missing or incorrect.
          </p>
          <button
            onClick={() => simulateAction(false)}
            disabled={status === 'loading'}
            className="w-full py-3 bg-red-50 text-red-700 rounded-xl font-bold hover:bg-red-100 transition-colors"
          >
            Submit Without Token
          </button>
        </div>

        {/* Scenario 2: Protected */}
        <div className="p-8 rounded-3xl bg-white shadow-xl border border-green-100 flex flex-col">
          <div className="flex items-center gap-2 text-green-600 font-bold mb-4">
            <CheckCircle2 size={20} /> Verified Request
          </div>
          <p className="text-sm text-gray-500 mb-8 flex-1">
            A legitimate request from your application that includes the correct CSRF token in headers/cookies.
          </p>
          <button
            onClick={() => simulateAction(true)}
            disabled={status === 'loading'}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-100"
          >
            Submit With Token
          </button>
        </div>
      </div>

      {status !== 'idle' && (
        <div className={`mt-12 p-6 rounded-2xl border ${
          status === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 
          status === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 
          'bg-gray-50 border-gray-200 text-gray-800'
        } animate-in fade-in slide-in-from-top-4`}>
          <div className="flex items-center gap-3">
            {status === 'loading' && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>}
            {status === 'success' && <CheckCircle2 size={20} />}
            {status === 'error' && <AlertCircle size={20} />}
            <p className="font-medium">{status === 'loading' ? 'Validating request...' : message}</p>
          </div>
        </div>
      )}

      <section className="mt-12 p-6 bg-red-50 rounded-2xl border border-red-100">
        <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
          <Lock size={16} /> Security Implementation:
        </h3>
        <p className="text-sm text-red-800 mb-4">
          <strong>@opensourceframework/next-csrf</strong> uses double-submit cookie pattern optimized for Next.js 16:
        </p>
        <ul className="text-xs text-red-700 list-disc list-inside space-y-1 font-mono">
          <li>await cookies() // Async access</li>
          <li>await headers() // Multi-check validation</li>
          <li>Edge-compatible crypto</li>
        </ul>
      </section>
    </main>
  );
}
