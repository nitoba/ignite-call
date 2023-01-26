import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'
import { PrismaAdapter } from '../../../lib/auth/prisma-adapter'

const SCOPES = {
  EMAIL_SCOPE: 'https://www.googleapis.com/auth/userinfo.email',
  PROFILE_SCOPE: 'https://www.googleapis.com/auth/userinfo.profile',
  CALENDAR_SCOPE: 'https://www.googleapis.com/auth/calendar',
}

export function buildNextAuthOptions(
  req: NextApiRequest,
  res: NextApiResponse,
): AuthOptions {
  return {
    secret: process.env.NEXTAUTH_SECRECT,
    adapter: PrismaAdapter(req, res),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

        authorization: {
          params: { scope: Object.values(SCOPES).join(' ') },
        },

        profile: (profile: GoogleProfile) => {
          return {
            id: profile.sub,
            email: profile.email,
            name: profile.name,
            username: '',
            avatar_url: profile.picture,
          }
        },
      }),
      // ...add more providers here
    ],

    callbacks: {
      async signIn({ account }) {
        if (!account?.scope?.includes(SCOPES.CALENDAR_SCOPE)) {
          return '/register/connect-calendar/?error=permissions'
        } else {
          return true
        }
      },

      async session({ session, user }) {
        return {
          ...session,
          user,
        }
      },
    },
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, buildNextAuthOptions(req, res))
}
