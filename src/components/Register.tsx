"use client"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import Button from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Users, CreditCard, CheckCircle, ArrowRight, ArrowLeft, Sparkles, Plus, Trash2, FileText, Home, Clock, MessageCircle, QrCode } from "lucide-react"
import { ApiService } from '@/lib/api/service'
import type { ProblemStatement as ApiProblemStatement } from '@/lib/types'

type Member = {
    name: string
    email: string
    phone: string
    photo: File | null
    department: string
    collegeName: string
    yearOfStudy: number
    location: string
    tShirtSize: string
}

type ProblemStatement = {
    id: string
    psId?: string
    title: string
    description: string
    category: string
    tags: string[]
    isCustom?: boolean
}

export default function RegisterPage() {
    const navigate = useNavigate()
    
    const registrationDeadline = new Date('2025-12-13T00:00:00')
    const isRegistrationOpen = new Date() < registrationDeadline
    
    const [currentStep, setCurrentStep] = useState(1)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [teamName, setTeamName] = useState("")
    const [lead, setLead] = useState({ 
        name: "", 
        email: "", 
        phone: "", 
        photo: null as File | null,
        department: "",
        collegeName: "",
        yearOfStudy: 0,
        location: "",
        tShirtSize: ""
    })
    const [members, setMembers] = useState<Member[]>([])
    const [problemStatement, setProblemStatement] = useState<ProblemStatement>({
        id: "",
        title: "",
        description: "",
        category: "",
        tags: []
    })

    // Problem statement selection states
    const [availableProblemStatements, setAvailableProblemStatements] = useState<ApiProblemStatement[]>([])
    const [selectedProblemStatementId, setSelectedProblemStatementId] = useState<string>("")
    const [showCustomProblemStatement, setShowCustomProblemStatement] = useState(false)
    const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null)
    const [upiReferenceId, setUpiReferenceId] = useState("")
    const [transactionId, setTransactionId] = useState("")
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [registrationResponse, setRegistrationResponse] = useState<{ message: string; sccId?: string } | null>(null)
    const [loadingProblemStatements, setLoadingProblemStatements] = useState(false)
    const [showWhatsAppQR, setShowWhatsAppQR] = useState(false)

    // Fetch available problem statements
    useEffect(() => {
        const fetchProblemStatements = async () => {
            try {
                setLoadingProblemStatements(true)
                const data = await ApiService.public.getProblemStatements()
                setAvailableProblemStatements(data)
            } catch (err) {
                console.error("Failed to fetch problem statements:", err)
                setError("Failed to load problem statements. Please try again later.")
            } finally {
                setLoadingProblemStatements(false)
            }
        }

        fetchProblemStatements()
    }, [])

    // Handle problem statement selection
    const handleProblemStatementSelect = (psId: string) => {
        setSelectedProblemStatementId(psId)
        
        if (psId === "custom") {
            setShowCustomProblemStatement(true)
            setProblemStatement({
                id: "",
                title: "",
                description: "",
                category: "",
                tags: [],
                isCustom: true
            })
        } else {
            setShowCustomProblemStatement(false)
            const selected = availableProblemStatements.find(ps => ps.psId === psId)
            if (selected) {
                setProblemStatement({
                    id: selected.id ? selected.id.toString() : "",
                    psId: selected.psId,
                    title: selected.title,
                    description: selected.description,
                    category: selected.category,
                    tags: selected.tags,
                    isCustom: false
                })
            }
        }
    }

    function onMemberChange(index: number, key: keyof Member, value: string | File | null | number) {
        setMembers((prev) => {
            const next = [...prev]
            next[index] = { ...next[index], [key]: value }
            return next
        })
    }

    function copyTeamLeadDetails(index: number) {
        setMembers((prev) => {
            const next = [...prev]
            next[index] = { 
                ...next[index], 
                collegeName: lead.collegeName,
                department: lead.department,
                yearOfStudy: lead.yearOfStudy,
                location: lead.location
            }
            return next
        })
    }

    function addMember() {
        if (members.length < 5) {
            setMembers(prev => [...prev, { 
                name: "", 
                email: "", 
                phone: "", 
                photo: null,
                department: "",
                collegeName: "",
                yearOfStudy: 0,
                location: "",
                tShirtSize: ""
            }])
        }
    }

    function removeMember(index: number) {
        setMembers(prev => prev.filter((_, i) => i !== index))
    }

    function handleNextStep() {
        setError(null)

        if (currentStep === 2) {
            if (!teamName.trim()) {
                setError("Please enter a team name.")
                return
            }
            if (!lead.name || !lead.email || !lead.phone || !lead.collegeName || !lead.department || !lead.tShirtSize) {
                setError("Please complete all required Team Lead fields.")
                return
            }
            if (members.length < 3) {
                setError("Please add at least 3 team members (minimum 4 members total including team lead).")
                return
            }
            if (members.length > 5) {
                setError("Maximum 6 members total allowed (including team lead).")
                return
            }
            // Check if all team members have required fields filled
            const incompleteMembers = members.some(member => !member.name || !member.email || !member.phone || !member.collegeName || !member.department || !member.tShirtSize)
            if (incompleteMembers) {
                setError("Please complete all fields for all team members.")
                return
            }

            // Validate problem statement
            if (!selectedProblemStatementId) {
                setError("Please select a problem statement.")
                return
            }
            
            if (showCustomProblemStatement) {
                if (!problemStatement.title || !problemStatement.description || !problemStatement.category) {
                    setError("Please complete all custom problem statement fields.")
                    return
                }
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
            
            const totalMembers = members.length + 1
            const amountPerHead = 850
            const totalAmount = totalMembers * amountPerHead
            
            // Prepare registration data object
            const registrationData = {
                teamName,
                lead: {
                    name: lead.name,
                    email: lead.email,
                    phone: lead.phone,
                    collegeName: lead.collegeName,
                    department: lead.department,
                    yearOfStudy: lead.yearOfStudy,
                    location: lead.location,
                    tShirtSize: lead.tShirtSize,
                    photo: null // Will be handled separately
                },
                members: members.map(member => ({
                    name: member.name,
                    email: member.email,
                    phone: member.phone,
                    collegeName: member.collegeName,
                    department: member.department,
                    yearOfStudy: member.yearOfStudy,
                    location: member.location,
                    tShirtSize: member.tShirtSize,
                    photo: null // Will be handled separately
                })),
                problemStatement: {
                    id: problemStatement.id,
                    psId: problemStatement.psId,
                    title: problemStatement.title,
                    description: problemStatement.description,
                    category: problemStatement.category,
                    tags: problemStatement.tags,
                    isCustom: problemStatement.isCustom || false
                },
                payment: {
                    totalMembers,
                    amountPerHead,
                    totalAmount,
                    screenshot: null, // Will be handled separately
                    upiReferenceId,
                    transactionId
                }
            }

            // Create FormData and append the data as JSON string
            const formData = new FormData()
            formData.append('data', JSON.stringify(registrationData))
            
            // Append files separately
            if (lead.photo) {
                formData.append('leadPhoto', lead.photo)
            }
            
            members.forEach((member, index) => {
                if (member.photo) {
                    formData.append(`memberPhoto_${index}`, member.photo)
                }
            })
            
            if (paymentScreenshot) {
                formData.append('paymentScreenshot', paymentScreenshot)
            }
            
            // Send registration data to backend
            const response = await ApiService.public.registerTeam(formData)

            setRegistrationResponse({
                message: response.message,
                sccId: response.sccId
            })

            setSubmitting(false)
            setShowSuccessModal(true)
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
                    {/* <div className="inline-flex p-4 bg-primary/10 rounded-3xl mb-6">
                        <Sparkles className="h-12 w-12 text-primary" />
                    </div> */}
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            HACKOVERFLOW
                        </span>
                        <span className="text-foreground">-2K25</span>
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6 rounded-full"></div>
                    <p className="text-xl text-muted-foreground font-medium">National-Level Hackathon by SRKR Coding Club</p>
                </div>

                <div className="space-y-8 text-foreground">
                    <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 rounded-2xl p-8 border border-border/50">
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            Join HACKOVERFLOW-2K25, SRKR Coding Club's national-level hackathon on{" "}
                            <strong className="text-primary">December 19th-20th, 2025</strong>. A 24-hour innovation challenge for engineering students nationwide to showcase coding skills and creative solutions.
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
                                        <strong className="text-foreground">Dates:</strong> December 19th-20th, 2025
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
                                        <strong className="text-foreground">Prize Pool:</strong> ₹35,000
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                                    <span className="text-primary mt-1 font-bold">📝</span>
                                    <span>
                                        <strong className="text-foreground">Registration:</strong> December 15th, 2025
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-card/50 rounded-2xl p-6 border border-border/50">
                            <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                Themes
                            </h3>
                            <div className="grid grid-cols-2 gap-3 text-muted-foreground">
                                <div className="flex items-center justify-center p-3 bg-background/50 rounded-lg">
                                    <span className="text-foreground font-medium">AI & ML</span>
                                </div>
                                <div className="flex items-center justify-center p-3 bg-background/50 rounded-lg">
                                    <span className="text-foreground font-medium">Web3 & Blockchain</span>
                                </div>
                                <div className="flex items-center justify-center p-3 bg-background/50 rounded-lg">
                                    <span className="text-foreground font-medium">Healthcare Tech</span>
                                </div>
                                <div className="flex items-center justify-center p-3 bg-background/50 rounded-lg">
                                    <span className="text-foreground font-medium">Sustainable Dev</span>
                                </div>
                                <div className="flex items-center justify-center p-3 bg-background/50 rounded-lg">
                                    <span className="text-foreground font-medium">FinTech</span>
                                </div>
                                <div className="flex items-center justify-center p-3 bg-background/50 rounded-lg">
                                    <span className="text-foreground font-medium">EdTech</span>
                                </div>
                                <div className="flex items-center justify-center p-3 bg-background/50 rounded-lg">
                                    <span className="text-foreground font-medium">IoT & Smart Devices</span>
                                </div>
                                <div className="flex items-center justify-center p-3 bg-background/50 rounded-lg">
                                    <span className="text-foreground font-medium">Open Innovation</span>
                                </div>
                            </div>
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
                            <strong>Objective:</strong> Build innovative tech solutions for societal challenges. Open to engineering students nationwide.
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
                        {/* <div className="p-2 bg-primary/10 rounded-xl">
                            <Users className="h-6 w-6 text-primary" />
                        </div> */}
                        <h2 className="text-3xl font-bold text-foreground">Team Registration</h2>
                    </div>
                    <p className="text-muted-foreground">
                        Enter the Team Lead details and add team members. Minimum 4 members total (including team lead), maximum 6 members total.
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

                {/* Team Name Section */}
                <fieldset className="mb-8">
                    <legend className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Team Information
                    </legend>
                    <div className="p-6 bg-background/50 rounded-xl border border-border/50">
                        <div className="flex flex-col gap-2 max-w-md">
                            <label htmlFor="teamName" className="text-sm font-medium text-foreground">
                                Team Name *
                            </label>
                            <input
                                id="teamName"
                                type="text"
                                required
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                placeholder="Enter your team name"
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="mb-10">
                    <legend className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Team Lead
                    </legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-background/50 rounded-xl border border-border/50">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="leadName" className="text-sm font-medium text-foreground">
                                Team Lead Name *
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
                                Team Lead Email ID *
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
                                Team Lead Mobile No *
                            </label>
                            <input
                                id="leadPhone"
                                type="tel"
                                required
                                pattern="^[0-9+\-\s()]{7,}$"
                                value={lead.phone}
                                onChange={(e) => setLead((p) => ({ ...p, phone: e.target.value }))}
                                className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                placeholder="+1 555 555 1234"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="leadCollege" className="text-sm font-medium text-foreground">
                                College Name *
                            </label>
                            <input
                                id="leadCollege"
                                type="text"
                                required
                                value={lead.collegeName}
                                onChange={(e) => setLead((p) => ({ ...p, collegeName: e.target.value }))}
                                className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                placeholder="SRKR Engineering College"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="leadDepartment" className="text-sm font-medium text-foreground">
                                Department *
                            </label>
                            <Select
                                id="leadDepartment"
                                required
                                value={lead.department}
                                onChange={(e) => setLead((p) => ({ ...p, department: e.target.value }))}
                                placeholder="Select department"
                                options={[
                                    { value: "CSE", label: "Computer Science & Engineering" },
                                    { value: "IT", label: "Information Technology" },
                                    { value: "ECE", label: "Electronics & Communication Engineering" },
                                    { value: "EEE", label: "Electrical & Electronics Engineering" },
                                    { value: "MECH", label: "Mechanical Engineering" },
                                    { value: "CIVIL", label: "Civil Engineering" },
                                    { value: "CHEM", label: "Chemical Engineering" },
                                    { value: "BIO", label: "Biotechnology" },
                                    { value: "OTHER", label: "Other" }
                                ]}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="leadYear" className="text-sm font-medium text-foreground">
                                Year of Study
                            </label>
                            <Select
                                id="leadYear"
                                value={lead.yearOfStudy}
                                onChange={(e) => setLead((p) => ({ ...p, yearOfStudy: parseInt(e.target.value) || 0 }))}
                                placeholder="Select year"
                                options={[
                                    { value: 1, label: "1st Year" },
                                    { value: 2, label: "2nd Year" },
                                    { value: 3, label: "3rd Year" },
                                    { value: 4, label: "4th Year" }
                                ]}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="leadLocation" className="text-sm font-medium text-foreground">
                                Location
                            </label>
                            <input
                                id="leadLocation"
                                type="text"
                                value={lead.location}
                                onChange={(e) => setLead((p) => ({ ...p, location: e.target.value }))}
                                className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                placeholder="Bhimavaram, Andhra Pradesh"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="leadTShirtSize" className="text-sm font-medium text-foreground">
                                T-Shirt Size *
                            </label>
                            <Select
                                id="leadTShirtSize"
                                required
                                value={lead.tShirtSize}
                                onChange={(e) => setLead((p) => ({ ...p, tShirtSize: e.target.value }))}
                                placeholder="Select size"
                                options={[
                                    { value: "XS", label: "XS" },
                                    { value: "S", label: "S" },
                                    { value: "M", label: "M" },
                                    { value: "L", label: "L" },
                                    { value: "XL", label: "XL" },
                                    { value: "XXL", label: "XXL" },
                                    { value: "XXXL", label: "XXXL" }
                                ]}
                            />
                        </div>
                    </div>
                </fieldset>

                <div className="space-y-6">
                    {members.map((m, i) => (
                        <fieldset key={i} className="border border-border/50 rounded-xl p-6 bg-background/30">
                            <div className="flex justify-between items-center mb-4">
                                <legend className="text-sm font-medium px-3 text-muted-foreground">Team Member {i + 1}</legend>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        onClick={() => copyTeamLeadDetails(i)}
                                        variant="outline"
                                        className="h-8 px-3 text-xs text-primary hover:text-primary hover:bg-primary/10 border-primary/30 disabled:opacity-50"
                                        title="Copy Team Lead's college, department, year, and location"
                                        disabled={!lead.collegeName || !lead.department}
                                    >
                                        Same as Team Lead
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => removeMember(i)}
                                        variant="outline"
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            {(lead.collegeName || lead.department) && (
                                <div className="mb-4 p-3 bg-blue-50/50 rounded-lg border border-blue-200/50">
                                    <p className="text-xs text-blue-700 flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3" />
                                        Use "Same as Team Lead" to copy: College, Department, Year & Location
                                    </p>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor={`m${i}-name`} className="text-sm font-medium text-foreground">
                                        Name *
                                    </label>
                                    <input
                                        id={`m${i}-name`}
                                        type="text"
                                        required
                                        value={m.name}
                                        onChange={(e) => onMemberChange(i, "name", e.target.value)}
                                        className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                        placeholder="Full name"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor={`m${i}-email`} className="text-sm font-medium text-foreground">
                                        Email ID *
                                    </label>
                                    <input
                                        id={`m${i}-email`}
                                        type="email"
                                        required
                                        value={m.email}
                                        onChange={(e) => onMemberChange(i, "email", e.target.value)}
                                        className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                        placeholder="user@example.com"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor={`m${i}-phone`} className="text-sm font-medium text-foreground">
                                        Mobile No *
                                    </label>
                                    <input
                                        id={`m${i}-phone`}
                                        type="tel"
                                        pattern="^[0-9+\-\s()]{7,}$"
                                        required
                                        value={m.phone}
                                        onChange={(e) => onMemberChange(i, "phone", e.target.value)}
                                        className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                        placeholder="+1 555 123 4567"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor={`m${i}-college`} className="text-sm font-medium text-foreground">
                                        College Name *
                                    </label>
                                    <input
                                        id={`m${i}-college`}
                                        type="text"
                                        required
                                        value={m.collegeName}
                                        onChange={(e) => onMemberChange(i, "collegeName", e.target.value)}
                                        className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                        placeholder="SRKR Engineering College"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor={`m${i}-department`} className="text-sm font-medium text-foreground">
                                        Department *
                                    </label>
                                    <Select
                                        id={`m${i}-department`}
                                        required
                                        value={m.department}
                                        onChange={(e) => onMemberChange(i, "department", e.target.value)}
                                        placeholder="Select department"
                                        options={[
                                            { value: "CSE", label: "Computer Science & Engineering" },
                                            { value: "IT", label: "Information Technology" },
                                            { value: "ECE", label: "Electronics & Communication Engineering" },
                                            { value: "EEE", label: "Electrical & Electronics Engineering" },
                                            { value: "MECH", label: "Mechanical Engineering" },
                                            { value: "CIVIL", label: "Civil Engineering" },
                                            { value: "CHEM", label: "Chemical Engineering" },
                                            { value: "BIO", label: "Biotechnology" },
                                            { value: "OTHER", label: "Other" }
                                        ]}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor={`m${i}-year`} className="text-sm font-medium text-foreground">
                                        Year of Study
                                    </label>
                                    <Select
                                        id={`m${i}-year`}
                                        value={m.yearOfStudy}
                                        onChange={(e) => onMemberChange(i, "yearOfStudy", parseInt(e.target.value) || 0)}
                                        placeholder="Select year"
                                        options={[
                                            { value: 1, label: "1st Year" },
                                            { value: 2, label: "2nd Year" },
                                            { value: 3, label: "3rd Year" },
                                            { value: 4, label: "4th Year" }
                                        ]}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor={`m${i}-location`} className="text-sm font-medium text-foreground">
                                        Location
                                    </label>
                                    <input
                                        id={`m${i}-location`}
                                        type="text"
                                        value={m.location}
                                        onChange={(e) => onMemberChange(i, "location", e.target.value)}
                                        className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                        placeholder="Bhimavaram, Andhra Pradesh"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor={`m${i}-tShirtSize`} className="text-sm font-medium text-foreground">
                                        T-Shirt Size *
                                    </label>
                                    <Select
                                        id={`m${i}-tShirtSize`}
                                        required
                                        value={m.tShirtSize}
                                        onChange={(e) => onMemberChange(i, "tShirtSize", e.target.value)}
                                        placeholder="Select size"
                                        options={[
                                            { value: "XS", label: "XS" },
                                            { value: "S", label: "S" },
                                            { value: "M", label: "M" },
                                            { value: "L", label: "L" },
                                            { value: "XL", label: "XL" },
                                            { value: "XXL", label: "XXL" },
                                            { value: "XXXL", label: "XXXL" }
                                        ]}
                                    />
                                </div>
                            </div>
                        </fieldset>
                    ))}

                    {members.length < 5 && (
                        <div className="flex justify-center">
                            <Button
                                type="button"
                                onClick={addMember}
                                variant="outline"
                                className="h-11 px-6 border-dashed border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 text-primary flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Team Member
                            </Button>
                        </div>
                    )}

                    {members.length >= 3 && (
                        <div className="text-center">
                            <p className="text-sm text-green-600 font-medium">
                                ✅ {members.length + 1} members total.
                                {members.length >= 3 && members.length < 5 && " You can add more members or proceed to the next step."}
                                {members.length === 5 && " Maximum team size reached."}
                            </p>
                        </div>
                    )}
                </div>

                {/* Problem Statement Section */}
                <fieldset className="mt-10">
                    <legend className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Problem Statement Selection
                    </legend>
                    <div className="space-y-6 p-6 bg-background/50 rounded-xl border border-border/50">
                        {/* Problem Statement Dropdown */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="problemStatementSelect" className="text-sm font-medium text-foreground">
                                Select Problem Statement *
                            </label>
                            {loadingProblemStatements ? (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                    Loading problem statements...
                                </div>
                            ) : (
                                <Select
                                    id="problemStatementSelect"
                                    value={selectedProblemStatementId}
                                    onChange={(e) => handleProblemStatementSelect(e.target.value)}
                                    placeholder="Choose a problem statement"
                                    options={[
                                        ...availableProblemStatements.map((ps) => ({
                                            value: ps.psId,
                                            label: `${ps.psId} - ${ps.title}`
                                        })),
                                        { value: "custom", label: "Create Custom Problem Statement" }
                                    ]}
                                />
                            )}
                        </div>

                        {/* Selected Problem Statement Display */}
                        {selectedProblemStatementId && !showCustomProblemStatement && (
                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                                <h4 className="font-semibold text-primary mb-2">Selected Problem Statement</h4>
                                <div className="space-y-2 text-sm">
                                    {problemStatement.psId && <p><strong>ID:</strong> {problemStatement.psId}</p>}
                                    <p><strong>Title:</strong> {problemStatement.title}</p>
                                    <p><strong>Category:</strong> {problemStatement.category}</p>
                                    <p><strong>Description:</strong> {problemStatement.description}</p>
                                    {problemStatement.tags.length > 0 && (
                                        <div className="flex gap-2 flex-wrap mt-2">
                                            {problemStatement.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Custom Problem Statement Form */}
                        {showCustomProblemStatement && (
                            <div className="space-y-4 p-4 bg-amber-50/50 rounded-xl border border-amber-200/50">
                                <h4 className="font-semibold text-amber-800 mb-4">Create Custom Problem Statement</h4>
                                
                                {/* Title */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="customProblemTitle" className="text-sm font-medium text-foreground">
                                        Problem Title *
                                    </label>
                                    <input
                                        id="customProblemTitle"
                                        type="text"
                                        required
                                        value={problemStatement.title}
                                        onChange={(e) => setProblemStatement(prev => ({ ...prev, title: e.target.value }))}
                                        className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                        placeholder="e.g., Smart Traffic Management System"
                                    />
                                </div>

                                {/* Category */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="customProblemCategory" className="text-sm font-medium text-foreground">
                                        Category *
                                    </label>
                                    <Select
                                        id="customProblemCategory"
                                        value={problemStatement.category}
                                        onChange={(e) => setProblemStatement(prev => ({ ...prev, category: e.target.value }))}
                                        placeholder="Select a category"
                                        options={[
                                            { value: "healthcare", label: "Healthcare" },
                                            { value: "education", label: "Education" },
                                            { value: "environment", label: "Environment" },
                                            { value: "transportation", label: "Transportation" },
                                            { value: "agriculture", label: "Agriculture" },
                                            { value: "finance", label: "Finance" },
                                            { value: "social", label: "Social Impact" },
                                            { value: "technology", label: "Technology" },
                                            { value: "other", label: "Other" }
                                        ]}
                                    />
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="customProblemDescription" className="text-sm font-medium text-foreground">
                                        Problem Description *
                                    </label>
                                    <textarea
                                        id="customProblemDescription"
                                        required
                                        rows={6}
                                        value={problemStatement.description}
                                        onChange={(e) => setProblemStatement(prev => ({ ...prev, description: e.target.value }))}
                                        className="rounded-xl border border-border bg-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 resize-vertical"
                                        placeholder="Describe the problem you want to solve, your approach, and the expected impact..."
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </fieldset>
            </div>
        )
    }

    function renderStep4() {
        const totalMembers = members.length + 1
        const amountPerHead = 850
        const totalAmount = totalMembers * amountPerHead

        return (
            <div className="bg-card/80 border border-border/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-2">Complete Payment</h2>
                    <p className="text-muted-foreground">
                        Finalize your registration with a secure payment of ₹{amountPerHead} per member
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

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {/* Payment Details */}
                    <div className="space-y-6">
                        <div className="bg-background/50 rounded-2xl p-6 border border-border/50">
                            <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Details
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                                    <span className="text-sm text-muted-foreground">Team Members:</span>
                                    <span className="font-medium">{totalMembers}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                                    <span className="text-sm text-muted-foreground">Amount per Member:</span>
                                    <span className="font-medium">₹{amountPerHead}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                                    <span className="text-sm font-medium text-foreground">Total Amount:</span>
                                    <span className="text-lg font-bold text-primary">₹{totalAmount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-background/50 rounded-2xl p-6 border border-border/50">
                            <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                Payment Information
                            </h3>
                            
                            <div className="space-y-3 text-sm text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>UPI ID:</span>
                                    <span className="font-mono text-foreground">hackoverflow@upi</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Account:</span>
                                    <span className="text-foreground">HackOverflow Registration</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="bg-background/50 rounded-2xl p-6 border border-border/50 text-center">
                        <h3 className="text-lg font-semibold mb-4 text-primary">Scan to Pay</h3>
                        <div className="w-48 h-48 bg-muted rounded-2xl mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-border">
                            <span className="text-muted-foreground text-sm">QR Code Placeholder</span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">
                            Scan this QR code to pay ₹{totalAmount}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Use any UPI app (Google Pay, PhonePe, Paytm, etc.)
                        </p>
                    </div>
                </div>

                {/* Payment Verification Form */}
                <div className="bg-background/50 rounded-2xl p-6 border border-border/50 mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Payment Verification
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Payment Screenshot */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="paymentScreenshot" className="text-sm font-medium text-foreground">
                                Payment Screenshot *
                            </label>
                            <input
                                id="paymentScreenshot"
                                type="file"
                                accept="image/*"
                                required
                                onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
                                className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-primary/10 file:text-primary"
                            />
                            <p className="text-xs text-muted-foreground">
                                Upload screenshot of successful payment
                            </p>
                        </div>

                        {/* UPI Reference ID */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="upiReferenceId" className="text-sm font-medium text-foreground">
                                UPI Reference ID *
                            </label>
                            <input
                                id="upiReferenceId"
                                type="text"
                                required
                                value={upiReferenceId}
                                onChange={(e) => setUpiReferenceId(e.target.value)}
                                className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                placeholder="e.g., 123456789012"
                            />
                            <p className="text-xs text-muted-foreground">
                                Reference number from UPI app
                            </p>
                        </div>

                        {/* Transaction ID */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="transactionId" className="text-sm font-medium text-foreground">
                                Transaction ID *
                            </label>
                            <input
                                id="transactionId"
                                type="text"
                                required
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                placeholder="e.g., TXN123456789"
                            />
                            <p className="text-xs text-muted-foreground">
                                Transaction ID from payment app
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                    <h4 className="font-semibold text-amber-800 mb-2">Important Instructions:</h4>
                    <ul className="text-amber-800 text-sm space-y-1">
                        <li>• Take a screenshot immediately after successful payment</li>
                        <li>• Keep the UPI reference ID and transaction ID handy</li>
                        <li>• Your registration will be confirmed once payment is verified</li>
                        <li>• Payment verification may take up to 24 hours</li>
                    </ul>
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={submitting || !paymentScreenshot || !upiReferenceId.trim() || !transactionId.trim()}
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
        <main className="min-h-screen pt-4 bg-background text-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 animate-gradient" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(190,18,60,0.08),transparent_50%)] opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.06),transparent_50%)] opacity-40" />

            {!isRegistrationOpen ? (
                <section className="relative z-10 max-w-4xl mx-auto px-4 py-12 text-center">
                    <div className="bg-card/80 border border-border/50 rounded-2xl p-12 shadow-2xl backdrop-blur-sm">
                        <div className="inline-flex p-6 bg-amber-100 rounded-full mb-8">
                            <Clock className="h-16 w-16 text-amber-600" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                Registration Closed
                            </span>
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto mb-8 rounded-full"></div>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                            The registration period for HACKOVERFLOW-2K25 has ended. 
                            We appreciate your interest in participating in our national-level hackathon.
                        </p>
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-8">
                            <p className="text-amber-800 font-medium">
                                Registration was open until <strong>December 13th, 2025 at 12:00 AM</strong>.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                Stay tuned for future announcements and events from SRKR Coding Club!
                            </p>
                            <Button
                                onClick={() => navigate("/", { replace: true })}
                                className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg flex items-center gap-2"
                            >
                                <Home className="h-5 w-5" />
                                Back to Home
                            </Button>
                        </div>
                    </div>
                </section>
            ) : (

            <section className="relative z-10 max-w-6xl mx-auto px-4 py-12">
                <div className="mb-12">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        {[
                            { step: 1, icon: Sparkles, label: "Welcome" },
                            { step: 2, icon: Users, label: "Team Details" },
                            { step: 3, icon: CreditCard, label: "Payment" },
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
                                {step < 3 && (
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
                            Step {currentStep} of 3:{" "}
                            <span className="font-medium text-foreground">
                                {currentStep === 1
                                    ? "Welcome"
                                    : currentStep === 2
                                        ? "Team Details"
                                        : "Payment"}
                            </span>
                        </p>
                    </div>
                </div>

                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep4()}

                {currentStep > 1 && currentStep < 3 && (
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

                {currentStep === 3 && (
                    <div className="mt-10 flex items-center justify-center gap-4">
                        <Button
                            onClick={handlePrevStep}
                            variant="outline"
                            className="px-6 py-3 bg-transparent border-border hover:bg-card rounded-xl flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Previous
                        </Button>
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

            )}

            {!showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-2xl max-w-lg w-full text-center">
                        <div className="inline-flex p-4 bg-green-100 rounded-full mb-6">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-4">Registration Successful!</h3>
                        <div className="text-muted-foreground mb-6 space-y-3">
                            <p>{registrationResponse?.message}</p>
                            {registrationResponse?.sccId && (
                                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
                                    <p className="text-sm text-primary font-semibold">
                                        Your SCC ID: <span className="font-mono text-lg">{registrationResponse.sccId}</span>
                                    </p>
                                    <p></p>
                                    {/* <p className="text-xs text-muted-foreground mt-2">
                                        Please save this ID and your password for future logins.
                                    </p> */}
                                </div>
                            )}
                        </div>
                        
                        {/* WhatsApp Group Section */}
                        <div className="bg-green-50/50 border border-green-200/50 rounded-xl p-6 mb-6">
                            <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center justify-center gap-2">
                                <MessageCircle className="h-5 w-5" />
                                Join our WhatsApp Group
                            </h4>
                            <p className="text-sm text-green-700 mb-4">
                                Stay updated with the latest announcements, important updates, and connect with other participants!
                            </p>
                            
                            {!showWhatsAppQR ? (
                                <div className="space-y-3">
                                    <Button
                                        onClick={() => window.open('https://chat.whatsapp.com/GUg1kFD0let90x7LCA3amy', '_blank')}
                                        className="w-full px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Join WhatsApp Group
                                    </Button>
                                    <Button
                                        onClick={() => setShowWhatsAppQR(true)}
                                        variant="outline"
                                        className="w-full px-4 py-2 border-green-300 text-green-700 hover:bg-green-50 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <QrCode className="h-4 w-4" />
                                        Show QR Code
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-48 h-48 bg-white border-2 border-green-300 rounded-xl mx-auto p-2 flex flex-col items-center justify-center">
                                        {/* Using QR Server API to generate QR code */}
                                        <img 
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent('https://chat.whatsapp.com/GUg1kFD0let90x7LCA3amy')}`}
                                            alt="WhatsApp Group QR Code"
                                            className="w-full h-auto rounded-lg"
                                            onError={(e) => {
                                                // Fallback if QR service fails
                                                e.currentTarget.style.display = 'none';
                                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                if (fallback) {
                                                    fallback.style.display = 'flex';
                                                }
                                            }}
                                        />
                                        <div className="hidden flex-col items-center justify-center w-full h-full">
                                            <QrCode className="h-16 w-16 text-green-600 mb-2" />
                                            <p className="text-xs text-green-700 text-center">
                                                QR Code unavailable
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-green-700 text-center">
                                        Scan this QR code with your WhatsApp camera to join the group
                                    </p>
                                    <Button
                                        onClick={() => setShowWhatsAppQR(false)}
                                        variant="outline"
                                        className="w-full px-4 py-2 border-green-300 text-green-700 hover:bg-green-50 rounded-lg font-medium transition-all duration-300"
                                    >
                                        Hide QR Code
                                    </Button>
                                    <Button
                                        onClick={() => window.open('https://chat.whatsapp.com/GUg1kFD0let90x7LCA3amy', '_blank')}
                                        className="w-full px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Or Click to Join
                                    </Button>
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={() => navigate("/", { replace: true })}
                            className="w-full px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg"
                        >
                            Back to Home
                        </Button>
                    </div>
                </div>
            )}
        </main>
    )
}
