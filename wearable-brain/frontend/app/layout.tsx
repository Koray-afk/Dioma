import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wearable Brain Dashboard",
  description: "Telemetry and AI decision dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeBootstrap = `
    (() => {
      const saved = localStorage.getItem("theme");
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const theme = saved || (systemDark ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", theme);

      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
        }
      });
    })();
  `;

  return (
    <html lang="en" data-theme="dark">
      <body className={geistSans.className}>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <div className="app-shell">
          <Sidebar />
          <section className="app-content">
            <TopBar />
            <main className="app-main">{children}</main>
          </section>
        </div>
      </body>
    </html>
  );
}
