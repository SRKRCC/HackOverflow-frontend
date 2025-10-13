"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "./ui/button"
import { Lock, ShieldCheck, Zap, Loader2, Eye, EyeOff, Sparkles } from "lucide-react"
import { useAuth } from "../lib/hooks"

export default function LoginPage() {
    const navigate = useNavigate()
    const { login, error: authError, loading: authLoading } = useAuth()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState<'team' | 'admin'>('team')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loading = authLoading

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (!username || !password) {
            setError("Please enter your credentials.")
            return
        }

        // Validation based on role
        if (role === 'team' && !/^SCC\d{3}$/.test(username.toUpperCase())) {
            setError("Please enter a valid SCC ID (format: SCC001).")
            return
        }

        try {
            await login({ role, username, password })
            
            // Navigate based on role
            if (role === 'admin') {
                navigate("/admin", { replace: true })
            } else {
                navigate("/team", { replace: true })
            }
        } catch (err: any) {
            setError(err.message || "Login failed. Please try again.")
        }
    }

    return (
        <main className="min-h-screen relative overflow-hidden bg-background text-foreground font-sans">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-secondary/6 animate-gradient" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(190,18,60,0.1),transparent_50%)] opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.08),transparent_50%)] opacity-40" />

            <div className="pointer-events-none">
                <div className="absolute top-20 left-16 w-24 h-24 bg-primary/12 rounded-full blur-sm animate-float" />
                <div
                    className="absolute bottom-32 right-20 w-20 h-20 bg-secondary/10 rounded-2xl rotate-12 blur-sm animate-float"
                    style={{ animationDelay: "1.2s" }}
                />
                <div
                    className="absolute top-1/3 right-1/4 w-16 h-16 bg-accent/8 rounded-full blur-sm animate-float"
                    style={{ animationDelay: "2.4s" }}
                />
                <div
                    className="absolute top-1/4 left-1/3 w-12 h-12 bg-primary/6 rounded-lg rotate-45 blur-sm animate-float"
                    style={{ animationDelay: "0.8s" }}
                />
            </div>

            <section className="relative z-10 mx-auto grid lg:grid-cols-2 items-center min-h-screen max-w-7xl px-6">
                <div className="flex items-center justify-center py-12">
                    <div className="hidden lg:flex flex-col justify-center animate-slide-up max-w-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <Sparkles className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-4xl xl:text-5xl font-bold text-balance leading-tight">
                                <span className="text-foreground">Welcome to </span>
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    HackOverflow
                                </span>
                                <span className="text-secondary"> 2K25</span>
                            </h1>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
                            Sign in to manage your registration, join teams, and track the event schedule. Your credentials are
                            securely handled with enterprise-grade protection.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border/50 backdrop-blur-sm">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">Secure Authentication</h3>
                                    <p className="text-sm text-muted-foreground">Session persistence with advanced security</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border/50 backdrop-blur-sm">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Lock className="h-5 w-5 text-primary" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">Protected Access</h3>
                                    <p className="text-sm text-muted-foreground">Private dashboards and team management</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border/50 backdrop-blur-sm">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">Lightning Fast</h3>
                                    <p className="text-sm text-muted-foreground">Optimized performance and clean interface</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-full flex items-center justify-center py-12">
                    <div
                        className="w-full max-w-md bg-card/80 border border-border/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm animate-scale-in"
                        aria-labelledby="login-title"
                    >
                        <div className="mb-8 text-center">
                            <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-4">
                                <Lock className="h-8 w-8 text-primary" />
                            </div>
                            <h2 id="login-title" className="text-3xl font-bold mb-2 text-balance text-foreground">
                                Welcome Back
                            </h2>
                            <p className="text-muted-foreground">Access your dashboard and manage your hackathon journey</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            {/* Role Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Login As</label>
                                <div className="flex gap-2 p-1 bg-muted rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setRole('team')}
                                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                                            role === 'team'
                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Team Member
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole('admin')}
                                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                                            role === 'admin'
                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Admin
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="username" className="text-sm font-medium text-foreground">
                                    {role === 'team' ? 'SCC ID' : 'Email Address'}
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground pointer-events-none">
                                        <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <input
                                        id="username"
                                        type={role === 'team' ? 'text' : 'email'}
                                        pattern={role === 'team' ? "SCC\\d{3}" : undefined}
                                        maxLength={role === 'team' ? 6 : undefined}
                                        autoComplete="username"
                                        value={username}
                                        onChange={(e) => setUsername(role === 'team' ? e.target.value.toUpperCase() : e.target.value)}
                                        required
                                        aria-invalid={!!error && !username}
                                        placeholder={role === 'team' ? 'SCC001' : 'admin@example.com'}
                                        className="w-full bg-input border border-border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                        data-testid="username-input"
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
                                        className="w-full bg-input border border-border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                        aria-invalid={!!error && !password}
                                        aria-describedby={error ? "login-error" : undefined}
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
                                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary/50"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="text-muted-foreground">Remember me</span>
                                </label>
                                <a
                                    href="#forgot-password"
                                    className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            {error ? (
                                <div
                                    id="login-error"
                                    role="alert"
                                    aria-live="polite"
                                    className="rounded-xl border border-destructive/40 bg-destructive/10 text-destructive px-4 py-3 text-sm"
                                >
                                    {error}
                                </div>
                            ) : null}

                            <Button
                                type="submit"
                                disabled={loading}
                                aria-busy={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                            >
                                {loading ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Signing in…
                                    </span>
                                ) : (
                                    "Sign in"
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    )
}
