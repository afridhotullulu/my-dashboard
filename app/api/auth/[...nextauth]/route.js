import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login', // Mengarahkan NextAuth ke halaman login kustommu jika gagal
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Memaksa NextAuth agar selalu mengarahkan ke /dashboard setelah sukses
      return `${baseUrl}/dashboard`;
    },
  },
});

export { handler as GET, handler as POST };