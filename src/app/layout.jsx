import "./globals.css";
import Navbar from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { SportsProvider } from "@/contexts/SportsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "SportsBook - College Sports Reimagined",
  description: "Book courts, track live scores, and join teams.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased`}>
        <ToastProvider>
          <AuthProvider>
            <SportsProvider>
              <ThemeProvider>
                <Navbar />
                <main>{children}</main>
                <Footer />
              </ThemeProvider>
            </SportsProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
