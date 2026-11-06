import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "./providers";
import { PortfolioProvider } from "@/context/PortfolioContext";
import SmoothScrollProvider from "@/components/computer/SmoothScrollProvider";
import Footer from "@/components/footer/Footer";
import { ParticleCanvas } from "@/components/ParticleBackground";
import Navbar from "@/components/navbar/Navbar";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ScrollToTop from "@/components/ScrollToTop";
import CustomCursor from "@/components/CustomCursor";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nawfs Ul Ahsun",
  description: "My personal portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "min-h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        roboto.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground relative z-0">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <PortfolioProvider>
            <SmoothScrollProvider>
              <CustomCursor />
              <ScrollProgressBar />
              <ParticleCanvas />
              <Navbar />
              <main className="flex-1 w-full flex flex-col z-10">{children}</main>
              <Footer />
              <ScrollToTop />
            </SmoothScrollProvider>
          </PortfolioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
