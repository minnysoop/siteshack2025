import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="m-3 bg-gray-800 text-white">
        {children}
      </body>
    </html>
  );
}
