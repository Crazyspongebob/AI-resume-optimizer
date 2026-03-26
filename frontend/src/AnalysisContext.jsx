import { createContext, useContext, useState } from 'react'

const AnalysisContext = createContext(null)

export function AnalysisProvider({ children }) {
  const [result, setResult] = useState(null)
  const [inputData, setInputData] = useState({ resume: '', jobDescription: '' })

  return (
    <AnalysisContext.Provider value={{ result, setResult, inputData, setInputData }}>
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysisContext() {
  const ctx = useContext(AnalysisContext)
  if (!ctx) throw new Error('useAnalysisContext must be used within AnalysisProvider')
  return ctx
}
