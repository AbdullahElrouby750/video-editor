import React from "react";

const toolbarTools = ["Tool 1", "Tool 2", "Tool 3", "Tool 4", "Tool 5"];

function ToolBar() {
  return <div className=" w-full h-7 bg-gray-500 grid grid-cols-16 fixed top-0">
    {toolbarTools.map((tool, index) => {
        return <button key={index} className=" h-full grid-span-1 flex justify-center items-end text-sm pb-1 hover:bg-gray-600 cursor-pointer transition-all duration-200 active:bg-gray-700 ">
            <span className=" text-neutral-text-light">{tool}</span>
        </button>
    })}
  </div>;
}

export default ToolBar;
