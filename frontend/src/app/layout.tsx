import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import MobileCompanionHUD from "@/components/mobile/MobileCompanionHUD";

export const metadata: Metadata = {
  title: "ClashMate — Your village. Your schedule. Your Clash companion.",
  description: "ClashMate is an unofficial, community-focused Clash of Clans mobile companion platform. Monitor village upgrades, timers, configurable notifications, analytics, Busy Mode, and AI insights.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ClashMate",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">
        <Navbar />
        <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
          <Sidebar />
          <main className="flex-1 min-w-0 overflow-y-auto pb-24 lg:pb-8">
            {children}
          </main>
        </div>

        {/* Mobile Navigation & Floating HUD */}
        <MobileBottomNav />
        <MobileCompanionHUD />

        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('ServiceWorker registration skipped or failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
