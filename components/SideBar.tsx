import React from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { headerData } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialMedia from "./SocialMedia";
import { useOutsideClick } from "@/hooks/useOutsideClick";
interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}
const SideBar: React.FC<SideBarProps> = ({ isOpen, onClose }) => {
    const Pathname=usePathname();
    const SideBarRef= useOutsideClick<HTMLDivElement>(onClose);
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 bg-darkColor/50 shadow-xl hoverEffect w-full transition-transform duration-500 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <motion.div
    //   initial={{ opacity: "0" }}
    //   animate={{ opacity: "1" }}
    //     transition={{ duration: 0.5 , delay: 0.5}}
        className="min-x-72 max-w-96 bg-darkColor text-white/70 h-screen p-10 border-r border-r-gray-300
        flex-flex-col gap-6"
        ref={SideBarRef}
      >
        <div className="flex items-center justify-between pb-[4rem]">
            <button onClick={onClose}>

          <Logo className="text-white text-3xl">Nutrition</Logo>
            </button>
          <button className="hover:text-red-500" onClick={onClose}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="flex flex-col gap-5 text-md font-semibold tracking-wide">
      {headerData.map((item, index) => (
        <Link
          className={`hover:text-white hoverEffect relative group ${Pathname === item?.href &&"text-white " }`}
          href={item?.href}
          key={index}
          onClick={onClose}
        >
          {item?.title}
          <span className={`absolute h-0.5 w-full bg-white bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out ${Pathname === item?.href &&"scale-x-100" }`}  />
        </Link>
      ))}
    </div>
    <div className="py-[2rem]">
    <SocialMedia />

    </div>
      </motion.div>
    </div>
  );
};

export default SideBar;
