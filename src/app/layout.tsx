import type { Metadata } from "next";
import { Epilogue, Inter } from "next/font/google";
import "./globals.css";
import { QuickViewModal } from "@/components/modules/products/QuickViewModal";
import { Header } from "@/components/shared/header/index";
import { Footer } from "@/components/shared/footer/Footer";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ThemeApplier } from "@/components/providers/ThemeApplier";
import { AnnouncementBanner } from "@/components/modules/homepage/AnnouncementBanner";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KindCotton — Sustainable Fashion",
  description:
    "Eco-friendly fabrics crafted for everyday comfort. Shop the KindCotton collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${epilogue.variable} ${inter.variable} antialiased`}>
        <ReduxProvider>
          <ThemeApplier />
          <div className="flex flex-col min-h-screen">
            <AnnouncementBanner />
            <Header />
            <main className="grow">
              {children}
              <QuickViewModal />
            </main>
            <Footer />
          </div>
          <ScrollToTop />
        </ReduxProvider>
      </body>
    </html>
  );
}
