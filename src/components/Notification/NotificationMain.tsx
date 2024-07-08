import user from "@/assets/images/daos/user1.png";
import dummy from "@/assets/images/daos/user2.png";
import Image from "next/image";
function NotificationMain() {
  return (
    <>
      <div className="px-14 pt-6 font-poppins mb-12">
        <div className="font-semibold text-4xl text-blue-shade-100 pb-6">
          Notifications
        </div>
        <div className="flex gap-4 items-center">
          <Image src={user} alt="" className="size-12" />
          <p className="font-bold text-xl ">
            {" "}
            Welcome, 0xBb4c2baB6B2de45F9CC7Ab41087b730Eaa4adE31
          </p>
        </div>

        {/* Today */}
        <div className="mt-6 mb-4 font-medium text-lg text-black-shade-500 ml-2">
          Today
        </div>
        <div className="rounded-2xl bg-gray-50 shadow-md w-full ">
          {Array.from({ length: 3 }).map((_, index, array) => (
            <>
              <div className="flex justify-between items-center p-4">
                <div className="flex gap-3 ">
                  <Image src={dummy} alt=" " className="size-12 " />
                  <div className="flex flex-col gap-1 justify-center">
                    <h1 className="font-semibold text-sm ">
                      Chain-l.eth booked your session{" "}
                    </h1>
                    <p className="font-normal text-xs text-black-shade-500">
                      On November 2, 2024 at 5:00 PM
                    </p>
                  </div>
                </div>
                <div className="text-black-shade-500 text-xs font-normal">
                  2 hours ago
                </div>
              </div>
              {index < array.length - 1 && (
                <hr className="border-gray-200 border-1.5" />
              )}
            </>
          ))}
        </div>

        {/* Yesterday */}
        <div className="mt-6 mb-4 font-medium text-lg text-black-shade-500 ml-2">
          Yesterday
        </div>
        <div className="rounded-2xl bg-gray-50 shadow-md w-full ">
          {Array.from({ length: 3 }).map((_, index, array) => (
            <>
              <div className="flex justify-between items-center p-4">
                <div className="flex gap-3 ">
                  <Image src={dummy} alt=" " className="size-12 " />
                  <div className="flex flex-col gap-1 justify-center">
                    <h1 className="font-semibold text-sm ">
                      Chain-l.eth booked your session{" "}
                    </h1>
                    <p className="font-normal text-xs text-black-shade-500">
                      On November 2, 2024 at 5:00 PM
                    </p>
                  </div>
                </div>
                <div className="text-black-shade-500 text-xs font-normal">
                  2 hours ago
                </div>
              </div>
              {index < array.length - 1 && (
                <hr className="border-gray-200 border-1.5" />
              )}
            </>
          ))}
        </div>
      </div>
    </>
  );
}
export default NotificationMain;
