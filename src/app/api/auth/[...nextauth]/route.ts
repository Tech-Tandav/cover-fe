/* eslint-disable @typescript-eslint/no-explicit-any */
import { authServices } from "@/domain/services/authService";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const data = await authServices.login({
            username: credentials.username,
            password: credentials.password,
          });

          if (!data?.token) return null;

          const role = data.user?.is_staff ? "owner" : "customer";
          return {
            id: String(data.user.id),
            name: data.user.username,
            email: data.user.email ?? "",
            token: data.token,
            phone: data.user.phone ?? "",
            role,
          } as any;
        } catch {
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).token;
        token.role = (user as any).role;
        token.username = user.name ?? "";
        token.userId = String(user.id);
        token.email = user.email ?? "";
        token.phone = (user as any).phone ?? "";
      }
      return token;
    },

    async session({ session, token }) {
      if (!session.user) {
        session.user = {} as any;
      }
      session.user.name = token.username as string;
      session.user.email = token.email as string;
      (session.user as any).role = token.role as string;
      (session.user as any).id = token.userId as string;
      (session.user as any).phone = token.phone as string;
      (session as any).accessToken = token.accessToken as string;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
