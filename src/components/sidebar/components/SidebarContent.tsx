import React from "react";
import SidebarSection from "./SidebarSection";
import VerticalHandler from "./VerticalHandler";

function SidebarContent() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const vidRef = React.useRef<HTMLDivElement>(null);
  const imaRef = React.useRef<HTMLDivElement>(null);
  const audRef = React.useRef<HTMLDivElement>(null);

  const vidLastHeightRef = React.useRef<number>(200);
  const imgLastHeightRef = React.useRef<number>(200);
  const audLastHeightRef = React.useRef<number>(200);

  const [isCollapsed, setIsCollapsed] = React.useState({
    vid: false,
    img: false,
    aud: false,
  });

  const HEADER_HEIGHT = 24;

  const handleDragStart = (e: React.MouseEvent, section: "vid" | "img") => {
    e.preventDefault();

    if (
      !containerRef.current ||
      !vidRef.current ||
      !imaRef.current ||
      !audRef.current
    )
      return;

    const startY = e.clientY;
    const containerHeight = containerRef.current.clientHeight;
    const vidHeight = vidRef.current.clientHeight;
    const imgHeight = imaRef.current.clientHeight;
    const audHeight = audRef.current.clientHeight;

    const handleMouseMove = (mouseEvent: MouseEvent) => {
        const deltaY = mouseEvent.clientY - startY;

        if (section === "vid" && vidRef.current) {
            const audheight = isCollapsed.aud ? HEADER_HEIGHT : audHeight;
            const vidMaxHeight = containerHeight - imgHeight - HEADER_HEIGHT;

            let newHeight = vidHeight + deltaY;
            newHeight = Math.max(HEADER_HEIGHT, Math.min(newHeight, vidMaxHeight));

            vidRef.current.style.height = `${newHeight}px`;
    } else if (section === "img" && imaRef.current) {
            const imaMaxHeight = containerHeight - vidHeight - HEADER_HEIGHT;
            
            let newHeight = imgHeight + deltaY;
            newHeight = Math.max(HEADER_HEIGHT, Math.min(newHeight, imaMaxHeight));

            imaRef.current.style.height = `${newHeight}px`;
    }
  };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      if(section === "vid") {
        vidLastHeightRef.current = vidRef.current?.offsetHeight || vidLastHeightRef.current;
      } else if(section === "img") {
        imgLastHeightRef.current = imaRef.current?.offsetHeight || imgLastHeightRef.current;
      }
      if (!isCollapsed.aud) {
        audLastHeightRef.current = audRef.current?.offsetHeight || audLastHeightRef.current;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
}

  return (
    <div
      ref={containerRef}
      className="relative h-full flex-1 flex flex-col justify-stretch"
    >
      {/* the accordion wrapped here */}
      <SidebarSection
        title="Videos"
        isCollapsed={false}
        onToggle={() => {}}
        ref={vidRef}
      ></SidebarSection>

      <VerticalHandler handleMouseDown={handleDragStart} section="vid" />

      <SidebarSection
        title="Images"
        isCollapsed={false}
        onToggle={() => {}}
        ref={imaRef}
      ></SidebarSection>

      <VerticalHandler handleMouseDown={handleDragStart} section="img" />

      <SidebarSection
        title="Audio"
        isCollapsed={false}
        onToggle={() => {}}
        ref={audRef}
      ></SidebarSection>
    </div>
  );
}

export default SidebarContent;
