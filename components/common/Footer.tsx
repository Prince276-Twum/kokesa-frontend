// components/Footer.tsx
import React from "react";
import Link from "next/link";
import { FaInstagram, FaTwitter } from "react-icons/fa";
import { footerLinks } from "@/constant";
import FooterSection from "./FooterSection";

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-16 px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-[#EB5017] to-[#FF6B3D] rounded-lg flex items-center justify-center transform rotate-45">
                <span className="text-white font-bold text-lg transform -rotate-45">
                  K
                </span>
              </div>
              <span className="text-white text-xl font-semibold tracking-wide">
                kokesa
              </span>
            </div>
          </div>

          <FooterSection title="About Kokesa" links={footerLinks.about} />
          <FooterSection title="For business" links={footerLinks.business} />
          <FooterSection title="Legal" links={footerLinks.legal} />
          <FooterSection title="Social" links={footerLinks.social} />
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Kokesa. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-[#EB5017] transition-colors"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#EB5017] transition-colors"
              >
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
