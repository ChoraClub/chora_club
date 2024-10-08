import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { arbBlock, opBlock } from "@/config/staticDataUtils";
import React from "react";
import { PiLinkSimpleBold } from "react-icons/pi";

function QuickLinks({ daoName }: { daoName: string }) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-white hover:bg-white">
            <div className="flex gap-2 items-center">
              <div className="bg-gray-600/50 hover:bg-gray-600 p-2 rounded-lg">
                <PiLinkSimpleBold
                  className="text-white"
                  size={24}
                ></PiLinkSimpleBold>
              </div>
              <div className="text-gray-800 text-base">Quick Links</div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-white items-start"
          sideOffset={8}
          align="start"
        >
          <div className="">
            {/* <div className="arrow-up"></div> */}
            {(daoName === "arbitrum"
              ? arbBlock
              : daoName === "optimism"
              ? opBlock
              : []
            ).map((block, index) => (
              <a
                href={block.link}
                target="_blank"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 hover:rounded-md"
                key={index}
              >
                {block.title}
              </a>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default QuickLinks;
