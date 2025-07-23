import Image from "next/image";
import React from "react";
import NearWalletConnector from "./NearWalletConnector";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-[#334155] px-6 py-4 md:px-16 md:py-6">
      <Image
        src="/bitte-logo.svg"
        alt="Bitte logo"
        width={112}
        height={22}
        className="hidden md:block"
      />
      <Image
        src="/bitte-symbol.svg"
        alt="Bitte Symbol"
        width={32}
        height={32}
        className="md:hidden"
      />
      <div className="flex gap-4 items-center">
        <NearWalletConnector />
        <a
          href="mailto:paul@bitte.ai"
          className="bg-[#27272A] text-[#FAFAFA] px-8 py-2 hover:bg-opacity-80 rounded-md font-medium h-[40px]"
        >
          Contact
        </a>
      </div>
    </header>
  );
};

export default Header;
