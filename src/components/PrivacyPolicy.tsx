"use client"

import { useState, useEffect } from "react"
import { Shield, Eye, Cookie, Database, Mail, Users } from "lucide-react"
import { motion } from "framer-motion"

// Loading skeleton
const LoadingSkeleton = () => (
    <div className="relative w-full min-h-screen">
        <div className="relative z-10 container mx-auto py-10 px-4">
            <div className="animate-pulse space-y-8">
                <div className="h-12 bg-gray-300 rounded-lg w-1/2 mx-auto"></div>
                <div className="space-y-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
                    ))}
                </div>
            </div>
        </div>
    </div>
)

export default function PrivacyPolicyPage() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500)
        return () => clearTimeout(timer)
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1, delayChildren: 0.2 } }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    }

    // 🔥 Updated for HackOverflow Hackathon
    const sections = [
        {
            icon: <Eye className="h-6 w-6" />,
            title: "Information We Collect",
            content: [
                "Registration Data: When you register for HackOverflow, we collect your name, email address, college name, and contact information.",
                "Team Information: If you participate as a team, we collect your teammates' names and team details.",
                "Event Participation Data: This includes project submissions, judging details, rankings, and feedback.",
                "Technical Logs: Basic data such as IP address, browser type, and device information to maintain platform stability."
            ]
        },
        {
            icon: <Database className="h-6 w-6" />,
            title: "How We Use Your Information",
            content: [
                "Event Management: To manage hackathon registrations, teams, schedules, submissions, and judging.",
                "Communication: To send event announcements, updates, reminders, and important notifications.",
                "Project & Judging: To verify projects, assess eligibility, and manage fair evaluation.",
                "Platform Optimization: To improve website performance, user experience, and event processes.",
                "Security: To detect fraud, ensure legitimate participation, and maintain a safe event environment."
            ]
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Information Sharing",
            content: [
                "Public Event Data: Participant names, teams, rankings, and winning project details may be displayed publicly on the website or social media.",
                "Judges & Volunteers: Your submission and team details may be shared with event judges for evaluation.",
                "Service Providers: We may use third-party tools for hosting, email delivery, or analytics.",
                "Legal Compliance: Information may be shared if required by law or to address harmful activities.",
                "We never sell or trade your personal information for advertising or marketing."
            ]
        },
        {
            icon: <Cookie className="h-6 w-6" />,
            title: "Cookies & Tracking",
            content: [
                "Essential Cookies: Used for authentication, session management, and platform functionality.",
                "Analytics Cookies: Used to track website usage to improve user experience.",
                "Preference Cookies: Store theme and display preferences for convenience.",
                "You may disable cookies in your browser settings, but certain features may not work correctly."
            ]
        },
        {
            icon: <Shield className="h-6 w-6" />,
            title: "Data Security",
            content: [
                "Protected Storage: Personal data is stored securely using industry-standard measures.",
                "Restricted Access: Only authorized event admins and volunteers have access to participant information.",
                "Encrypted Communication: Data transmitted through the platform uses secure HTTPS encryption.",
                "Continuous Monitoring: We actively prevent suspicious activity and unauthorized access.",
                "No system is fully immune to breaches — users are encouraged to keep account credentials safe."
            ]
        },
        {
            icon: <Database className="h-6 w-6" />,
            title: "Data Retention",
            content: [
                "Event Participation Data: Project submissions, rankings, and event details are retained for documentation and future verification.",
                "Account Information: Retained as long as your HackOverflow profile remains active.",
                "Legal Obligations: Some data may be retained longer if required by law.",
                "Deletion Requests: You may request data deletion or account removal anytime.",
                "Anonymized Data: Non-identifiable data may be used to improve future hackathons."
            ]
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Your Rights",
            content: [
                "Access: Request a copy of the data we hold about you.",
                "Correction: Update or correct your account or submission details.",
                "Deletion: Request account or data deletion after the hackathon.",
                "Data Portability: Request export of your project submission or profile data.",
                "Opt-Out: Unsubscribe from non-essential emails or announcements.",
                "To exercise these rights, email us at: srkrcodingclub@gmail.com"
            ]
        },
        {
            icon: <Mail className="h-6 w-6" />,
            title: "Contact Information",
            content: [
                "For privacy concerns, event questions, or data requests, contact us:",
                "Email: srkrcodingclub@gmail.com",
                "Organization: SRKR Coding Club, SRKR Engineering College",
                "We respond to all privacy-related inquiries within 10–30 days.",
                "For urgent matters, please include 'URGENT – Privacy Concern' in the subject line."
            ]
        }
    ]

    if (isLoading) return <LoadingSkeleton />

    return (
        <div className="relative w-full min-h-screen bg-white dark:bg-black">
            <motion.div className="relative z-10" initial="hidden" animate="visible" variants={containerVariants}>
                <div className="container mx-auto py-10 px-4 text-gray-800 max-w-4xl">

                    {/* Header */}
                    <motion.div className="text-center mb-12" variants={itemVariants}>
                        <div className="flex justify-center mb-6">
                            <div className="bg-primary/10 p-4 rounded-full">
                                <Shield className="h-12 w-12 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                                Privacy Policy
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            This Privacy Policy explains how we collect, use, and protect your information while you participate in the HackOverflow Hackathon.
                        </p>
                    </motion.div>

                    {/* Intro */}
                    <motion.div className="mb-8 p-6 rounded-xl border border-primary/10 bg-gray-100 dark:bg-gray-950 shadow" variants={itemVariants}>
                        <p className="text-gray-600 leading-relaxed">
                            Welcome to HackOverflow! We are committed to protecting your privacy and ensuring a secure, 
                            transparent experience throughout the hackathon. By participating in this event and using our platform, 
                            you agree to the practices outlined below.
                        </p>
                    </motion.div>

                    {/* Sections */}
                    <motion.div className="space-y-8" variants={containerVariants}>
                        {sections.map((section, i) => (
                            <motion.div key={i} variants={itemVariants}>
                                <div className="p-6 rounded-xl border border-primary/10 bg-gray-100 dark:bg-gray-950 shadow hover:border-primary/20 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0 text-primary">
                                            {section.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-xl font-semibold text-primary mb-4">{section.title}</h2>
                                            <ul className="space-y-3">
                                                {section.content.map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-3">
                                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                                        <span className="text-gray-600 leading-relaxed">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Updates */}
                    <motion.div className="mt-12 p-6 rounded-xl border border-primary/10 bg-gray-100 dark:bg-gray-950" variants={itemVariants}>
                        <h3 className="text-lg font-semibold text-primary mb-3">Policy Updates</h3>
                        <p className="text-gray-600 leading-relaxed">
                            We may update this Privacy Policy to reflect changes in event processes, legal requirements, or platform improvements. 
                            Participants will be notified of major updates via email or website announcements.
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
