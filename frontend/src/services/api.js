const BASE_URL = '/api'

export async function analyzeResume(resume, jobDescription) {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, jobDescription }),
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json()
}

export async function getDemoData() {
  const res = await fetch(`${BASE_URL}/demo-data`)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json()
}

export async function healthCheck() {
  const res = await fetch(`${BASE_URL}/health`)
  return res.json()
}
