import { Sidebar as SidebarIcon, Plus } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [labels, setLabels] = useState({
        "Two Wheeler": "#FF5733",
        "Three Wheeler": "#33FF57",
        "Four Wheeler": "#3357FF",
        "LDV": "#F3FF33",
        "HDV": "#FF33F3"
    });
    const [newLabelName, setNewLabelName] = useState("");
    const [newLabelColor, setNewLabelColor] = useState("#000000");

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const handleColorChange = (key, color) => {
        setLabels({
            ...labels,
            [key]: color
        });
    };

    const addNewLabel = () => {
        if (newLabelName.trim() !== "") {
            setLabels({
                ...labels,
                [newLabelName]: newLabelColor
            });
            setNewLabelName("");
            setNewLabelColor("#000000");
        }
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
                <div className="absolute left-0 top-0 w-[300px] h-full bg-black z-[999] p-5 shadow-[2px_0_5px_rgba(0,0,0,0.1)] text-white overflow-y-auto">
                    {/* Close Button */}
                    <button
                        onClick={toggleSidebar}
                        className="absolute top-2 right-2 p-2 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black"
                    >
                        <SidebarIcon size={20} />
                    </button>
                    <h2 className="mt-8 text-xl font-bold">Rapid-Ink</h2>
                    
                    {/* Labels Section */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3">Labels</h3>
                        
                        {/* Existing Labels */}
                        <div className="space-y-3">
                            {Object.entries(labels).map(([key, color]) => (
                                <div key={key} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-4 h-4 rounded-full" 
                                            style={{ backgroundColor: color }}
                                        ></div>
                                        <span>{key}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            type="color" 
                                            value={color}
                                            onChange={(e) => handleColorChange(key, e.target.value)}
                                            className="w-8 h-6 bg-transparent cursor-pointer"
                                        />
                                        <input 
                                            type="text" 
                                            value={color}
                                            onChange={(e) => handleColorChange(key, e.target.value)}
                                            className="ml-1 w-20 bg-gray-800 text-white text-xs p-1 rounded"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Add New Label */}
                        <div className="mt-4 pt-4 border-t border-gray-700">
                            <h4 className="text-sm font-medium mb-2">Add New Label</h4>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Label name"
                                    value={newLabelName}
                                    onChange={(e) => setNewLabelName(e.target.value)}
                                    className="flex-1 bg-gray-800 text-white p-2 text-sm rounded"
                                />
                                <div className="flex items-center">
                                    <input 
                                        type="color" 
                                        value={newLabelColor}
                                        onChange={(e) => setNewLabelColor(e.target.value)}
                                        className="w-8 h-8 bg-transparent cursor-pointer"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={addNewLabel}
                                className="flex items-center justify-center w-full gap-1 mt-1 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
                            >
                                <Plus size={16} />
                                <span>Add Label</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
// // Sidebar.jsx
// import { Sidebar as SidebarIcon } from "lucide-react";
// import { useState } from "react";

// export default function Sidebar() {
//     const [isSidebarVisible, setIsSidebarVisible] = useState(false);

//     const toggleSidebar = () => {
//         setIsSidebarVisible(!isSidebarVisible);
//     };

//     return (
//         <>
//             {/* Sidebar Trigger Button */}
//             {!isSidebarVisible && (
//                 <button
//                 onClick={toggleSidebar}
//                 className="absolute top-2 left-2 z-[1000] p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                 >
//                 <SidebarIcon size={20} />
//                 </button>
//             )}

//             {/* Sidebar */}
//             {isSidebarVisible && (
//                 <div className="absolute left-0 top-0 w-[300px] h-full bg-black z-[999] p-5 shadow-[2px_0_5px_rgba(0,0,0,0.1)] text-white">
//                 {/* Close Button */}
//                 <button
//                     onClick={toggleSidebar}
//                     className="absolute top-2 right-2 p-2 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black"
//                 >
//                     <SidebarIcon size={20} />
//                 </button>
//                 <h2 className="mt-8">Rapid-Ink</h2>
//                 </div>
//             )}
//         </>
//     );
// }