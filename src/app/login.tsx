import NextAuth from "next-auth";
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
          const res = await fetch("https://rsmp.onrender.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          const text = await res.text();
          console.log("Raw login response text:", text);

          if (!text) return null;

          const user = JSON.parse(text);

          if (user?.email) {
            return user;
          }

          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
  if (session.user) {
    session.user.email = token.email as string;
    session.user.name = token.name as string;
  } else {
    session.user = {
      email: token.email as string,
      name: token.name as string,
    };
  }

  return session;
},
  },
});

export { handler as GET, handler as POST };
