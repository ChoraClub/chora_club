import React, { useEffect, useState } from 'react'
import Image from "next/image";
import user from "@/assets/images/daos/user1.png"
import { FaArrowDown } from "react-icons/fa6";

interface delegate{
  isOpen:boolean,
  closeModal:any,
  handleDelegateVotes:any,
  delegateName:String,
  displayImage:any
}

function DelegateTile ({isOpen,closeModal, handleDelegateVotes, delegateName,displayImage}:delegate) {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Change the timeout duration as per your requirements
  }, []);
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden font-poppins">
        <div className="absolute inset-0 backdrop-blur-md"></div>
        <div className="bg-white px-6 py-8 rounded-2xl flex flex-col z-50 border-[2px] border-black-shade-900">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black-shade-900"></div>
          </div>
        </div>
      </div>
    );
  }
  return (
  <>
    <div className="fixed inset-0 flex items-center justify-center z-50  overflow-hidden font-poppins">
          <div
            className="absolute inset-0 backdrop-blur-md"
            onClick={closeModal}
          ></div>
          <div className='bg-white px-6 py-8 rounded-2xl flex flex-col  z-50 border-[2px] border-black-shade-900'>
            <h1 className='font-semibold text-2xl mb-2 '>Set {delegateName} as your delegate</h1>
            <p className='font-normal text-sm max-w-[29rem]'>{delegateName} will be able to vote with any token owned by your address</p>

            <div className='border-[2px] rounded-xl border-black-shade-900 my-6'>
                <div className='flex gap-2 items-center'>
                    <Image src={user} alt="" className='size-10 mx-2'/>
                    <div className=''>
                        <p className='mt-2 text-sm font-medium'>Currently delegated to</p>
                        <p className='mb-2 font-semibold'>N/A</p>
                    </div>
                </div>
                <div className='w-full border-[0.5px] border-black-shade-900 flex items-center justify-center h-0'>
                  <div className='rounded-full size-10 border-[2px] border-black-shade-900 flex items-center justify-center z-50 bg-white'><FaArrowDown className='text-black-shade-900'/></div>
                </div>
                <div className='flex gap-2 items-center'>
                    <Image src={displayImage} alt="" width={40} height={40} className='size-10 mx-2 rounded-full'/>
                    <div className=''>
                        <p className='mt-2 text-sm font-medium'> Delegating to</p>
                        <p className='mb-2 font-semibold'>{delegateName}</p>
                    </div>
                </div>
            </div>
            <button className='bg-blue-shade-100 text-white rounded-md py-1.5 font-medium font-poppins' onClick={handleDelegateVotes}>Delegate</button>
          </div>
          </div>
          </>
  )
}

export default DelegateTile
