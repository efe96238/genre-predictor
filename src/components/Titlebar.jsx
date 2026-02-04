import React from 'react'
import { X, Minus } from 'lucide-react'

const Titlebar = () => {

  function handleClose(){
    window.close()
  }

  function handleMinimize() {
    window.api.minimize()
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-neutral-900" style={{ WebkitAppRegion: "drag" }}>
      <div className="relative h-7 flex items-center justify-evenly">
        <div onClick={handleClose} className="absolute flex items-center justify-center right-0 h-full w-10 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-200 " style={{ WebkitAppRegion: "no-drag" }}>
          <X className='size-5'/>
        </div>
        <div onClick={handleMinimize} className='absolute flex items-center justify-center right-10 h-full w-10 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-200' style={{ WebkitAppRegion: "no-drag" }}>
          <Minus className='size-5'/>
        </div>
        <div className='absolute flex items-center justify-start left-3 text-blue-400 opacity-70'>
          <p>v1.0</p>
        </div>
      </div>
    </div>
  )
}

export default Titlebar
