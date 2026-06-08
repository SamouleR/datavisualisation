import React, { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    // We dynamically load app.js so it executes AFTER React has rendered the DOM
    const script = document.createElement('script')
    script.src = '/app.js'
    script.async = true
    document.body.appendChild(script)
    
    // Cleanup to prevent multiple scripts in dev
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <>
      <div id="root"></div>
    </>
  )
}
