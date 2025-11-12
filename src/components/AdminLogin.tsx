"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "./ui/button"
import { ShieldCheck, Settings, Loader2, Eye, EyeOff, Crown } from "lucide-react"
import { useAuth } from "../lib/hooks"

export default function AdminLoginPage() {
    const navigate = useNavigate()
    const { login, loading: authLoading } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loading = authLoading

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (!email || !password) {
            setError("Please enter your credentials.")
            return
        }

        // Basic email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.")
            return
        }

        try {
            await login({ role: 'admin', username: email, password })
            navigate("/admin/dashboard", { replace: true })
        } catch (err: any) {
            setError(err.message || "Login failed. Please check your credentials.")
        }
    }

    return (
        <main className="min-h-screen relative overflow-hidden bg-background text-foreground font-sans">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/8 via-background to-orange-500/6 animate-gradient" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.1),transparent_50%)] opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.08),transparent_50%)] opacity-40" />

            {/* Floating Admin Icons */}
            <div className="pointer-events-none">
                <div className="absolute top-20 left-16 w-24 h-24 bg-red-500/12 rounded-full blur-sm animate-float" />
                <div
                    className="absolute bottom-32 right-20 w-20 h-20 bg-orange-500/10 rounded-2xl rotate-12 blur-sm animate-float"
                    style={{ animationDelay: "1.2s" }}
                />
                <div
                    className="absolute top-1/3 right-1/4 w-16 h-16 bg-red-400/8 rounded-full blur-sm animate-float"
                    style={{ animationDelay: "2.4s" }}
                />
                <div
                    className="absolute top-1/4 left-1/3 w-12 h-12 bg-orange-400/6 rounded-lg rotate-45 blur-sm animate-float"
                    style={{ animationDelay: "0.8s" }}
                />
            </div>

            <section className="relative z-10 mx-auto grid lg:grid-cols-2 items-center min-h-screen max-w-7xl px-6">
                <div className="flex items-center justify-center py-12">
                    <div className="hidden lg:flex flex-col justify-center animate-slide-up max-w-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-500/10 rounded-xl">
                                <Crown className="h-6 w-6 text-red-600" />
                            </div>
                            <h1 className="text-4xl xl:text-5xl font-bold text-balance leading-tight">
                                <span className="text-foreground">Admin </span>
                                <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                                    Portal
                                </span>
                                <span className="text-orange-600"> Access</span>
                            </h1>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
                            Administrative access to manage teams, tasks, announcements, and monitor the hackathon event. 
                            Secure authentication for authorized personnel only.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border/50 backdrop-blur-sm">
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                    <ShieldCheck className="h-5 w-5 text-red-600" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">Enhanced Security</h3>
                                    <p className="text-sm text-muted-foreground">Multi-layer admin authentication system</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border/50 backdrop-blur-sm">
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                    <Settings className="h-5 w-5 text-red-600" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">Full Control</h3>
                                    <p className="text-sm text-muted-foreground">Comprehensive event management tools</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border/50 backdrop-blur-sm">
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                    <Crown className="h-5 w-5 text-red-600" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">Administrative Rights</h3>
                                    <p className="text-sm text-muted-foreground">Privileged access to all system features</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-full flex items-center justify-center py-12">
                    <div
                        className="w-full max-w-md bg-card/80 border border-border/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm animate-scale-in"
                        aria-labelledby="admin-login-title"
                    >
                        <div className="mb-8 text-center">
                            <div className="inline-flex p-3 bg-red-500/10 rounded-2xl mb-4">
                                <Crown className="h-8 w-8 text-red-600" />
                            </div>
                            <h2 id="admin-login-title" className="text-3xl font-bold mb-2 text-balance text-foreground">
                                Admin Access
                            </h2>
                            <p className="text-muted-foreground">Enter your administrator credentials</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-foreground">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground pointer-events-none">
                                        <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="username"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        aria-invalid={!!error && !email}
                                        placeholder="admin@hackoverflow.com"
                                        className="w-full bg-input border border-border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-200"
                                        data-testid="email-input"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-input border border-border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-200"
                                        aria-invalid={!!error && !password}
                                        aria-describedby={error ? "admin-login-error" : undefined}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="inline-flex items-center gap-3 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-border text-red-600 focus:ring-red-500/50"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="text-muted-foreground">Remember me</span>
                                </label>
                                <button 
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="text-sm text-red-600 hover:text-red-500 transition-colors font-medium"
                                >
                                    Team Login
                                </button>
                            </div>

                            {error ? (
                                <div
                                    id="admin-login-error"
                                    role="alert"
                                    aria-live="polite"
                                    className="rounded-xl border border-red-400/40 bg-red-500/10 text-red-600 px-4 py-3 text-sm"
                                >
                                    {error}
                                </div>
                            ) : null}

                            <Button
                                type="submit"
                                disabled={loading}
                                aria-busy={loading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                            >
                                {loading ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Authenticating…
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2">
                                        <Crown className="h-5 w-5" />
                                        Access Admin Panel
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    )
}