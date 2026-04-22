"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActivityIcon, BrainIcon, HomeIcon, MoonIcon, SunIcon } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: HomeIcon },
  { label: "Telemetry", href: "/telemetry", icon: ActivityIcon },
  { label: "Decisions", href: "/decisions", icon: BrainIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof document === "undefined") {
      return "dark";
    }
    const current = document.documentElement.getAttribute("data-theme");
    return current === "light" ? "light" : "dark";
  });

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next === "light" ? "light" : "dark");
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-logo">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <circle cx="7" cy="7" r="5" fill="var(--color-primary)" className="pulse-dot" />
        </svg>
        <strong className="sidebar-label">Arbiter</strong>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`sidebar-link${isActive ? " active" : ""}`}
              aria-label={label}
            >
              <Icon size={18} />
              <span className="sidebar-label">{label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        <span className="sidebar-label">Theme</span>
      </button>
    </aside>
  );
}
