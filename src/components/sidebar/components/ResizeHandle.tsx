import React from 'react'

function ResizeHandle({startDrag, toggleCollapse}: {startDrag: (e: React.MouseEvent) => void; toggleCollapse: () => void}) {
    return (
        <div className=' h-full w-4 flex flex-row flex-nowrap absolute right-0 z-5'>
            <button className=' h-full flex-1 m-0 p-0 bg-blue-600 relative cursor-pointer' onMouseDown={(event) => event.stopPropagation()} onClick={toggleCollapse}></button>
            <div className=' h-full w-1/5 bg-brand cursor-col-resize' onMouseDown={startDrag}></div>
        </div>
    )
}

export default ResizeHandle