"use client";

import { BitteWalletContextProvider } from "@bitte-ai/react";

type WalletProviderProps = {
  children: React.ReactNode;
};

const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  return (
    <BitteWalletContextProvider network="testnet">
      {children}
    </BitteWalletContextProvider>
  );
};

export default WalletProvider;
