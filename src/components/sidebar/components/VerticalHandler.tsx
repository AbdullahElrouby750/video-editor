import React from "react";

function VerticalHandler({
  handleMouseDown,
  section,
}: {
  handleMouseDown: (e: React.MouseEvent, section: 'vid' | 'img') => void;
  section: 'vid' | 'img';
}) {
  return (
    <div
      onMouseDown={(e) => {e.stopPropagation(); handleMouseDown(e, section);}}
      className="h-1 w-full bg-gray-500 cursor-row-resize hover:bg-brand shrink-0 z-10"
    />
  );
}

export default VerticalHandler;
