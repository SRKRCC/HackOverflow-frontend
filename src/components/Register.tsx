"use client"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Button from "./ui/button"
import { Users, FileText, CreditCard, CheckCircle, ArrowRight, ArrowLeft, Sparkles } from "lucide-react"

type Member = {
    name: string
    email: string
    phone: string
    photo: File | null
}

type ProblemStatement = {
    title: string
    description: string
}

export default function RegisterPage() {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [lead, setLead] = useState({ name: "", email: "", phone: "", photo: null as File | null })
    const [members, setMembers] = useState<Member[]>(
        Array.from({ length: 5 }, () => ({ name: "", email: "", phone: "", photo: null })),
    )
    const [problemStatement, setProblemStatement] = useState<ProblemStatement>({
        title: "",
        description: "",
    })

    function onMemberChange(index: number, key: keyof Member, value: string | File | null) {
        setMembers((prev) => {
            const next = [...prev]
            next[index] = { ...next[index], [key]: value }
            return next
        })
    }

    function handleLeadPhotoChange(file: File | null) {
        setLead((prev) => ({ ...prev, photo: file }))
    }

    function handleNextStep() {
        setError(null)

        if (currentStep === 2) {
            if (!lead.name || !lead.email || !lead.phone) {
                setError("Please complete all Team Lead fields.")
                return
            }
            const hasAnyMember = members.some((m) => m.name || m.email || m.phone)
            if (!hasAnyMember) {
                setError("Please fill details for at least one Team Member.")
                return
            }
        }

        if (currentStep === 3) {
            if (!problemStatement.title || !problemStatement.description) {
                setError("Please complete both problem statement title and description.")
                return
            }
        }

        setCurrentStep((prev) => prev + 1)
    }

    function handlePrevStep() {
        setError(null)
        setCurrentStep((prev) => prev - 1)
    }

    async function handleSubmit() {
        try {
            setSubmitting(true)
            // TODO: send to your API
            // await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lead, members, problemStatement }) })

            // simulate success
            setTimeout(() => {
                setSubmitting(false)
                navigate("/login", { replace: true })
            }, 800)
        } catch (err) {
            console.error("Registration error:", err)
            setSubmitting(false)
            setError("There was an issue submitting your registration. Please try again.")
        }
    }

    function renderStep1() {
        return (
            <div className="bg-card/80 border border-border/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-primary/10 rounded-3xl mb-6">
                        <Sparkles className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            HACKOVERFLOW
                        </span>
                        <span className="text-foreground">-2K24</span>
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6 rounded-full"></div>
                    <p className="text-xl text-muted-foreground font-medium">National-Level Hackathon by SRKR Coding Club</p>
                </div>

                <div className="space-y-8 text-foreground">
                    <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 rounded-2xl p-8 border border-border/50">
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            The SRKR Coding Club at SRKR Engineering College, Bhimavaram, is excited to announce HACKOVERFLOW-2K24, a
                            prestigious national-level hackathon scheduled for{" "}
                            <strong className="text-primary">October 18th and 19th, 2024</strong>. This 24-hour event is designed to
                            challenge engineering students from across the country, providing a platform to showcase their coding
                            skills and innovative thinking.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-card/50 rounded-2xl p-6 border border-border/50">
                            <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                Event Highlights
                            </h3>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                                    <span className="text-primary mt-1 font-bold">📅</span>
                                    <span>
                                        <strong className="text-foreground">Dates:</strong> October 18th - 19th, 2024
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                                    <span className="text-primary mt-1 font-bold">⏰</span>
                                    <span>
                                        <strong className="text-foreground">Duration:</strong> 24 hours
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                                    <span className="text-primary mt-1 font-bold">💰</span>
                                    <span>
                                        <strong className="text-foreground">Total Prize Pool:</strong> ₹30,000
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                                    <span className="text-primary mt-1 font-bold">📝</span>
                                    <span>
                                        <strong className="text-foreground">Registration Deadline:</strong> October 11th, 2024
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-card/50 rounded-2xl p-6 border border-border/50">
                            <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Themes
                            </h3>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                                    <span className="text-2xl">🌾</span>
                                    <span className="text-foreground font-medium">Agriculture</span>
                                </li>
                                <li className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                                    <span className="text-2xl">🏥</span>
                                    <span className="text-foreground font-medium">Healthcare</span>
                                </li>
                                <li className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                                    <span className="text-2xl">👩‍👧‍👦</span>
                                    <span className="text-foreground font-medium">Women & Child Safety</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl p-6 border border-border/50">
                        <h3 className="text-xl font-semibold mb-4 text-foreground">Why Participate?</h3>
                        <div className="grid md:grid-cols-3 gap-6 text-muted-foreground">
                            <div className="text-center p-4 bg-background/50 rounded-xl">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Sparkles className="h-6 w-6 text-primary" />
                                </div>
                                <strong className="text-foreground block mb-2">Innovation</strong>
                                <p className="text-sm">Push the boundaries of technical expertise and creativity.</p>
                            </div>
                            <div className="text-center p-4 bg-background/50 rounded-xl">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <strong className="text-foreground block mb-2">Networking</strong>
                                <p className="text-sm">Connect with like-minded developers and industry professionals.</p>
                            </div>
                            <div className="text-center p-4 bg-background/50 rounded-xl">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle className="h-6 w-6 text-primary" />
                                </div>
                                <strong className="text-foreground block mb-2">Growth</strong>
                                <p className="text-sm">Showcase your skills in a competitive environment.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                        <p className="text-amber-800 text-center">
                            <strong>Objective:</strong> Develop tech-driven solutions addressing pressing societal issues. Open to
                            engineering students from various disciplines and institutions nationwide.
                        </p>
                    </div>
                </div>

                <div className="mt-10 flex justify-center">
                    <Button
                        onClick={handleNextStep}
                        className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg flex items-center gap-2"
                    >
                        Proceed to Registration
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        )
    }

    function renderStep2() {
        return (
            <div className="bg-card/80 border border-border/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground">Team Registration</h2>
                    </div>
                    <p className="text-muted-foreground">
                        Enter the Team Lead details and up to five team members with their photos.
                    </p>
                </header>

                {error && (
                    <div
                        role="alert"
                        className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-destructive text-sm"
                    >
                        {error}
                    </div>
                )}

                <fieldset className="mb-10">
                    <legend className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Team Lead
                    </legend>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-background/50 rounded-xl border border-border/50">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="leadName" className="text-sm font-medium text-foreground">
                                Team Lead Name
                            </label>
                            <input
                                id="leadName"
                                type="text"
                                required
                                value={lead.name}
                                onChange={(e) => setLead((p) => ({ ...p, name: e.target.value }))}
                                className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                placeholder="Jane Doe"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="leadEmail" className="text-sm font-medium text-foreground">
                                Team Lead Email ID
                            </label>
                            <input
                                id="leadEmail"
                                type="email"
                                required
                                value={lead.email}
                                onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))}
                                className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                placeholder="jane@example.com"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="leadPhone" className="text-sm font-medium text-foreground">
                                Team Lead Mobile No
                            </label>
                            <input
                                id="leadPhone"
                                type="tel"
                                required
                                pattern="^[0-9+\\-\\s()]{7,}$"
                                value={lead.phone}
                                onChange={(e) => setLead((p) => ({ ...p, phone: e.target.value }))}
                                className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                placeholder="+1 555 555 1234"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="leadPhoto" className="text-sm font-medium text-foreground">
                                Upload Photo
                            </label>
                            <input
                                id="leadPhoto"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleLeadPhotoChange(e.target.files?.[0] || null)}
                                className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-primary/10 file:text-primary"
                            />
                        </div>
                    </div>
                </fieldset>

                <div className="space-y-6">
                    {members.map((m, i) => (
                        <fieldset key={i} className="border border-border/50 rounded-xl p-6 bg-background/30">
                            <legend className="text-sm font-medium px-3 text-muted-foreground">Team Member {i + 1}</legend>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor={`m${i}-name`} className="text-sm font-medium text-foreground">
                                        Name
                                    </label>
                                    <input
                                        id={`m${i}-name`}
                                        type="text"
                                        value={m.name}
                                        onChange={(e) => onMemberChange(i, "name", e.target.value)}
                                        className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                        placeholder="Full name"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor={`m${i}-email`} className="text-sm font-medium text-foreground">
                                        Email ID
                                    </label>
                                    <input
                                        id={`m${i}-email`}
                                        type="email"
                                        value={m.email}
                                        onChange={(e) => onMemberChange(i, "email", e.target.value)}
                                        className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                        placeholder="user@example.com"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor={`m${i}-phone`} className="text-sm font-medium text-foreground">
                                        Mobile No
                                    </label>
                                    <input
                                        id={`m${i}-phone`}
                                        type="tel"
                                        pattern="^[0-9+\\-\\s()]{7,}$"
                                        value={m.phone}
                                        onChange={(e) => onMemberChange(i, "phone", e.target.value)}
                                        className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                        placeholder="+1 555 123 4567"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor={`m${i}-photo`} className="text-sm font-medium text-foreground">
                                        Upload Photo
                                    </label>
                                    <input
                                        id={`m${i}-photo`}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => onMemberChange(i, "photo", e.target.files?.[0] || null)}
                                        className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-primary/10 file:text-primary"
                                    />
                                </div>
                            </div>
                        </fieldset>
                    ))}
                </div>
            </div>
        )
    }

    function renderStep3() {
        return (
            <div className="bg-card/80 border border-border/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm max-w-4xl mx-auto">
                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground">Problem Statement</h2>
                    </div>
                    <p className="text-muted-foreground">Define the problem you want to solve during the hackathon.</p>
                </header>

                {error && (
                    <div
                        role="alert"
                        className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-destructive text-sm"
                    >
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="flex flex-col gap-3">
                        <label htmlFor="problemTitle" className="text-sm font-medium text-foreground">
                            Problem Statement Title
                        </label>
                        <input
                            id="problemTitle"
                            type="text"
                            required
                            value={problemStatement.title}
                            onChange={(e) => setProblemStatement((prev) => ({ ...prev, title: e.target.value }))}
                            className="h-12 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                            placeholder="e.g., Smart Traffic Management System"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label htmlFor="problemDescription" className="text-sm font-medium text-foreground">
                            Problem Description
                        </label>
                        <textarea
                            id="problemDescription"
                            required
                            rows={8}
                            value={problemStatement.description}
                            onChange={(e) => setProblemStatement((prev) => ({ ...prev, description: e.target.value }))}
                            className="rounded-xl border border-border bg-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 resize-vertical"
                            placeholder="Describe the problem you want to solve, your approach, and the expected impact..."
                        />
                    </div>
                </div>
            </div>
        )
    }

    function renderStep4() {
        return (
            <div className="bg-card/80 border border-border/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm max-w-3xl mx-auto text-center">
                <header className="mb-8">
                    <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-4">
                        <CreditCard className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Complete Payment</h2>
                    <p className="text-muted-foreground">Finalize your registration with a secure payment of ₹500</p>
                </header>

                <div className="mb-8">
                    <div className="bg-background/50 rounded-2xl p-8 mb-6 border border-border/50">
                        <div className="w-48 h-48 bg-muted rounded-2xl mx-auto mb-4 flex items-center justify-center">
                            <span className="text-muted-foreground">QR Code Placeholder</span>
                        </div>
                        <p className="text-muted-foreground">Scan this QR code to pay ₹500 registration fee</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="p-4 bg-background/50 rounded-xl border border-border/50">
                            <strong className="text-foreground block mb-1">Amount</strong>
                            <span className="text-lg font-bold text-primary">₹500</span>
                        </div>
                        <div className="p-4 bg-background/50 rounded-xl border border-border/50">
                            <strong className="text-foreground block mb-1">UPI ID</strong>
                            <span>hackoverflow@upi</span>
                        </div>
                        <div className="p-4 bg-background/50 rounded-xl border border-border/50">
                            <strong className="text-foreground block mb-1">Account</strong>
                            <span>HackOverflow Registration</span>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                    <p className="text-amber-800">
                        <strong>Important:</strong> After payment, take a screenshot and keep it for verification. Your registration
                        will be confirmed once payment is verified.
                    </p>
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg flex items-center gap-2 mx-auto"
                >
                    {submitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Completing Registration...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="h-5 w-5" />
                            Complete Registration
                        </>
                    )}
                </Button>
            </div>
        )
    }

    return (
        <main className="min-h-screen pt-16 bg-background text-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 animate-gradient" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(190,18,60,0.08),transparent_50%)] opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.06),transparent_50%)] opacity-40" />

            <section className="relative z-10 max-w-6xl mx-auto px-4 py-12">
                <div className="mb-12">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        {[
                            { step: 1, icon: Sparkles, label: "Welcome" },
                            { step: 2, icon: Users, label: "Team Details" },
                            { step: 3, icon: FileText, label: "Problem Statement" },
                            { step: 4, icon: CreditCard, label: "Payment" },
                        ].map(({ step, icon: Icon }) => (
                            <div key={step} className="flex items-center">
                                <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-medium transition-all duration-300 ${step === currentStep
                                        ? "bg-primary text-primary-foreground shadow-lg scale-110"
                                        : step < currentStep
                                            ? "bg-primary/20 text-primary"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>
                                {step < 4 && (
                                    <div
                                        className={`w-16 h-1 mx-3 rounded-full transition-all duration-300 ${step < currentStep ? "bg-primary" : "bg-muted"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <p className="text-muted-foreground">
                            Step {currentStep} of 4:{" "}
                            <span className="font-medium text-foreground">
                                {currentStep === 1
                                    ? "Welcome"
                                    : currentStep === 2
                                        ? "Team Details"
                                        : currentStep === 3
                                            ? "Problem Statement"
                                            : "Payment"}
                            </span>
                        </p>
                    </div>
                </div>

                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}

                {currentStep > 1 && currentStep < 4 && (
                    <div className="mt-10 flex items-center justify-between gap-4">
                        <Button
                            onClick={handlePrevStep}
                            variant="outline"
                            className="px-6 py-3 bg-transparent border-border hover:bg-card rounded-xl flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <div className="flex items-center gap-4">
                            <Link to="/" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                                Back to Home
                            </Link>
                            <Button
                                onClick={handleNextStep}
                                className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg flex items-center gap-2"
                            >
                                Next
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {currentStep === 1 && (
                    <div className="mt-8 text-center">
                        <Link to="/" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                            Back to Home
                        </Link>
                    </div>
                )}
            </section>
        </main>
    )
}
