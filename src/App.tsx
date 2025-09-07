import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import './App.css'
import HeroSection from './components/HeroSection'
import Structure from './Structure'
import Login from './components/Login'
import Register from './components/Register'
import Footer from './components/Footer'
import About from './components/About'

function AppContent() {
  const location = useLocation()
  const hideNavbarFooter = ['/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/team/')
  const marginLeft = location.pathname.startsWith("/team/") ? "ml-[60px]" : ""

  return (
    <>
      {!hideNavbarFooter && <Navbar className={marginLeft} />}

      <main className={!hideNavbarFooter ? "pt-16" : ""}>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/schedule" element={<div>Schedule Page</div>} />
        <Route path="/teams" element={<div>Teams Page</div>} />
        <Route path="/prizes" element={<div>Prizes Page</div>} />
        <Route path='/*' element={<Structure />} />
      </Routes>
      </main>
      {!hideNavbarFooter && <Footer className={marginLeft} />}
    </>
  )
}

function App() {
  return (
    <AppContent />
  )
}

export default App
