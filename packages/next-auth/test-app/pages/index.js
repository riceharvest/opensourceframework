import { useSession, signIn, signOut } from "next-auth/client"
import Head from "next/head"

export default function Home() {
  const [session, loading] = useSession()

  return (
    <div>
      <Head>
        <title>NextAuth.js Hydration Test</title>
      </Head>
      <main>
        <h1>NextAuth.js Hydration Test</h1>
        <p>Status: {loading ? "loading" : "idle"}</p>
        {session ? (
          <div>
            <p>Signed in as: {session.user?.name}</p>
            <button onClick={() => signOut()}>Sign out</button>
          </div>
        ) : (
          <div>
            <p>Not signed in</p>
            <button onClick={() => signIn()}>Sign in</button>
          </div>
        )}
      </main>
    </div>
  )
}
