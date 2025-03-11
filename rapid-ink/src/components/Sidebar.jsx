// Sidebar.jsx
import { Sidebar as SidebarIcon } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (
        <>
            {/* Sidebar Trigger Button */}
            {!isSidebarVisible && (
                <button
                onClick={toggleSidebar}
                className="absolute top-2 left-2 z-[1000] p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                <SidebarIcon size={20} />
                </button>
            )}

            {/* Sidebar */}
            {isSidebarVisible && (
                <div className="absolute left-0 top-0 w-[300px] h-full bg-black z-[999] p-5 shadow-[2px_0_5px_rgba(0,0,0,0.1)] text-white">
                {/* Close Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute top-2 right-2 p-2 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                    <SidebarIcon size={20} />
                </button>
                <h2 className="mt-8">Labels</h2>
                </div>
            )}
        </>
    );
}