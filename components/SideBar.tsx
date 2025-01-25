import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import { headerData } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialMedia from "./SocialMedia";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import Image from "next/image";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ isOpen, onClose }) => {
  const Pathname = usePathname();
  const SideBarRef = useOutsideClick<HTMLDivElement>(onClose);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 bg-darkColor/50 shadow-xl hoverEffect w-full transition-transform duration-500 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <motion.div
        className="min-x-72 max-w-96 bg-darkColor text-white/70 h-screen p-8 border-r border-r-gray-300 flex flex-col gap-6"
        ref={SideBarRef}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between pb-8">
          <Link href={"/"} onClick={onClose}>
          <Image
  src={"/logo.png"}
  alt="logo"
  width={140} // Slightly increased from 120 to 140
  height={140} // Increased to match the width
  className="w-36 h-36 object-contain mx-auto" // Tailwind utility for consistent centering
/>

          </Link>
          <button className="hover:text-red-500" onClick={onClose}>
            <X className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-5 text-lg font-semibold tracking-wide">
          {headerData.map((item, index) => (
            <Link
              className={`hover:text-white hoverEffect relative group ${
                Pathname === item?.href && "text-white"
              }`}
              href={item?.href}
              key={index}
              onClick={onClose}
            >
              {item?.title}
              <span
                className={`absolute h-0.5 w-full bg-white bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out ${
                  Pathname === item?.href && "scale-x-100"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Social Media Section */}
        <div className="py-6">
          <SocialMedia />
        </div>
      </motion.div>
    </div>
  );
};

export default SideBar;
