import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import LandingPage from './pages/LandingPage'
import InputPage from './pages/InputPage'
import ResultPage from './pages/ResultPage'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/input" element={<InputPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </main>
    </div>
  )
}
