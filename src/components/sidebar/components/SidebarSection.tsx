import React from "react";

interface sidebarSectionProps {
  title: string;
  isCollapsed: boolean;
  onToggle: () => void;
  ref?: React.RefObject<HTMLDivElement | null>;
  children?: React.ReactNode;
}

function SidebarSection({
  title,
  isCollapsed,
  onToggle,
  ref,
  children,
}: sidebarSectionProps) {
  return (
    <div
      className={` w-full ${title === 'Audio' ? 'flex-1' : 'h-1/3'}  flex flex-col justify-start items-center`}
      ref={ref}
    >
      <header
        className=" w-full h-6 flex justify-between items-center bg-gray-200 p-2 cursor-pointer"
        onClick={onToggle}
      >
        {title}
      </header>
      {!isCollapsed && (
        <div className=" border-b-2 w-full flex-1 flex flex-col justify-start items-center overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
}

export default SidebarSection;
