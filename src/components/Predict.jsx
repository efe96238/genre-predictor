import React, { useState } from 'react'

const Predict = ({ file }) => {

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  const onPredict = async () => {
    setError("")
    setResult(null)

    if (!file) {
      setError("Select a .wav or .mp3 file first!")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    setLoading(true)
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Request failed")
      }

      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e.message || "Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col h-95'>
      <div className='flex flex-col justify-center items-center'>
        <p 
          type="button"
          onClick={onPredict} 
          className='text-black bg-blue-400 text-xl px-2 py-1 rounded-md font-bold shadow-black shadow-md hover:bg-black hover:text-blue-400 transition-all duration-200 cursor-pointer'>
          {loading ? "Predicting..." : "Predict"}
        </p>

        <div className='w-full max-w-md mt-4'>
          {error && (
            <div className='text-red-400 text-sm text-center'>
              {error}
            </div>
          )}

          {result?.probs && (
            <div className='bg-neutral-900 rounded-xl shadow-black shadow-md p-4 overflow-hidden'>
              <div className='text-blue-400 font-bold text-sm text-center mb-3 h-8'>
                {result.filename} → is {result.predicted}!
              </div>

              <div className='flex flex-col gap-1'>
                {Object.entries(result.probs)
                  .sort((a, b) => b[1] - a[1])
                  .map(([label, prob]) => (
                    <div key={label} className='flex justify-between text-blue-400 text-sm'>
                      <span>{label}</span>
                      <span>{(prob * 100).toFixed(2)}%</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Predict