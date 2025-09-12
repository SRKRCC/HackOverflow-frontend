import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import './App.css'
import TeamStructure from './TeamStructure'
import AdminStructure from './AdminStructure'
import Login from './components/Login'
import Register from './components/Register'
import Footer from './components/Footer'
import ProblemStatements from './components/ProblemStatement'
import Home from './components/Home'

function AppContent() {
  const location = useLocation()
  const hideNavbarFooter = ['/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/team/') || location.pathname.startsWith('/admin/')
  const marginLeft = (location.pathname.startsWith("/team/") || location.pathname.startsWith("/admin/")) ? "ml-[60px]" : ""

  return (
    <>
      {!hideNavbarFooter && <Navbar className={marginLeft} />}

      <main className={!hideNavbarFooter ? "pt-16" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/problem-statements" element={<ProblemStatements />} />
          <Route path="/schedule" element={<div>Schedule Page</div>} />
          <Route path="/teams" element={<div>Teams Page</div>} />
          <Route path="/prizes" element={<div>Prizes Page</div>} />
          <Route path='/team/*' element={<TeamStructure />} />
          <Route path='/admin/*' element={<AdminStructure />} />
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
