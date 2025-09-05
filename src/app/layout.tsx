import "./globals.css";
import AuthProvider from "@/providers/auth-provider";
import UserProvider from "@/providers/user-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <UserProvider>
          <body className="bg-gray-800 text-white">
            {children}
          </body>
        </UserProvider>
      </AuthProvider>
    </html>
  );
}
