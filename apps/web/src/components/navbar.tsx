"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@t2p-admin/ui/components/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@t2p-admin/ui/components/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./logo";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const navLinks = useMemo(
    () => [
      { href: "#home", label: "Home" },
      { href: "#courses", label: "Courses" },
      { href: "#about", label: "About us" },
      { href: "#contact", label: "Contact Us" },
    ],
    []
  );

  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      let current = "";
      for (const link of navLinks) {
        const section = document.querySelector(link.href);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom > 80) {
            current = link.href;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks, isHome]);

  const linkClass = useMemo(
    () => (href: string) =>
      `text-sm font-medium transition-colors ${
        activeSection === href
          ? "text-primary font-semibold"
          : "text-muted-foreground hover:text-foreground"
      }`,
    [activeSection]
  );

  const getHref = (hash: string) => (isHome ? hash : `/${hash}`);

  return (
    <>
      {/* Demo Class Banner */}
      <Link
        href="#demo"
        className="fixed top-0 left-0 w-full z-[20] bg-primary text-white py-2.5 px-4 shadow-lg hover:opacity-90 transition-opacity duration-200"
      >
        <div className="flex overflow-hidden w-full sm:w-auto justify-center">
          <span className="text-sm sm:text-base font-semibold whitespace-nowrap">
            {/* Mobile view */}
            <span className="sm:hidden text-center hover:underline decoration-2 underline-offset-2">
              Book Your Free Demo Class Today!
            </span>

            {/* Large screen view */}
            <span className="hidden sm:inline hover:underline decoration-2 underline-offset-4">
              Transform Your Skills - Book Your Free Demo Class Today!
            </span>
          </span>
        </div>
      </Link>

      {/* Main Navbar */}
      <nav
        className={`fixed left-0 w-full z-50 transition-all duration-300 top-[55px]`}
      >
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between px-4 py-2 bg-background/70 backdrop-blur-md border border-border shadow-sm rounded-full">
            {/* Brand */}
            <Logo />

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6 px-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={getHref(link.href)}
                  className={linkClass(link.href)}
                >
                  {link.label}
                </Link>
              ))}
              {/* <Button
                asChild
                variant="default"
                size="lg"
                className="rounded-full"
              >
                <Link href={"https://accounts.talk2partners.com"}>Login</Link>
              </Button> */}
            </div>

            {/* Mobile Hamburger */}
            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:max-w-sm h-full p-6 flex flex-col items-center justify-start bg-background z-[100] backdrop-blur-lg backdrop-brightness-90"
                >
                  <SheetHeader className="w-full items-center">
                    <SheetTitle className="text-2xl font-bold text-center">
                      Young Guru <span className="text-primary">Academy</span>
                    </SheetTitle>
                  </SheetHeader>

                  {/* Mobile Nav Links */}
                  <div className="flex flex-col gap-4 mt-6 w-full max-w-xs text-center">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={getHref(link.href)}
                        className={linkClass(link.href)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    {/* <Button
                      asChild
                      variant="default"
                      size="lg"
                      className="rounded-full w-full mt-6"
                    >
                      <Link href={"https://accounts.talk2partners.com"}>
                        Login
                      </Link>
                    </Button> */}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
