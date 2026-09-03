import React from 'react'

function ResizeHandle({startDrag, toggleCollapse}) {
    return (
        <div className=' h-full w-1 border-x-4 border-x-black absolute right-0 cursor-grab active:cursor-grabbing z-5' onMouseDown={startDrag}>
            <button className=' h-8 w-5 bg-blue-600 relative top-1/2 translate-x-[-50%]' onMouseDown={(event) => event.stopPropagation()} onClick={toggleCollapse}></button>
        </div>
    )
}

export default ResizeHandle