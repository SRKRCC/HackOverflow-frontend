"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

type Member = {
    name: string
    email: string
    phone: string
}

export default function RegisterPage() {
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [lead, setLead] = useState({ name: "", email: "", phone: "" })
    const [problemStatement, setProblemStatement] = useState("")
    const [problemDescription, setProblemDescription] = useState("")
    const [members, setMembers] = useState<Member[]>(
        Array.from({ length: 5 }, () => ({ name: "", email: "", phone: "" })),
    )

    function onMemberChange(index: number, key: keyof Member, value: string) {
        setMembers((prev) => {
            const next = [...prev]
            next[index] = { ...next[index], [key]: value }
            return next
        })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        // basic validation
        if (!lead.name || !lead.email || !lead.phone) {
            setError("Please complete all Team Lead fields.")
            return
        }

        // validate problem statement fields
        if (!problemStatement || !problemDescription) {
            setError("Please complete both Problem Statement fields.")
            return
        }

        // optional rule: ensure at least one member filled
        const hasAnyMember = members.some((m) => m.name || m.email || m.phone)
        if (!hasAnyMember) {
            setError("Please fill details for at least one Team Member.")
            return
        }

        try {
            setSubmitting(true)
            // TODO: send to your API
            // await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lead, members }) })

            // simulate success
            setTimeout(() => {
                setSubmitting(false)
                navigate("/login", { replace: true })
            }, 800)
        } catch {
            setSubmitting(false)
            setError("There was an issue submitting your registration. Please try again.")
        }
    }

    return (
        <main className="min-h-screen pt-16 bg-background text-foreground">
            <section className="max-w-5xl mx-auto px-4 py-10">
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold text-pretty">Team Registration</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Enter the Team Lead details and up to five team members. You can always update later.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    {error && (
                        <div
                            role="alert"
                            className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-800 text-sm"
                        >
                            {error}
                        </div>
                    )}

                    {/* Team Lead */}
                    <fieldset className="mb-8">
                        <legend className="text-base font-medium mb-3">Team Lead</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        </div>
                    </fieldset>

                    {/* Team Members 1–5 */}
                    <div className="space-y-6">
                        {members.map((m, i) => (
                            <fieldset key={i} className="border border-border rounded-lg p-4">
                                <legend className="text-sm font-medium px-2">Team Member {i + 1}</legend>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
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
                                </div>
                            </fieldset>
                        ))}
                    </div>

                    {/* Problem Statement */}
                    <fieldset className="mb-8 mt-8">
                        <legend className="text-base font-medium mb-3">Problem Statement</legend>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="problemStatement" className="text-sm">
                                    Problem Statement
                                </label>
                                <input
                                    id="problemStatement"
                                    type="text"
                                    required
                                    value={problemStatement}
                                    onChange={(e) => setProblemStatement(e.target.value)}
                                    className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Enter the problem statement title"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="problemDescription" className="text-sm">
                                    Description of the Problem Statement
                                </label>
                                <textarea
                                    id="problemDescription"
                                    required
                                    rows={4}
                                    value={problemDescription}
                                    onChange={(e) => setProblemDescription(e.target.value)}
                                    className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
                                    placeholder="Provide a detailed description of the problem statement..."
                                />
                            </div>
                        </div>
                    </fieldset>

                    <div className="mt-8 flex items-center justify-between gap-4">
                        <Link to="/home" className="text-sm text-primary hover:underline">
                            Back to home
                        </Link>
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                        >
                            {submitting ? "Submitting..." : "Submit Registration"}
                        </Button>
                    </div>
                </form>

                <p className="text-xs text-muted-foreground mt-4">
                    By submitting, you agree to our Terms and acknowledge our Privacy Policy.
                </p>
            </section>
        </main>
    )
}
