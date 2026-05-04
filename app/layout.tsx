import "./globals.css"
import QueryProvider from "@/components/ui/QueryProvider"

export const metadata = {
  title: "SnippetVault",
  description: "Public code snippet manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ background: "#0f172a", color: "white" }}>
        <QueryProvider>
          {children}
        </QueryProvider>
        
      </body>
    </html>
  );
}