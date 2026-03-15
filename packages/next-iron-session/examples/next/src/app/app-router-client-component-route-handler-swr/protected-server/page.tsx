import { Title } from "@/app/title";
import { Suspense } from "react";
import * as css from "@/app/css";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "../lib";
import Link from "next/link";

// Next.js 16: 'use cache' with private data (cookies) makes it dynamic
export const dynamic = "force-dynamic";

async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  return session;
}

export default function ProtectedServer() {
  return (
    <main className="p-10 space-y-5">
      <Title subtitle="Protected page" />
      <Suspense fallback={<p className="text-lg">Loading...</p>}>
        <Content />
      </Suspense>
      <p>
        <Link
          href="/app-router-client-component-route-handler-swr"
          className={css.link}
        >
          ← Back
        </Link>
      </p>
    </main>
  );
}

async function Content() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect("/app-router-client-component-route-handler-swr");
  }

  return (
    <div className="max-w-xl space-y-2">
      <p>
        Hello <strong>{session.username}!</strong>
      </p>
      <p>
        This page is protected and can only be accessed if you are logged in.
        Otherwise you will be redirected to the login page.
      </p>
      <p>The check is done via a server component.</p>
    </div>
  );
}
