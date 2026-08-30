import React from "react";
import ToolBar from "./ToolBar";

function MainLayout() {
  return <div className=" w-full h-full bg-brand grid grid-cols-4 relative">
    
    <ToolBar />


    {/* horizontal wrapper: sidebar)*/}
    <div className= " h-full col-span-1 bg-green-500">

    </div>

    {/* horizontal wrapper: main content */}
    <div className= " h-full col-span-3 bg-blue-500 flex flex-col">

        {/* canvas */}
        <div className=" w-full h-2/3 bg-amber-400"></div>

        {/* timeline */}
        <div className=" w-full h-1/3 bg-red-400"></div>

    </div>


  </div>;
}

export default MainLayout;
