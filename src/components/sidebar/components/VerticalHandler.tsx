import React from "react";

function VerticalHandler({
  handleMouseDown,
}: {
  handleMouseDown: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onMouseDown={(e) => {e.stopPropagation(); handleMouseDown(e);}}
      className="h-1 w-full bg-gray-500 cursor-row-resize hover:bg-brand shrink-0 z-10"
    />
  );
}

export default VerticalHandler;
