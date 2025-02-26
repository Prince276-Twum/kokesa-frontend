"use client";
import React, { useState } from "react";
import Button from "../UI/Button";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import KokesaLogo from "./KokesaLogo";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center py-4">
        <Link href="/" className="z-20">
          <KokesaLogo />
        </Link>

        <button
          className="block md:hidden z-20 text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <AiOutlineClose size={32} />
          ) : (
            <AiOutlineMenu size={32} />
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex gap-6 text-white items-center">
            <li className="text-base font-semibold hover:text-[#FF6B3D] transition-colors">
              <Link href="/about">Reviews</Link>
            </li>
            <li className="text-base font-semibold hover:text-[#FF6B3D] transition-colors">
              <Link href="pricing">Pricing</Link>
            </li>
            <li>
              <Link
                className="text-[#EB5017] font-semibold hover:text-[#FF6B3D] transition-colors"
                href="auth/login"
              >
                Login
              </Link>
            </li>
            <li>
              <Button
                className="py-2 px-6 text-base font-semibold   transition-colors"
                href="auth/registration"
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
          <nav className="flex h-full items-center justify-center">
            <ul className="flex flex-col gap-8 text-center">
              <li className="text-xl font-semibold text-white hover:text-[#FF6B3D] transition-colors">
                <Link href="/about" onClick={toggleMenu}>
                  Reviews
                </Link>
              </li>
              <li className="text-xl font-semibold text-white hover:text-[#FF6B3D] transition-colors">
                <Link href="pricing" onClick={toggleMenu}>
                  Pricing
                </Link>
              </li>
              <li className="text-xl font-semibold text-[#EB5017] hover:text-[#FF6B3D] transition-colors">
                <Link href="auth/login" onClick={toggleMenu}>
                  Login
                </Link>
              </li>
              <li>
                <Button
                  className="py-3 px-8 text-lg font-semibold hover:bg-[#FF6B3D] transition-colors"
                  href=""
                  el="anchor"
                  rounded
                  outline
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
  );
}

export default NavBar;
