// import React from 'react';
// import Image from 'next/image';
// import { ChevronDown, CirclePower, LogOut } from 'lucide-react';
// import { 
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { useSwitchChain,useDisconnect } from 'wagmi';


// // Define types for the chain
// interface Chain {
//   id: number;
//   name: string;
//   icon: string;
// }

// // Define props interface
// interface ChainSwitcherHeaderProps {
//   address?: string;
//   currentChainId?: number; // Changed from chain to currentChainId
// //   chains: Chain[]; // Add chains array as a prop
//   switchChain?: (params: { chainId: number }) => void;
//   disconnect?: () => void;
//   ensAvatar?: string | null;
// }

// export default function ChainSwitcherHeader({ 
//   address = '', 
//   currentChainId,
// //   chains,
//   switchChain,
//   disconnect,
//   ensAvatar 
// }: ChainSwitcherHeaderProps) {
//   const shorten = (addr: string): string => {
//     if (!addr) return '';
//     return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
//   };

//   // Find the current chain object
//   const {chains, error: switchNetworkError} = useSwitchChain();
//   const currentChain = chains.find(chain => chain.id === currentChainId);


//   return (
//     <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
//       {/* Chain Switcher */}
//       <DropdownMenu>
//         <DropdownMenuTrigger className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 hover:bg-white/20 transition-colors">
//           {currentChain && (
//             <div className="w-6 h-6 rounded-full overflow-hidden">
//               {/* <Image
//                 alt={`${currentChain.name} icon`}
//                 src={currentChain.icon}
//                 width={24}
//                 height={24}
//               /> */}
//               <b>{currentChain.name}</b>
//             </div>
//           )}
//           <ChevronDown size={16} />
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           {chains.map((x) => (
//             <DropdownMenuItem
//               key={x.id}
//               disabled={x.id === currentChainId}
//               onClick={() => switchChain?.({ chainId: x.id })}
//               className="flex items-center gap-2"
//             >
//               {/* <Image
//                 alt={`${x.name} icon`}
//                 src={x.icon}
//                 width={20}
//                 height={20}
//                 className="rounded-full"
//               /> */}
//               {x.name}
//             </DropdownMenuItem>
//           ))}
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {/* Address Display */}
//       <div className="flex items-center bg-white/10 rounded-xl px-3 py-2">
//         {ensAvatar && (
//           <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
//             <img
//               alt="ENS Avatar"
//               src={ensAvatar}
//               className="w-full h-full"
//             />
//           </div>
//         )}
//         <span className="text-sm font-medium">
//           {shorten(address)}
//         </span>
//       </div>

//       {/* Disconnect Button */}
//      {address && <button
//         onClick={disconnect}
//         className="p-2 hover:bg-white/10 rounded-full transition-colors"
//         aria-label="Disconnect wallet"
//       >
//         <CirclePower size={20} color='red' />
//       </button>
//     }
//     </div>
//   );
// }


import React, { useState } from 'react';
import { ChevronDown, Copy, LogOut } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSwitchChain } from 'wagmi';
import toast from 'react-hot-toast';

interface Chain {
  id: number;
  name: string;
  icon: string;
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
  disconnect,
  ensAvatar,
  onConnect,
  authenticated = false
}: ChainSwitcherHeaderProps) {
  const [copied, setCopied] = useState(false);

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
  const currentChain = chains.find(chain => chain.id === currentChainId);



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
              src={"https://avatars.jakerunzer.com/avatar2  "}
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
            {chains.map((chain) => (
              <DropdownMenuItem
                key={chain.id}
                disabled={chain.id === currentChainId}
                onClick={() => switchChain?.({ chainId: chain.id })}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {chain.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Disconnect Button */}
        {address && (
          <button
            onClick={disconnect}
            className="p-2 ml-2 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Disconnect wallet"
          >
            <LogOut size={20} className="text-red-500 hover:text-red-600" />
          </button>
        )}
      </div>
    </div>
  );
}