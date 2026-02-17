import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({

  //This connects NextAuth to Prisma database.
  adapter: PrismaAdapter(prisma),

  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // const { email, password } = credentials

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { organization: true },
        })

        if (!user) return null

        const passwordMatch = bcrypt.compare(credentials.password, user.password)
        if (!passwordMatch) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.organizationId = user.organizationId
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.sub
      session.user.role = token.role
      session.user.organizationId = token.organizationId
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})