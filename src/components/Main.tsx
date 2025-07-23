"use client";

import { BitteAiChat  } from "@bitte-ai/chat";
import { useBitteWallet, Wallet   } from "@bitte-ai/react";
import { useEffect, useState } from "react";
import Proposal from "./Proposal";

const bitteAgent = {
  id: "bitte-assistant",
  name: "Bitte Assistant",
  description:
    "Bitte assistant for interacting with NFTs and Fungible Tokens (FTs) on NEAR Protocol.  Users can query, mint, transfer NFTs, transfer FTs, create drops, and swap tokens.",
  verified: true,
  image: "/bitte.svg",
};

const Main: React.FC = () => {
  const { selector, activeAccountId } = useBitteWallet();
  const [wallet, setWallet] = useState<Wallet>();

  useEffect(() => {
    const fetchWallet = async () => {
      const walletInstance = await selector.wallet();
      setWallet(walletInstance);
    };
    if (selector) fetchWallet();
  }, [selector]);
  const customToolComponents = [
    {
      name: 'getProposal', // This should match the operationId or route name from your OpenAPI spec
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component: (props: any) => (
        <Proposal data={props.data} />
      ),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any;
  return (
    <main className="flex flex-col items-center gap-8 max-w-5xl mx-auto my-4 md:my-8">
      <div className="h-[calc(100vh-114px)] lg:h-[calc(100vh-180px)] w-full">
        <BitteAiChat
          options={{
            agentImage: bitteAgent.image,
            agentName: bitteAgent.name,
          }}
          agentId={'hos-agent.vercel.app'}
          wallet={{ 
            near: { 
              wallet,
              accountId: activeAccountId || '',
              nearWalletId: undefined
            } 
          }}
          apiUrl="/api/chat"
          historyApiUrl="/api/history"
          customToolComponents={customToolComponents}
        />
      </div>
    </main>
  );
};

export default Main;
