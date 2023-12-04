import type { NextAuthConfig } from "next-auth"

export default {
  providers: [],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl
    },
    jwt({ token, user }) {
      if (user) {
        token.sub = user.sub
        token.email_verified = user.email_verified
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.sub = token.jti as string
        session.user.email_verified = new Date(token.iat as number * 1000).toISOString()
      }
      return session
    }
  }
} satisfies NextAuthConfig