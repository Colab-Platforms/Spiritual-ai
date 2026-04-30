import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Kundali from './pages/Kundali'
import Horoscope from './pages/Horoscope'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-primary text-text-light">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/kundali" element={<Kundali />} />
          <Route path="/horoscope" element={<Horoscope />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
