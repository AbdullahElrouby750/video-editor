import React from "react";
import ToolBar from "./ToolBar";
import SidebarPanel from "./SidebarPanel";

function MainLayout() {
  return <div className=" w-full h-full bg-brand flex relative transition-all duration-200">
    
    <ToolBar />


    {/* horizontal wrapper: sidebar)*/}
    <SidebarPanel />

    {/* horizontal wrapper: main content */}
    <div className= " h-full bg-blue-500 flex flex-1 flex-col">

        {/* canvas */}
        <div className=" w-full h-2/3 bg-amber-400"></div>

        {/* timeline */}
        <div className=" w-full h-1/3 bg-red-400"></div>

    </div>


  </div>;
}

export default MainLayout;
