"use client";

import { useBitteWallet } from "@bitte-ai/react";
import { LogOut, SettingsIcon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu";

const NearWalletConnector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    isConnected,
    selector,
    connect,
    activeAccountId,
    isWaitingForConnection,
    isWalletSelectorSetup,
  } = useBitteWallet();

  const isLoading = isWaitingForConnection || !isWalletSelectorSetup;

  const isDisconnected =
    isWalletSelectorSetup &&
    !isConnected &&
    !isWaitingForConnection &&
    !activeAccountId;

  const handleSignOut = async () => {
    const wallet = await selector.wallet();
    await wallet.signOut();
    window.location.reload();
  };

  const handleSignIn = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const triggerElement = (
    <button
      className="bg-[#27272A] text-[#FAFAFA] h-[40px] w-[40px] flex items-center justify-center hover:bg-opacity-80 rounded-md font-medium"
      onClick={() => setIsOpen(!isOpen)}
    >
      <SettingsIcon size={20} />
    </button>
  );

  if (isLoading) {
    return (
      <div className="hidden md:block bg-[#27272A] h-[40px] w-[160px] rounded-md animate-pulse" />
    );
  }

  if (isDisconnected) {
    return (
      <div className="fixed bottom-0 md:relative bg-black p-8 z-30 w-full left-0 md:p-0 md:w-auto md:bg-transparent">
        <button
          className="bg-[#FAFAFA] h-[40px] px-8 py-2 hover:bg-opacity-80 text-[#18181B] rounded-md font-medium w-full md:w-auto"
          onClick={handleSignIn}
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{triggerElement}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-full rounded-lg md:mr-28 md:w-[364px] bg-black"
        sideOffset={12}
      >
        <DropdownMenuLabel>Currently Connected</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{activeAccountId}</DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <button className="flex items-center gap-2" onClick={handleSignOut}>
            <LogOut size={16} />
            <span className="text-sm">Disconnect</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NearWalletConnector;
