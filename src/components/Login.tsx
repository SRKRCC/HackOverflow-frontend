"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Lock, ShieldCheck, Zap, Loader2, Eye, EyeOff, Github, Mail } from "lucide-react"

export default function LoginPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (!email || !password) {
            setError("Please enter your email and password.")
            return
        }

        try {
            setLoading(true)
            await new Promise((res) => setTimeout(res, 600))

            localStorage.setItem("isAuthenticated", "true")
            localStorage.setItem("rememberMe", rememberMe ? "true" : "false")

            navigate("/home", { replace: true })
        } catch {
            setError("Login failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen pt-16 relative overflow-hidden bg-background text-foreground montserrat-family">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 animate-gradient" />
            <div className="pointer-events-none">
                <div className="absolute top-16 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float" />
                <div
                    className="absolute bottom-24 right-12 w-16 h-16 bg-accent/10 rounded-lg rotate-12 animate-float"
                    style={{ animationDelay: "0.8s" }}
                />
                <div
                    className="absolute top-1/3 right-1/4 w-12 h-12 bg-secondary/10 rounded-full animate-float"
                    style={{ animationDelay: "1.6s" }}
                />
            </div>

            <section className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-10 px-4 py-8 min-h-[calc(100vh-4rem)]">
                <div className="hidden md:flex flex-col justify-center animate-slide-up">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="h-7 w-7 text-primary animate-pulse" aria-hidden="true" />
                        <h1 className="text-3xl lg:text-4xl font-bold">
                            <span className="text-foreground">Welcome to </span>
                            <span className="text-primary">HackOverflow</span>
                            <span className="text-secondary"> 2K25</span>
                        </h1>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6 max-w-prose">
                        Sign in to manage your registration, join teams, and track the event schedule. Your credentials are securely
                        handled.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm text-muted-foreground">
                            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                            Secure access with session persistence
                        </li>
                        <li className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Lock className="h-5 w-5 text-primary" aria-hidden="true" />
                            Protected routes and private dashboards
                        </li>
                        <li className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
                            Fast onboarding with a clean UI
                        </li>
                    </ul>
                </div>

                <div className="w-full flex items-center justify-center">
                    <div
                        className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-xl backdrop-blur-sm animate-scale-in"
                        aria-labelledby="login-title"
                    >
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                                    <Zap className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <span className="text-sm font-semibold tracking-wide text-muted-foreground">HackOverflow 2K25</span>
                            </div>
                            <h2 id="login-title" className="text-2xl font-semibold mb-1 text-balance">
                                Sign in to your account
                            </h2>
                            <p className="text-sm text-muted-foreground">Access your dashboard, teams, and event updates.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
                            <div className="grid gap-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground pointer-events-none">
                                        <Mail className="h-4 w-4" aria-hidden="true" />
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        aria-invalid={!!error && !email}
                                        placeholder="you@example.com"
                                        className="w-full bg-input border border-border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                        data-testid="email-input"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">We’ll never share your email.</p>
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="password" className="text-sm font-medium">
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
                                        className="w-full bg-input border border-border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                        aria-invalid={!!error && !password}
                                        aria-describedby={error ? "login-error" : undefined}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="inline-flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-border"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="text-muted-foreground">Remember me</span>
                                </label>
                                <a href="#forgot-password" className="text-sm text-primary hover:underline">
                                    Forgot password?
                                </a>
                            </div>

                            {error ? (
                                <div
                                    id="login-error"
                                    role="alert"
                                    aria-live="polite"
                                    className="rounded-md border border-destructive/40 bg-destructive/10 text-destructive px-3 py-2 text-sm"
                                >
                                    {error}
                                </div>
                            ) : null}

                            <Button
                                type="submit"
                                disabled={loading}
                                aria-busy={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:scale-[1.01] shadow-sm"
                            >
                                {loading ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Signing in…
                                    </span>
                                ) : (
                                    "Sign in"
                                )}
                            </Button>

                            <div className="relative my-1">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-card px-2 text-xs text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full border-primary/40 text-foreground hover:bg-primary/10 bg-transparent"
                                >
                                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                        <circle cx="12" cy="12" r="10" className="fill-primary/60" />
                                    </svg>
                                    Google
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full border-primary/40 text-foreground hover:bg-primary/10 bg-transparent"
                                >
                                    <Github className="h-4 w-4 mr-2" />
                                    GitHub
                                </Button>
                            </div>


                        </form>
                    </div>
                </div>
            </section>
        </main>
    )
}
