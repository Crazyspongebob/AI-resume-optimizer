import { useState } from 'react'
import { DEMO_RESULT } from '../utils/demoData'

export default function useAnalysis() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function analyze(resume, jobDescription, demoMode = false) {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      if (demoMode) {
        await new Promise(r => setTimeout(r, 3000))
        setResult(DEMO_RESULT)
        return DEMO_RESULT
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription }),
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || 'AI分析失败，请稍后重试')
      }

      setResult(data.data)
      return data.data
    } catch (e) {
      const msg = e.message || '网络错误，请检查连接'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setResult(null)
    setError(null)
  }

  return { loading, result, error, analyze, reset }
}
