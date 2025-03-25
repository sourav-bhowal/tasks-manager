import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// NextAuth configuration
export const { handlers, signIn, signOut, auth } = NextAuth({
  // Providers are defined here
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },

      // The authorize method is used to check credentials
      async authorize(credentials) {
        try {
          // Send the credentials to the backend
          const response = await fetch(
            `${process.env.HTTP_BACKEND_URL}/user/signin`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(credentials),
              credentials: "include",
            }
          );

          // If the response is not ok, throw an error
          if (!response.ok) {
            throw new Error("Invalid credentials");
          }

          // Return the user object
          const { user } = await response.json();

          return user;
        } catch (error) {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.email = token.email;
      session.user.accessToken = token.accessToken;

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
});
