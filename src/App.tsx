import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import './App.css'
import TeamStructure from './TeamStructure'
import AdminStructure from './AdminStructure'
import Login from './components/Login'
import AdminLogin from './components/AdminLogin'
import Register from './components/Register'
import PaymentSuccess from './components/PaymentSuccess'
import Footer from './components/Footer'
import ProblemStatements from './components/ProblemStatement'
import Home from './components/Home'
import Schedule from './components/Schedule'
import Prizes from './components/Prizes'
import PrivacyPolicy from './components/PrivacyPolicy'
import TermsOfServices from './components/TermsOfServices'
import { AdminRoute, TeamRoute } from './components/ProtectedRoute'
import { useAuth } from './lib/hooks'

function AppContent() {
  const location = useLocation()
  const { user } = useAuth()
  const hideNavbarFooter = ['/login', '/admin-login', '/register', '/payment-success'].includes(location.pathname) || location.pathname.startsWith('/team') || location.pathname.startsWith('/admin/')
  const marginLeft = (location.pathname.startsWith("/team") || location.pathname.startsWith("/admin/")) ? "ml-[60px]" : ""

  return (
    <>
      {!hideNavbarFooter && <Navbar className={marginLeft} />}

      <main className={!hideNavbarFooter ? "pt-16" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/problem-statements" element={<ProblemStatements />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/teams" element={<div>Teams Page</div>} />
          <Route path="/prizes" element={<Prizes />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-services" element={<TermsOfServices />} />
          
          {/* Protected Routes */}
          <Route path='/team/*' element={
            <TeamRoute>
              <TeamStructure />
            </TeamRoute>
          } />
          <Route path='/admin/*' element={
            <AdminRoute>
              <AdminStructure />
            </AdminRoute>
          } />
          
          {/* Unauthorized page */}
          <Route path="/unauthorized" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
                <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
                <p className="text-sm text-gray-500">
                  Current user: {user ? `${user.role} (ID: ${user.id})` : 'Not logged in'}
                </p>
                <a href="/login" className="text-blue-600 hover:underline">Go to Login</a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      
      {!hideNavbarFooter && <Footer className={marginLeft} />}
    </>
  )
}

function App() {

  return <AppContent />
}

export default App