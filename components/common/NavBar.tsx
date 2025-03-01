"use client";
import React, { useState, useEffect } from "react";
import Button from "../UI/Button";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import KokesaLogo from "./KokesaLogo";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for professional appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-container px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="z-20">
            <KokesaLogo />
          </Link>

          <button
            className={`block md:hidden z-20 focus:outline-none transition-colors ${
              isMenuOpen || !isScrolled ? "text-white" : "text-text-primary"
            }`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <AiOutlineClose size={28} />
            ) : (
              <AiOutlineMenu size={28} />
            )}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex gap-8 items-center">
              <li>
                <Link
                  href="/about"
                  className={`text-base font-semibold hover:text-primary transition-colors ${
                    isScrolled ? "text-text-primary" : "text-white"
                  }`}
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className={`text-base font-semibold hover:text-primary transition-colors ${
                    isScrolled ? "text-text-primary" : "text-white"
                  }`}
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  className={`text-primary font-semibold hover:text-primary-light transition-colors`}
                  href="/auth/login"
                >
                  Login
                </Link>
              </li>
              <li>
                <Button
                  className="py-2.5 px-6 text-base font-semibold transition-colors ml-2"
                  href="/auth/registration"
                  el="anchor"
                  rounded
                  primary
                >
                  Sign up
                </Button>
              </li>
            </ul>
          </nav>

          {/* Mobile Navigation */}
          <div
            className={`fixed inset-0 bg-black/95 z-10 md:hidden transition-transform duration-300 ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex h-full items-center justify-center">
              <nav className="w-full max-w-sm mx-auto px-8">
                <ul className="flex flex-col gap-8 text-center">
                  <li>
                    <Link
                      href="/about"
                      onClick={toggleMenu}
                      className="text-xl font-semibold text-white hover:text-primary transition-colors inline-block py-2"
                    >
                      Reviews
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/pricing"
                      onClick={toggleMenu}
                      className="text-xl font-semibold text-white hover:text-primary transition-colors inline-block py-2"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-primary font-semibold hover:text-primary-light transition-colors inline-block py-2 text-xl"
                      href="/auth/login"
                      onClick={toggleMenu}
                    >
                      Login
                    </Link>
                  </li>
                  <li className="mt-4">
                    <Button
                      className="py-3 px-10 text-lg font-semibold transition-colors w-full"
                      href="/auth/registration"
                      el="anchor"
                      rounded
                      primary
                      onClick={toggleMenu}
                    >
                      Sign up
                    </Button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
