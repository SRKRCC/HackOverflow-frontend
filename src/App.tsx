import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import './App.css'
import HeroSection from './components/HeroSection'
import Login from './components/Login'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<div>Register Page</div>} />
        <Route path="/schedule" element={<div>Schedule Page</div>} />
        <Route path="/teams" element={<div>Teams Page</div>} />
        <Route path="/prizes" element={<div>Prizes Page</div>} />
      </Routes>
    </Router>
  )
}

export default App
