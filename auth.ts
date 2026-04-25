import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { trackEngagement } from "@/lib/engagement";
import { generateDummyDataForUser } from "@/lib/dummyData";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      id: "user-login",
      name: "Quick Access",
      credentials: {
        name: { label: "Name", type: "text" },
      },
      authorize: async (credentials) => {
        if (!credentials?.name || typeof credentials.name !== "string") return null;
        
        const name = credentials.name.trim();
        const email = `${name.replace(/\s+/g, '').toLowerCase()}@wellnedd.local`;
        
        const hash = await bcrypt.hash("password123", 10);
        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            name,
            email,
            hashedPassword: hash,
            role: "USER",
          },
        });
        
        await generateDummyDataForUser(user.id);
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    Credentials({
      id: "staff-login",
      name: "Staff Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.hashedPassword);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (user.id) {
        await trackEngagement(user.id, "LOGIN", { entityType: "Auth" });
      }
    },
  },
});
