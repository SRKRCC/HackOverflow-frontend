"use client"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

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
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-4">HACKOVERFLOW-2K24</h1>
                    <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
                    <p className="text-lg text-muted-foreground">National-Level Hackathon by SRKR Coding Club</p>
                </div>

                <div className="space-y-6 text-foreground">
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
                        <p className="text-muted-foreground leading-relaxed">
                            The SRKR Coding Club at SRKR Engineering College, Bhimavaram, is excited to announce HACKOVERFLOW-2K24, a
                            prestigious national-level hackathon scheduled for <strong>October 18th and 19th, 2024</strong>. This
                            24-hour event is designed to challenge engineering students from across the country, providing a platform
                            to showcase their coding skills and innovative thinking.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-medium mb-3 text-primary">Event Highlights</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        <strong>Dates:</strong> October 18th - 19th, 2024
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        <strong>Duration:</strong> 24 hours
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        <strong>Total Prize Pool:</strong> ₹30,000
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        <strong>Registration Deadline:</strong> October 11th, 2024
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-3 text-primary">Themes</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">🌾</span>
                                    <span>Agriculture</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">🏥</span>
                                    <span>Healthcare</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">👩‍👧‍👦</span>
                                    <span>Women & Child Safety</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-3">Why Participate?</h3>
                        <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div>
                                <strong className="text-foreground">Innovation:</strong> A platform to push the boundaries of technical
                                expertise.
                            </div>
                            <div>
                                <strong className="text-foreground">Networking:</strong> Opportunities for collaboration and
                                professional connections.
                            </div>
                            <div>
                                <strong className="text-foreground">Growth:</strong> Experience and showcase your skills in a
                                high-stakes environment.
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-800">
                            <strong>Objective:</strong> Develop tech-driven solutions addressing pressing societal issues. Open to
                            engineering students from various disciplines and institutions nationwide.
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <Button onClick={handleNextStep} className="px-8 py-2 bg-primary text-primary-foreground hover:opacity-90">
                        Proceed to Registration
                    </Button>
                </div>
            </div>
        )
    }

    function renderStep2() {
        return (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <header className="mb-6">
                    <h2 className="text-2xl font-semibold text-pretty">Team Registration</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Enter the Team Lead details and up to five team members with their photos.
                    </p>
                </header>

                {error && (
                    <div role="alert" className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-800 text-sm">
                        {error}
                    </div>
                )}

                {/* Team Lead */}
                <fieldset className="mb-8">
                    <legend className="text-base font-medium mb-3">Team Lead</legend>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="leadName" className="text-sm">
                                Team Lead Name
                            </label>
                            <input
                                id="leadName"
                                type="text"
                                required
                                value={lead.name}
                                onChange={(e) => setLead((p) => ({ ...p, name: e.target.value }))}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Jane Doe"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="leadEmail" className="text-sm">
                                Team Lead Email ID
                            </label>
                            <input
                                id="leadEmail"
                                type="email"
                                required
                                value={lead.email}
                                onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="jane@example.com"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="leadPhone" className="text-sm">
                                Team Lead Mobile No
                            </label>
                            <input
                                id="leadPhone"
                                type="tel"
                                required
                                pattern="^[0-9+\\-\\s()]{7,}$"
                                value={lead.phone}
                                onChange={(e) => setLead((p) => ({ ...p, phone: e.target.value }))}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="+1 555 555 1234"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="leadPhoto" className="text-sm">
                                Upload Photo
                            </label>
                            <input
                                id="leadPhoto"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleLeadPhotoChange(e.target.files?.[0] || null)}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-muted file:text-muted-foreground"
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Team Members 1–5 */}
                <div className="space-y-6">
                    {members.map((m, i) => (
                        <fieldset key={i} className="border border-border rounded-lg p-4">
                            <legend className="text-sm font-medium px-2">Team Member {i + 1}</legend>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor={`m${i}-name`} className="text-sm">
                                        Name
                                    </label>
                                    <input
                                        id={`m${i}-name`}
                                        type="text"
                                        value={m.name}
                                        onChange={(e) => onMemberChange(i, "name", e.target.value)}
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Full name"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor={`m${i}-email`} className="text-sm">
                                        Email ID
                                    </label>
                                    <input
                                        id={`m${i}-email`}
                                        type="email"
                                        value={m.email}
                                        onChange={(e) => onMemberChange(i, "email", e.target.value)}
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="user@example.com"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor={`m${i}-phone`} className="text-sm">
                                        Mobile No
                                    </label>
                                    <input
                                        id={`m${i}-phone`}
                                        type="tel"
                                        pattern="^[0-9+\\-\\s()]{7,}$"
                                        value={m.phone}
                                        onChange={(e) => onMemberChange(i, "phone", e.target.value)}
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="+1 555 123 4567"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor={`m${i}-photo`} className="text-sm">
                                        Upload Photo
                                    </label>
                                    <input
                                        id={`m${i}-photo`}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => onMemberChange(i, "photo", e.target.files?.[0] || null)}
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-muted file:text-muted-foreground"
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
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm max-w-3xl mx-auto">
                <header className="mb-6">
                    <h2 className="text-2xl font-semibold text-pretty">Problem Statement</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Define the problem you want to solve during the hackathon.
                    </p>
                </header>

                {error && (
                    <div role="alert" className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-800 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="problemTitle" className="text-sm font-medium">
                            Problem Statement Title
                        </label>
                        <input
                            id="problemTitle"
                            type="text"
                            required
                            value={problemStatement.title}
                            onChange={(e) => setProblemStatement((prev) => ({ ...prev, title: e.target.value }))}
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="e.g., Smart Traffic Management System"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="problemDescription" className="text-sm font-medium">
                            Problem Description
                        </label>
                        <textarea
                            id="problemDescription"
                            required
                            rows={6}
                            value={problemStatement.description}
                            onChange={(e) => setProblemStatement((prev) => ({ ...prev, description: e.target.value }))}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
                            placeholder="Describe the problem you want to solve, your approach, and the expected impact..."
                        />
                    </div>
                </div>
            </div>
        )
    }

    function renderStep4() {
        return (
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm max-w-2xl mx-auto text-center">
                <header className="mb-6">
                    <h2 className="text-2xl font-semibold text-pretty">Payment</h2>
                    <p className="text-sm text-muted-foreground mt-1">Complete your registration by making the payment of ₹500</p>
                </header>

                <div className="mb-6">
                    <div className="bg-muted/50 rounded-lg p-8 mb-4">
                        <img src="/qr-code-payment.png" alt="Payment QR Code" className="mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">Scan this QR code to pay ₹500 registration fee</p>
                    </div>

                    <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                            <strong>Amount:</strong> ₹500
                        </p>
                        <p>
                            <strong>UPI ID:</strong> hackoverflow@upi
                        </p>
                        <p>
                            <strong>Account:</strong> HackOverflow Registration
                        </p>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-amber-800">
                        <strong>Important:</strong> After payment, take a screenshot and keep it for verification. Your registration
                        will be confirmed once payment is verified.
                    </p>
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-8 py-2 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60"
                >
                    {submitting ? "Completing Registration..." : "Complete Registration"}
                </Button>
            </div>
        )
    }

    return (
        <main className="min-h-screen pt-16 bg-background text-foreground">
            <section className="max-w-5xl mx-auto px-4 py-10">
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === currentStep
                                        ? "bg-primary text-primary-foreground"
                                        : step < currentStep
                                            ? "bg-primary/20 text-primary"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {step}
                                </div>
                                {step < 4 && <div className={`w-12 h-0.5 mx-2 ${step < currentStep ? "bg-primary" : "bg-muted"}`} />}
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Step {currentStep} of 4:{" "}
                            {currentStep === 1
                                ? "Welcome"
                                : currentStep === 2
                                    ? "Team Details"
                                    : currentStep === 3
                                        ? "Problem Statement"
                                        : "Payment"}
                        </p>
                    </div>
                </div>

                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}

                {currentStep > 1 && currentStep < 4 && (
                    <div className="mt-8 flex items-center justify-between gap-4">
                        <Button onClick={handlePrevStep} variant="outline" className="px-6 bg-transparent">
                            Previous
                        </Button>
                        <div className="flex items-center gap-4">
                            <Link to="/" className="text-sm text-primary hover:underline">
                                Back to Home
                            </Link>
                            <Button onClick={handleNextStep} className="px-6 bg-primary text-primary-foreground hover:opacity-90">
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {currentStep === 1 && (
                    <div className="mt-6 text-center">
                        <Link to="/" className="text-sm text-primary hover:underline">
                            Back to Home
                        </Link>
                    </div>
                )}
            </section>
        </main>
    )
}
