import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import './App.css'
import HeroSection from './components/HeroSection'
import Login from './components/Login'

function AppContent() {
  const location = useLocation()
  const hideNavbar = ['/login', '/register'].includes(location.pathname)

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<div>Register Page</div>} />
        <Route path="/schedule" element={<div>Schedule Page</div>} />
        <Route path="/teams" element={<div>Teams Page</div>} />
        <Route path="/prizes" element={<div>Prizes Page</div>} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
