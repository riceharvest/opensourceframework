import NextAuth from "next-auth"
import Providers from "next-auth/providers"

export const authOptions = {
  providers: [
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "testuser" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials.username === "test" &&
          credentials.password === "test"
        ) {
          return { id: "1", name: "Test User", email: "test@example.com" }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: "test-secret-for-development",
}

export default NextAuth(authOptions)
