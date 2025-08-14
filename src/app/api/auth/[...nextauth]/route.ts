import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch("http://18.143.206.136/flaskapp/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          const text = await res.text();
          if (!text) return null;
          const user = JSON.parse(text);
          if (user?.email) return user;

          return null;
        } catch (error) {
          console.error("Credentials auth error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  debug: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Handle Google sign-in
      if (account?.provider === "google" && user?.email) {
        try {
          const res = await fetch("http://18.143.206.136/flaskapp/google-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, name: user.name }),
          });

          if (!res.ok) {
            console.error("Google login failed:", res.status, res.statusText);
            return token;
          }

          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            console.error("Response is not JSON");
            return token;
          }

          const data = await res.json();
          token.email = data.email;
          token.name = data.name;
          token.remaining = data.remaining;
          token.history = data.history;
        } catch (err) {
          console.error("Error calling Flask /google-login:", err);
        }
      }

      // For credentials login
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.remaining = user.remaining;
        token.history = user.history;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        email: token.email as string,
        name: token.name as string,
        remaining: token.remaining,
        history: token.history,
      } as any;
      return session;
    },
  },
});

export { handler as GET, handler as POST };