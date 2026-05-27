process.env.NEXTAUTH_URL ||= "http://localhost:3000";

const NextAuth = require("@opensourceframework/next-auth");
const Providers = require("@opensourceframework/next-auth/providers");

const handler = NextAuth({
  providers: [
    Providers.Credentials({
      name: "Demo Account",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (credentials.username === "admin" && credentials.password === "admin") {
          return { id: "1", name: "Admin User", email: "admin@example.com" };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt(token: any, user: any) {
      if (user) token.id = user.id;
      return token;
    },
    async session(session: any, token: any) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  secret: "dummy-secret-for-showcase-only"
}) as any;

export { handler as GET, handler as POST };
