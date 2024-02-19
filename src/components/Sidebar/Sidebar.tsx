import React from "react";

// Store
import useStore from "@/components/store/slices";
import { cn } from "@/components/utils/helpers";
import Header from "./Header/Header";
import ViewComponent from "./ViewController";
import { BasicIcons } from "@/assets/BasicIcons";

type SidebarProps = {};

const Sidebar: React.FC<SidebarProps> = () => {
  const isSidebarOpen = useStore((state) => state.sidebar.isSidebarOpen);

  const sidebarView = useStore((state) => state.sidebar.sidebarView);
  const setSidebarView = useStore((state) => state.setSidebarView);

  if (sidebarView === "close") return null;

  return (
    <aside
      className={cn(
        "w-2/6 bg-gray-100 mr-2 mt-2 rounded-lg transition-all duration-300 ease-out flex-col font-poppins",
        isSidebarOpen ? "flex" : "hidden"
      )}
    >
      <Header
        title="Peers"
        icon={BasicIcons.peers}
        onClose={() => {
          setSidebarView("close");
        }}
      />

      <div className="px-6 py-4 overflow-y-auto noScrollbar">
        {ViewComponent[sidebarView].component}
      </div>
    </aside>
  );
};
export default React.memo(Sidebar);
