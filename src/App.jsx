import React from "react"
import { useState } from 'react'
import './App.css'

import Titlebar from "./components/Titlebar"
import Predict from "./components/Predict"

function App() {

  const [file, setFile] = useState(null)

  return (
    <div className="bg-neutral-800 min-w-full w-screen min-h-full h-screen overflow-x-hidden flex flex-col">
      <div>
        <Titlebar/>
      </div>
      <div className="flex flex-col gap-2 mt-10 justify-start items-center w-screen h-45">
        <h className="text-blue-400 font-bold text-4xl bg-neutral-900 px-5 py-2 rounded-xl shadow-black shadow-md cursor-pointer hover:bg-blue-400 hover:text-black transition-all duration-200">
          <a href="https://github.com/efe96238/genre-classifier" target="_blank" rel="noreferrer">Genre Predictor</a>
        </h>

        <fieldset className="fieldset">
          <legend className="fieldset-legend text-blue-400">Browse files or drag and drop</legend>
          <input 
            type="file" 
            className="file-input file-input-info"
            accept=".wav,.mp3,audio/wav,audio/mpeg"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)} 
          />
          <label className="label text-blue-400">.wav or .mp3</label>
        </fieldset>
      </div>
      <div>
        <Predict file={file}/>
      </div>
    </div>
  )
}

export default App
