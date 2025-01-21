"use client";
import { headerData } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const HeaderMenu = () => {
  const Pathname=usePathname();
  return (
    <div className="hidden md:inline-flex w-1/3 items-center gap-5 text-sm capitalize font-semibold">
      {headerData.map((item, index) => (
        <Link
          className={`hover:text-darkColor hoverEffect relative group ${Pathname === item?.href &&"text-darkColor " }`}
          href={item?.href}
          key={index}
        >
          {item?.title}
          <span className={`absolute h-0.5 w-full bg-darkColor bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out ${Pathname === item?.href &&"scale-x-100" }`}  />
        </Link>
      ))}
    </div>
  );
};

export default HeaderMenu;
