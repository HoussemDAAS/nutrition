"use client";
import { AlignLeft } from "lucide-react";
import React from "react";
import SideBar from "./SideBar";

const MobileMenu = () => {
  const [showSideBar, setShowSideBar] = React.useState(false);
  return (
    <>
      <button onClick={() => setShowSideBar(!showSideBar)}>
        <AlignLeft className="w-6 h-6 hover:text-darkColor hoverEffect md:hidden" />
      </button >
      <div className="md:hidden">
        <SideBar isOpen={showSideBar} onClose={() => setShowSideBar(false)} />
      </div>
    </>
  );
};

export default MobileMenu;
