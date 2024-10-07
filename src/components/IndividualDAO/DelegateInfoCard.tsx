import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import { IoCopy } from "react-icons/io5";
import toast from "react-hot-toast";
import OPLogo from "@/assets/images/daos/op.png";
import ARBLogo from "@/assets/images/daos/arbitrum.jpg";
import ccLogo from "@/assets/images/daos/CCLogo2.png";
import { fetchEnsNameAndAvatar, getENSName } from "@/utils/ENSUtils";
import { truncateAddress } from "@/utils/text";

interface DelegateInfoCardProps {
  delegate: any;
  daoName: string;
  onCardClick: () => void;
  onDelegateClick: (updatedDelegate: any) => void;
  formatNumber: (number: number) => string;
}

const DelegateInfoCard: React.FC<DelegateInfoCardProps> = ({
  delegate,
  daoName,
  onCardClick,
  onDelegateClick,
  formatNumber,
}) => {
  const [updatedDelegate, setUpdatedDelegate] = useState(delegate);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnsData = async () => {
      setIsLoading(true);
      const { ensName: fetchedName, avatar: fetchedAvatar } =
        await fetchEnsNameAndAvatar(delegate.delegate);
      setEnsName(fetchedName);
      setAvatar(fetchedAvatar);
      setIsLoading(false);
      setUpdatedDelegate((prev: any) => ({
        ...prev,
        ensName: fetchedName || prev.ensName,
        avatar: fetchedAvatar || prev.avatar,
      }));
    };

    fetchEnsData();
  }, [delegate.delegate]);

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(delegate.delegate);
    toast.success("Address copied!");
  };

  const displayName = isLoading
    ? truncateAddress(delegate.delegate)
    : ensName || truncateAddress(delegate.delegate);

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={onCardClick}
    >
      <div className="p-6">
        <div className="flex justify-center mb-4 relative">
          <Image
            src={
              avatar ||
              delegate.profilePicture ||
              (daoName === "optimism" ? OPLogo : ARBLogo)
            }
            alt="Delegate"
            width={200}
            height={200}
            className="rounded-full w-20 h-20"
          />
          <Image
            src={ccLogo}
            alt="ChoraClub Logo"
            width={100}
            height={100}
            className="absolute top-0 right-0 -mt-2 -mr-2 w-10 h-10"
          />
        </div>
        <h3 className="text-xl font-semibold text-center mb-2 truncate">
          {displayName}
        </h3>
        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="text-sm text-gray-600">
            {`${delegate.delegate.slice(0, 6)}...${delegate.delegate.slice(
              -4
            )}`}
          </span>
          <Tooltip content="Copy Address">
            <button
              onClick={handleCopyAddress}
              className="text-gray-400 hover:text-gray-600"
            >
              <IoCopy size={16} />
            </button>
          </Tooltip>
        </div>
        <div className="text-center mb-4">
          <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full text-sm">
            {formatNumber(delegate.adjustedBalance)} delegated tokens
          </span>
        </div>
        <button
          className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onDelegateClick(updatedDelegate);
          }}
        >
          Delegate
        </button>
      </div>
    </div>
  );
};

export default DelegateInfoCard;
