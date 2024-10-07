import React from 'react';
import { usePathname } from 'next/navigation'; 
import RewardButton from '../ClaimReward/RewardButton';
import ConnectWalletWithENS from '../ConnectWallet/ConnectWalletWithENS';

interface TitlesMap {
    [key: string]: string;
  }

const titles : TitlesMap = {
    "/": "Explore DAOs",
    "/office-hours": "Office Hours",
    "/sessions": "Sessions",
    "/notifications":"Notifications",
    "/profile":"Profile",
    // Add more URL mappings here as needed
  };

function Heading(){
    const pathname = usePathname();
    let title = "Chora Club"; 
    
    Object.keys(titles).forEach((key) => {
      if (pathname === key || pathname.startsWith(key)) {
          title = titles[key];
      }
  });

    return(
        <>
        <div className="flex flex-row justify-between items-center mb-6">
      <div className="flex gap-4 items-center">
        <div className="text-blue-shade-200 font-medium text-2xl xs:text-3xl md:text-4xl font-quanty">
        {title}
        </div>
      </div>
      <div className="flex gap-1 xs:gap-2 items-center">
        <RewardButton />
        <ConnectWalletWithENS />
      </div>
    </div>
        </>
    )
}

export default Heading;