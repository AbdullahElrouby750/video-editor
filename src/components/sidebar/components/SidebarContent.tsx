import React from "react";
import SidebarSection from "./SidebarSection";
import VerticalHandler from "./VerticalHandler";

function SidebarContent() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const vidRef = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLDivElement>(null);
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

  const getPixelValue = (value: string | null | undefined) => {
    const parsed = Number.parseFloat(value ?? "");
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const handleToggleCollapse = (section: "vid" | "img" | "aud") => {
    if (
      !containerRef.current ||
      !vidRef.current ||
      !imgRef.current ||
      !audRef.current
    )
      return;

    if (section === "vid") {
      if (isCollapsed.vid) {
        vidRef.current.style.minHeight = `20%`;
        vidRef.current.style.maxHeight = `none`;
        vidRef.current.style.height = `${vidLastHeightRef.current}px`;
        // vidRef.current.style.transition = "none";
      } else {
        vidLastHeightRef.current = vidRef.current.offsetHeight;
        vidRef.current.style.height = `${HEADER_HEIGHT}px`;
        vidRef.current.style.minHeight = `${HEADER_HEIGHT}px`;
        vidRef.current.style.maxHeight = `${HEADER_HEIGHT}px`;
        vidRef.current.style.transition = "all 0.15s ease-in-out";
      }
      setIsCollapsed((prev) => ({ ...prev, vid: !prev.vid }));
    }

    if (section === "img") {
      if (isCollapsed.img) {
        imgRef.current.style.minHeight = `20%`;
        imgRef.current.style.maxHeight = `none`;
        imgRef.current.style.height = `${imgLastHeightRef.current}px`;
        // imgRef.current.style.transition = "none";
      } else {

        if (isCollapsed.aud && !isCollapsed.vid) {
          const currentAudHeight = audRef.current.offsetHeight - HEADER_HEIGHT;
          const vidNewHeight = vidRef.current.offsetHeight + currentAudHeight;
          vidRef.current.style.height = `${vidNewHeight}px`;
        } else {
          imgLastHeightRef.current = imgRef.current.offsetHeight;
        }
        imgRef.current.style.height = `${HEADER_HEIGHT}px`;
        imgRef.current.style.minHeight = `${HEADER_HEIGHT}px`;
        imgRef.current.style.maxHeight = `${HEADER_HEIGHT}px`;

        imgRef.current.style.transition = "all 0.15s ease-in-out";
      }
      setIsCollapsed((prev) => ({ ...prev, img: !prev.img }));
    }

    if (section === "aud") {
      if (isCollapsed.aud) {
        audRef.current.style.minHeight = `20%`;
        audRef.current.style.maxHeight = `none`;
        audRef.current.style.height = `${audLastHeightRef.current}px`;
        // audRef.current.style.transition = "none";
      } else {

        if (isCollapsed.img && isCollapsed.vid) {
          audLastHeightRef.current = audRef.current.offsetHeight;
        } else {
          const currentAudHeight = audRef.current.offsetHeight - HEADER_HEIGHT ;
          if (!isCollapsed.img) {
            const newImgHeight = imgRef.current.offsetHeight + currentAudHeight;
            imgRef.current.style.height = `${newImgHeight}px`;
          } else{
            const newVidHeight = vidRef.current.offsetHeight + currentAudHeight;
            vidRef.current.style.height = `${newVidHeight}px`;
          }
        }
        audRef.current.style.height = `${HEADER_HEIGHT}px`;
        audRef.current.style.minHeight = `${HEADER_HEIGHT}px`;
        audRef.current.style.maxHeight = `${HEADER_HEIGHT}px`;
        audRef.current.style.transition = "all 0.15s ease-in-out";
      }
      setIsCollapsed((prev) => ({ ...prev, aud: !prev.aud }));
    }
  };

  const handleDragStart = (e: React.MouseEvent, section: "vid" | "img") => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !containerRef.current ||
      !vidRef.current ||
      !imgRef.current ||
      !audRef.current
    )
      return;

    const startY = e.clientY;
    const containerHeight = containerRef.current.clientHeight;
    const vidHeight = vidRef.current.clientHeight;
    const imgHeight = imgRef.current.clientHeight;
    const audHeight = audRef.current.clientHeight;

    const vidMinHeight = isCollapsed.vid
      ? HEADER_HEIGHT
      : (getPixelValue(window.getComputedStyle(vidRef.current).minHeight) /
          100) *
        containerHeight;
    const imgMinHeight = isCollapsed.img
      ? HEADER_HEIGHT
      : (getPixelValue(window.getComputedStyle(imgRef.current).minHeight) /
          100) *
        containerHeight;
    const audMinHeight = isCollapsed.aud
      ? HEADER_HEIGHT
      : (getPixelValue(window.getComputedStyle(audRef.current).minHeight) /
          100) *
        containerHeight;

    const handleMouseMove = (mouseEvent: MouseEvent) => {
      const deltaY = mouseEvent.clientY - startY;
      if (
        section === "vid" &&
        vidRef.current &&
        imgRef.current &&
        audRef.current
      ) {
        const imgCapacity = Math.max(0, imgHeight - imgMinHeight);
        const audCapacity = Math.max(0, audHeight - audMinHeight);
        const minDelta = vidMinHeight - vidHeight;
        const maxDelta = imgCapacity + audCapacity;

        const clampedDelta = Math.max(minDelta, Math.min(deltaY, maxDelta));

        // Positive delta: expand Videos.
        // Negative delta: expand Images and shrink Videos.
        const imgDelta = Math.min(clampedDelta, imgCapacity);
        const audDelta = Math.max(0, clampedDelta - imgCapacity);

        vidRef.current.style.height = `${vidHeight + clampedDelta}px`;
        imgRef.current.style.height = `${imgHeight - imgDelta}px`;
        audRef.current.style.height = `${audHeight - audDelta}px`;
      } else if (
        section === "img" &&
        imgRef.current &&
        vidRef.current &&
        audRef.current
      ) {
        const imgShrinkCapacity = Math.max(0, imgHeight - imgMinHeight);
        const audShrinkCapacity = Math.max(0, audHeight - audMinHeight);
        const vidShrinkCapacity = Math.max(0, vidHeight - vidMinHeight);

        if (deltaY >= 0) {
          // Dragging down expands Images by shrinking Audio.
          const audShrink = Math.min(deltaY, audShrinkCapacity);

          imgRef.current.style.height = `${imgHeight + audShrink}px`;
          audRef.current.style.height = `${audHeight - audShrink}px`;
        } else {
          // Dragging up shrinks Images first, then Videos if Images is at minimum.
          const requestedShrink = -deltaY;
          const imgShrink = Math.min(requestedShrink, imgShrinkCapacity);
          const remainingShrink = requestedShrink - imgShrink;
          const vidShrink = Math.min(remainingShrink, vidShrinkCapacity);

          imgRef.current.style.height = `${imgHeight - imgShrink}px`;
          vidRef.current.style.height = `${vidHeight - vidShrink}px`;
          audRef.current.style.height = `${audHeight + imgShrink + vidShrink}px`;
        }
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      if (section === "vid") {
        vidLastHeightRef.current =
          vidRef.current?.offsetHeight || vidLastHeightRef.current;
      } else if (section === "img") {
        imgLastHeightRef.current =
          imgRef.current?.offsetHeight || imgLastHeightRef.current;
      }
      if (!isCollapsed.aud) {
        audLastHeightRef.current =
          audRef.current?.offsetHeight || audLastHeightRef.current;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full flex-1 flex flex-col justify-stretch"
    >
      {/* the accordion wrapped here */}
      <SidebarSection
        title="Videos"
        isCollapsed={false}
        onToggle={() => handleToggleCollapse("vid")}
        ref={vidRef}
      >vid</SidebarSection>

      {((!isCollapsed.vid && !isCollapsed.img) ||
        (!isCollapsed.vid && !isCollapsed.aud)) && (
        <VerticalHandler handleMouseDown={handleDragStart} section="vid" />
      )}

      <SidebarSection
        title="Images"
        isCollapsed={false}
        onToggle={() => handleToggleCollapse("img")}
        ref={imgRef}
      >img</SidebarSection>

      {!isCollapsed.aud && (
        <VerticalHandler handleMouseDown={handleDragStart} section="img" />
      )}

      <SidebarSection
        title="Audio"
        isCollapsed={false}
        onToggle={() => handleToggleCollapse("aud")}
        ref={audRef}
      >aud</SidebarSection>
    </div>
  );
}

export default SidebarContent;
