import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name?: string | null;
      type?: "student" | "business" | "other";
      college?: string | null;
      department?: string | null;
      gradYear?: string | null;
      phone?: string | null;
      createdAt?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name?: string | null;
    type?: "student" | "business" | "other";
    college?: string | null;
    department?: string | null;
    gradYear?: string | null;
    phone?: string | null;
    createdAt?: Date;
    password?: string | null;
  }

  interface JWT {
    id: string;
    name?: string | null;
    type?: "student" | "business" | "other";
    college?: string | null;
    department?: string | null;
    gradYear?: string | null;
    phone?: string | null;
    createdAt?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",   // forces Google to show the account chooser
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.password) {
          throw new Error("This account was created with Google. Please sign in with Google.");
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          type: user.type,
          college: user.college,
          department: user.department,
          gradYear: user.gradYear,
          phone: user.phone,
          createdAt: user.createdAt,
        };
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    //  NEW: Handles Google + credentials linking
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser && !existingUser.password) {
          // Already a Google account → OK
          return true;
        }

        if (existingUser && existingUser.password) {
          //  Auto-link Google account to existing credentials aaccount
          const linkedAccount = await prisma.account.findFirst({
            where: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          });

          if (!linkedAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type!,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
          }

          return true;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        token.type = "other";
      }

      if (user) {
        token.id = user.id;
        token.name = user.name ?? token.name ?? null;
        token.type = user.type ?? token.type ?? "other";
        token.college = user.college ?? null;
        token.department = user.department ?? null;
        token.gradYear = user.gradYear ?? null;
        token.phone = user.phone ?? null;
        token.createdAt = user.createdAt
          ? new Date(user.createdAt).toISOString()
          : token.createdAt ?? null;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string | null;
        session.user.type = token.type as "student" | "business" | "other" | undefined ?? "other";
        session.user.college = token.college as string | null;
        session.user.department = token.department as string | null;
        session.user.gradYear = token.gradYear as string | null;
        session.user.phone = token.phone as string | null;
        session.user.createdAt = token.createdAt as string | undefined;
      }
      // console.log("Session:", session);
      return session;
    },
  },
};