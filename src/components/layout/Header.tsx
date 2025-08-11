"use client";

import { useAuth } from "@/context/AuthContext";
import { getNavLinks } from "@/lib/constants/navLinks";
import { useLocalizedPaths } from "@/lib/hooks/useLocalizedPaths";
import { logoutUser } from "@/services/authService";
import { LogOut, Menu, User, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Header = () => {
  const t = useTranslations("Header");
  const paths = useLocalizedPaths();
  const navLinks = getNavLinks(t, paths);
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    router.replace(paths.auth.login);
  };

  return (
    <header className="bg-background border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={paths.root} className="flex items-center gap-2">
          <div className="relative w-12 h-12">
            <Image
              src="/images/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              sizes="48px"
            />
          </div>
          <span className="font-bold text-lg">{t("brandName")}</span>
        </Link>

        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm hover:underline"
            >
              {link.name}
            </a>
          ))}

          {user && (
            <div className="relative ml-4">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 text-sm font-medium hover:underline"
              >
                <User className="w-4 h-4" />
                {user.firstName}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-border rounded shadow-md w-44 z-50">
                  <Link
                    href={paths.account}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    {t("myAccount")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-muted"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        <button
          className="md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <nav className="md:hidden px-4 pb-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm hover:underline"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}

          {user && (
            <>
              <hr className="my-2 border-border" />
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 text-sm font-medium hover:underline"
              >
                <User className="w-4 h-4" />
                {user.firstName}
              </button>

              {dropdownOpen && (
                <div className="pl-4 flex flex-col gap-2 mt-2">
                  <Link
                    href={paths.account}
                    className="flex items-center gap-2 text-sm hover:underline"
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    <User className="w-4 h-4" />
                    {t("myAccount")}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 text-sm text-left hover:underline"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("logout")}
                  </button>
                </div>
              )}
            </>
          )}
        </nav>
      )}
    </header>
  );
};
