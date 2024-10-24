import React, { useState } from 'react';
import { ChevronDown, Copy, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import toast from 'react-hot-toast';
import OPLogo from "@/assets/images/daos/op.png";
import ArbLogo from "@/assets/images/daos/arb.png";
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';

interface Chain {
  id: number;
  name: string;
  icon: string; // Add icon to store the chain logo
}

interface ChainSwitcherHeaderProps {
  address?: string;
  currentChainId?: number;
  switchChain?: (params: { chainId: number }) => void;
  disconnect?: () => void;
  ensAvatar?: string | null;
  onConnect?: () => void;
  authenticated?: boolean;
}

export default function ChainSwitcherHeader({
  address = '',
  currentChainId,
  switchChain,
  // disconnect,
  ensAvatar,
  onConnect,
  authenticated = false,
}: ChainSwitcherHeaderProps) {
  const [copied, setCopied] = useState(false);
  const {logout}=usePrivy();
  const {isConnected}=useAccount();
  const {disconnect}=useDisconnect();

  const getSlicedAddress = (addr: string): string => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast('Address copied ');
    }
  };

  const { chains } = useSwitchChain();
  const currentChain = chains.find((chain) => chain.id === currentChainId);

  // List of desired chains
  const desiredChains = [
    {
      id: 10, // Optimism
      name: 'Optimism',
      icon: OPLogo, // Add the path for Optimism logo
    },
    {
      id: 42161, // Arbitrum
      name: 'Arbitrum',
      icon: ArbLogo, // Add the path for Arbitrum logo
    },
    {
      id: 421611, // Arbitrum Sepolia
      name: 'Arbitrum Sepolia',
      icon: ArbLogo, // Add the path for Arbitrum Sepolia logo
    },
  ];

  const handleLogout = async () => {
    try {
      // Disconnect external wallet (e.g., MetaMask) if connected
      if (isConnected) {
        disconnect(); // This is from wagmi
      }
  
      // Logout from embedded wallet (Google via Privy)
      await logout(); // Privy logout method
  
      // Optionally, handle any other clean-up or state reset logic here
      console.log("User has been logged out from both wallets");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const userOnWrongNetwork = !desiredChains.some(
    (chain) => chain.id === currentChainId
  );

  return (
    <div className="bg-white rounded-full">
      <div className="flex items-center justify-between w-full bg-gray-100 p-3 rounded-full shadow-sm">
        {/* Address Display with Copy Button */}
        <div className="flex items-center space-x-3">
          {/* {ensAvatar && (
            <img
              alt="ENS Avatar"
              src={ensAvatar}
              className="w-6 h-6 rounded-full"
            />
          )} */}
           <img
              alt="ENS Avatar"
              src={"https://avatars.jakerunzer.com/test"}
              className="w-6 h-6 rounded-full"
            />
          <span className="text-gray-800 font-semibold">
            {getSlicedAddress(address)}
          </span>
          <Copy
            size={18}
            onClick={copyToClipboard}
            className={`cursor-pointer transition-colors ml-2 ${
              copied ? 'text-green-500' : 'text-gray-500 hover:text-gray-700'
            }`}
          />
        </div>

        {/* Chain Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 bg-gray-200 rounded-lg px-4 ml-2 py-2 hover:bg-gray-300 transition-colors">
            {currentChain && (
              <span className="font-semibold text-gray-800">
                {currentChain.name}
              </span>
            )}
            <ChevronDown size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white rounded-lg shadow-lg">
            {desiredChains.map((chain) => (
              <DropdownMenuItem
                key={chain.id}
                disabled={chain.id === currentChainId}
                onClick={() => switchChain?.({ chainId: chain.id })}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {/* Chain Logo */}
                <Image
                  src={chain.icon}
                  alt={chain.name}
                  className="w-5 h-5 mr-2"
                />
                {chain.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Disconnect Button */}
        {address && (
          <button
            onClick={handleLogout}
            className="p-2 ml-2 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Disconnect wallet"
          >
            <LogOut size={20} className="text-red-500 hover:text-red-600" />
          </button>
        )}

        {/* Wrong Network Display */}
        {userOnWrongNetwork && (
          <span className="ml-4 text-red-600 font-semibold">
            Wrong Network
          </span>
        )}
      </div>
    </div>
  );
}
