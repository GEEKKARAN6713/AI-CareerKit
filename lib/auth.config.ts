import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe NextAuth configuration.
 * No database imports here — this config is consumed by the middleware,
 * which runs on the Edge runtime. The Credentials provider (which needs
 * Prisma + bcrypt) is added in `lib/auth.ts`, used only in Node.js.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      if (request.nextUrl.pathname.startsWith("/dashboard")) {
        return isLoggedIn; // false redirects to /signin with callbackUrl
      }
      return true;
    },
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }) {
  if (session.user && token.id) {
    session.user.id = String(token.id);
  }
  return session;
},
  },
} satisfies NextAuthConfig;
