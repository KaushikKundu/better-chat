import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    Credentials({
        name: 'Credentials',
        credentials: {
          username: { label: 'email', type: 'text', placeholder: '' },
          password: { label: 'password', type: 'password', placeholder: '' },
        },
        async authorize(credentials: any) {
            
             return {
                  id: "user1",
                  name: "asd",
                  userId: "asd",
                  email: "ramdomEmail"
              };
        },
      })
],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth',
  }
})

export {handler as GET, handler as POST};