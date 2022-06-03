import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const payload = {
          email: credentials.email,
          password: credentials.password,
        };

        const res = await fetch("http://localhost:8000/api/auth/login", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": "en-US",
          },
        });

        const user = await res.json();
        if (!res.ok) {
          throw new Error("Invalid credentials");
        }
        if (res.ok && user) {
          return user;
        }

        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: user.data.accessToken,
          refreshToken: user.data.refreshToken,
          expiresIn: user.data.tokenExpirationDate,
          id: user.data.id,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.accessTokenExpires = token.tokenExpirationDate;

      return session;
    },

    async redirect({ url, baseUrl }) {
      console.log(url, baseUrl);
      // Allows relative callback URLs
      return `${baseUrl}/chat`;
      // if (url.startsWith("/"))
      // // Allows callback URLs on the same origin
      // else if (new URL(url).origin === baseUrl) return url;
      // return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === "development",
});
