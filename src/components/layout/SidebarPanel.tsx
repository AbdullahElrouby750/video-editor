import React, { useRef, useState } from "react";
import SidebarContent from "../sidebar/components/sidebarContent";
import ResizeHandle from "../sidebar/components/ResizeHandle";

function SidebarPanel() {
  const sidebarRef = useRef<HTMLElement>(null);
  const lastWidthRef = useRef<number>(400);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // collaps sidebar
  const handleToggleCollapse = () => {
    if (sidebarRef.current) {
      if (isCollapsed) {
        sidebarRef.current.style.width = `${lastWidthRef.current}px`;
      // sidebarRef.current.style.minWidth = "20%"; //! will break the transition,  se we moved it to the handleMouseDown function
        setIsCollapsed(false);
      } else {
        sidebarRef.current.style.width = "0px";
        sidebarRef.current.style.minWidth = "8px";
        sidebarRef.current.style.transition = "width 0.15s ease-in-out";
        setIsCollapsed(true);
      }
    }
  };

  // drag sidebar
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (sidebarRef.current) {
      sidebarRef.current.style.minWidth = "20%";
      sidebarRef.current.style.transition = "none";
    }

    const handleMouseMove = (mouseMove: MouseEvent) => {
      mouseMove.preventDefault();
      mouseMove.stopPropagation();
      console.log("mouseMove.clientX", mouseMove.clientX);
      if (sidebarRef.current) {
        const SNAP_THRESHOLD = 240;

        if (mouseMove.clientX < SNAP_THRESHOLD) {
          // 2. We hit the threshold! Force it to collapse
          if (!isCollapsed) {
            handleToggleCollapse();
          }

          // 3. CRITICAL: Stop the drag immediately so it doesn't infinitely toggle
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        } else {
          sidebarRef.current.style.width = `${mouseMove.clientX}px`;
        }
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      if (sidebarRef.current) {
        lastWidthRef.current = sidebarRef.current.offsetWidth;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <aside
      ref={sidebarRef}
      className=" h-full max-w-2/3 min-w-1/5 w-100 bg-green-500 relative"
    >
      <ResizeHandle
        startDrag={handleMouseDown}
        toggleCollapse={handleToggleCollapse}
      />
      <SidebarContent />
    </aside>
  );
}

export default SidebarPanel;
