"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";
import styles from "./Header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const drawerRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  // load admin status
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoadingProfile(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        if (mounted) setIsAdmin(false);
        setLoadingProfile(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

      if (mounted) {
        setIsAdmin(!error && !!data?.is_admin);
        setLoadingProfile(false);
      }
    };

    load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // close menu when resizing to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // lock scroll when drawer is open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : prevOverflow || "";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // basic focus on the first element in the drawer
  useEffect(() => {
    if (!open || !drawerRef.current) return;
    const focusable = drawerRef.current.querySelector<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  }, [open]);

  const toggleMenu = () => setOpen((v) => !v);

  const isActive = (href: string, exact = false) => {
    if (!pathname) return false;
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const navLinkClass = (href: string, exact = false) =>
    `${styles["nav-link"]} ${isActive(href, exact) ? "" : ""}`;

  const drawerLinkClass = (href: string, exact = false) =>
    `${styles["drawer-link"]} ${isActive(href, exact) ? "" : ""}`;

  return (
    <>
      <header className={styles.header} role="banner">
        <div className={styles["safe-top"]} aria-hidden />
        <div className={styles["header-container"]}>
          {/* LOGO */}
          <Link
            href="/"
            className={styles.logo}
            aria-label="MasseurMatch - Home"
          >
            <span className={styles["logo-text"]}>
              <span className={styles["logo-masseur"]}>Masseur</span>
              <span className={styles["logo-match"]}>Match</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className={styles.nav} aria-label="Primary">
            <Link href="/" className={navLinkClass("/", true)}>
              Home
            </Link>
            <Link href="/explore" className={navLinkClass("/explore")}>
              Explore
            </Link>
            <Link href="/cities" className={navLinkClass("/cities")}>
              Cities
            </Link>
            <Link href="/about" className={navLinkClass("/about")}>
              About
            </Link>
            <Link href="/blog" className={navLinkClass("/blog")}>
              Blog
            </Link>
            <Link href="/join" className={navLinkClass("/join")}>
              Join
            </Link>
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className={styles.actions}>
            <Link
              href="/login"
              className={styles["btn-login"]}
              aria-label="Login"
            >
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M10 17l5-5-5-5M15 12H3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M21 21V3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className={styles["hide-sm"]}>Login</span>
            </Link>

            {!loadingProfile && isAdmin && (
              <>
                <Link
                  href="/dashboard"
                  className={styles["btn-dashboard"]}
                  aria-label="Dashboard"
                >
                  <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className={styles["hide-sm"]}>Dashboard</span>
                </Link>

                <Link
                  href="/admin"
                  className={`${styles["btn-admin"]} ${styles["hide-md"]}`}
                  aria-label="Admin"
                >
                  <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 12a5 5 0 100-10 5 5 0 000 10zM3 22a9 9 0 0118 0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={styles["hide-sm"]}>Admin</span>
                </Link>
              </>
            )}
          </div>

          {/* HAMBURGER (mobile only) */}
          <button
            className={styles["menu-toggle"]}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={toggleMenu}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* OVERLAY + MOBILE DRAWER */}
      <div
        className={`${styles.overlay} ${open ? styles.show : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <aside
        id="mobile-menu"
        className={`${styles.drawer} ${open ? styles.open : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        ref={drawerRef}
      >
        <nav className={styles["drawer-nav"]}>
          <Link
            href="/"
            className={drawerLinkClass("/", true)}
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/explore"
            className={drawerLinkClass("/explore")}
            onClick={() => setOpen(false)}
          >
            Explore
          </Link>
          <Link
            href="/about"
            className={drawerLinkClass("/about")}
            onClick={() => setOpen(false)}
          >
            About
          </Link>
          <Link
            href="/cities"
            className={drawerLinkClass("/cities")}
            onClick={() => setOpen(false)}
          >
            Cities
          </Link>
          <Link
            href="/blog"
            className={drawerLinkClass("/blog")}
            onClick={() => setOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/join"
            className={drawerLinkClass("/join")}
            onClick={() => setOpen(false)}
          >
            Join
          </Link>

          <div className={styles["drawer-actions"]}>
            <Link
              href="/login"
              className={styles["btn-login"]}
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
            {!loadingProfile && isAdmin && (
              <>
                <Link
                  href="/dashboard"
                  className={styles["btn-dashboard"]}
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin"
                  className={styles["btn-admin"]}
                  onClick={() => setOpen(false)}
                >
                  Admin
                </Link>
              </>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
