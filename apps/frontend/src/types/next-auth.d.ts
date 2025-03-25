import "next-auth";

// Extend the default session with custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      username?: string;
      email?: string;
      accessToken?: string;
    } & DefaultSession["user"];
  }

  // Extend the default user with custom properties
  interface User {
    id?: string;
    username?: string;
    email?: string;
    accessToken?: string;
  }
}

// Extend the JWT contents with custom properties
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    email?: string;
    accessToken?: string;
  }
}
