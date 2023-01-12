import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const SCOPES = {
  EMAIL_SCOPE: 'https://www.googleapis.com/auth/userinfo.email',
  PROFILE_SCOPE: 'https://www.googleapis.com/auth/userinfo.profile',
  CALENDAR_SCOPE: 'https://www.googleapis.com/auth/calendar',
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRECT,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

      authorization: {
        params: { scope: Object.values(SCOPES).join(' ') },
      },
    }),
    // ...add more providers here
  ],

  callbacks: {
    async signIn({ account }) {
      console.log(account?.scope)

      if (!account?.scope?.includes(SCOPES.CALENDAR_SCOPE)) {
        return '/register/connect-calendar/?error=permissions'
      } else {
        return true
      }
    },
  },
}
export default NextAuth(authOptions)
