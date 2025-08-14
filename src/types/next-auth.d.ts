// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      remaining?: number;
      history?: any[];
    };
  }

  interface User {
    remaining?: number;
    history?: any[];
  }

  interface JWT {
    email?: string;
    name?: string;
    remaining?: number;
    history?: any[];
  }
}
