import "./globals.css";
import AuthProvider from "@/providers/auth-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
          <body className="bg-gray-800 text-white">
            {children}
          </body>
      </AuthProvider>
    </html>
  );
}
