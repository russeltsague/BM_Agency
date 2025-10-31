import { getServerSession } from 'next-auth';
import { Session } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // Add your authentication providers here
    // Example:
    // CredentialsProvider({
    //   name: 'Credentials',
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Password", type: "password" }
    //   },
    //   async authorize(credentials, req) {
    //     // Add your authorization logic here
    //   }
    // })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: AdapterUser }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getAuthSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getAuthSession();
  return !!session?.user;
}

export async function getAuthToken(): Promise<string | undefined> {
  const session = await getAuthSession();
  return (session as any)?.accessToken;
}

export async function getCurrentUser() {
  const session = await getAuthSession();
  return session?.user;
}
