"use client"

import type React from "react"

import { Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import Navbar from "./components/Navbar"
import "./App.css"
import HeroSection from "./components/HeroSection"

function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
    </>
  )
}

// Protected Route component to check authentication
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("isAuthenticated")
    setIsAuthenticated(authStatus === "true")
  }, [])

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Render the protected component if authenticated
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      {/* Login page - accessible without authentication */}
      <Route path="/login" element={<LoginPage />} />

      {/* Public registration route */}
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected home page - requires authentication */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Root path redirects to login by default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch all other routes and redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
