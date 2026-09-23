import React from "react";

// SidebarSection.tsx: no more h-1/3 / flex-1 special-casing per title
interface Props {
  title: string;
  isCollapsed: boolean;
  onToggle: () => void;
  ref?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function SidebarSection({ title, isCollapsed, onToggle, ref, style, children }: Props) {
  return (
    <div ref={ref} style={style} className="w-full min-h-0 overflow-hidden border-2 border-black flex flex-col">
      <header className="w-full h-6 shrink-0 flex items-center bg-gray-200 p-2 cursor-pointer" onClick={onToggle}>
        {title}
      </header>
      {!isCollapsed && (
        <div className="w-full flex-1 min-h-0 overflow-y-auto">{children}</div>
      )}
    </div>
  );
}

export default SidebarSection;
