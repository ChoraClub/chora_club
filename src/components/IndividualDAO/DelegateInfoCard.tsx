import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import { IoArrowForward, IoCopy } from "react-icons/io5";
import toast from "react-hot-toast";
import OPLogo from "@/assets/images/daos/op.png";
import ARBLogo from "@/assets/images/daos/arbitrum.jpg";
import ccLogo from "@/assets/images/daos/CCLogo2.png";
import { fetchEnsNameAndAvatar, getENSName } from "@/utils/ENSUtils";
import { truncateAddress } from "@/utils/text";
import { motion } from "framer-motion";
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
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

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
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      onClick={onCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6 space-y-4">
        <div className="relative flex justify-center">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={
                avatar ||
                delegate.profilePicture ||
                (daoName === "optimism" ? OPLogo : ARBLogo)
              }
              alt="Delegate"
              width={200}
              height={200}
              className="rounded-full h-20 w-20 object-contain object-center"
            />
          </motion.div>
          <motion.div
            className="absolute -top-2 -right-2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Image
              src={ccLogo}
              alt="ChoraClub Logo"
              width={40}
              height={40}
              className="rounded-full shadow-md"
            />
          </motion.div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold truncate">{displayName}</h3>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm text-gray-600">
              {`${delegate.delegate.slice(0, 6)}...${delegate.delegate.slice(
                -4
              )}`}
            </span>
            <Tooltip content="Copy Address">
              <button
                onClick={handleCopyAddress}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <IoCopy size={16} />
              </button>
            </Tooltip>
          </div>
        </div>

        <div className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-1 rounded-full text-center">
          {formatNumber(delegate.adjustedBalance)} delegated tokens
        </div>

        <motion.button
          className="w-full bg-gradient-to-r from-blue-500 to-[#3f316d] text-white font-medium py-3 px-4 rounded-3xl overflow-hidden relative"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            onDelegateClick(delegate);
          }}
        >
          <motion.div
            className="flex items-center justify-center"
            initial={{ x: 0 }}
            animate={{ x: isButtonHovered ? -50 : 0 }}
            transition={{ duration: 0.3 }}
          >
            Delegate
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ x: 50 }}
            animate={{ x: isButtonHovered ? 0 : 50 }}
            transition={{ duration: 0.3 }}
          >
            <IoArrowForward size={24} />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DelegateInfoCard;
