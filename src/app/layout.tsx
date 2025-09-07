import "./globals.css";
import AuthProvider from "@/providers/auth-provider";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
          <body className={`${poppins.className} bg-black text-white`}>
            {children}
          </body>
      </AuthProvider>
    </html>
  );
}
