"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    FileText,
    User,
    Shield,
    AlertTriangle,
    Scale,
    Gavel,
    Mail
} from "lucide-react"

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

export default function TermsAndConditionsPage() {
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

    const sections = [
        {
            icon: <FileText className="h-6 w-6" />,
            title: "Acceptance of Terms",
            content: [
                "By accessing and using the HackOverflow platform, you accept and agree to be bound by these Terms and Conditions.",
                "If you do not agree to these terms, you must not use our platform or services.",
                "These terms apply to all users, including participants, judges, volunteers, and administrators.",
                "Your use of the platform constitutes acceptance of any updates to these terms.",
                "We reserve the right to refuse service to anyone who violates these terms."
            ]
        },
        {
            icon: <User className="h-6 w-6" />,
            title: "User Responsibilities",
            content: [
                "Account Security: You are responsible for maintaining the confidentiality of your login credentials.",
                "Accurate Information: You must provide correct and updated information during registration.",
                "Appropriate Use: The platform must be used only for lawful and event-related purposes.",
                "Respectful Behavior: Participants must maintain respectful conduct toward other users.",
                "Hackathon Integrity: Participants must complete tasks honestly without cheating or using unauthorized tools.",
                "Submission Responsibility: You are responsible for all content you upload or submit."
            ]
        },
        {
            icon: <Shield className="h-6 w-6" />,
            title: "Platform Usage Rules",
            content: [
                "No Cheating: Unauthorized scripts, bots, or automated tools are strictly prohibited.",
                "No Account Sharing: Every participant must use their own account.",
                "No Spam: You must not send unsolicited messages or spam others.",
                "No Malicious Activity: Hacking, exploiting bugs, or damaging platform systems is forbidden.",
                "Content Compliance: All submissions must meet event guidelines and be respectful.",
                "Fair Participation: All participants must follow the hackathon's fair play rules."
            ]
        },
        {
            icon: <Scale className="h-6 w-6" />,
            title: "Intellectual Property",
            content: [
                "Event Content: All platform content, including design and structure, is owned by SRKR Coding Club.",
                "Project Ownership: Participants retain ownership of their submissions.",
                "Usage License: By submitting a project, you grant us permission to display it for evaluation and event purposes.",
                "Third-Party Rights: You must not violate the intellectual property rights of any third parties.",
                "Non-Commercial Use: Platform content may not be redistributed or used commercially."
            ]
        },
        {
            icon: <AlertTriangle className="h-6 w-6" />,
            title: "Account Termination",
            content: [
                "Violation of any rules may result in account suspension or removal from the hackathon.",
                "Severe violations may result in immediate termination without notice.",
                "Participants may appeal termination decisions by contacting the organizing team.",
                "Terminated accounts may retain data as stated in our Privacy Policy.",
                "Users may request voluntary account deletion at any time."
            ]
        },
        {
            icon: <Shield className="h-6 w-6" />,
            title: "Privacy and Data Protection",
            content: [
                "We collect and process user data as described in our Privacy Policy.",
                "By using our platform, you consent to our data handling practices.",
                "We implement standard security measures to protect user data.",
                "Certain data may be shared with judges or event organizers.",
                "Users have rights to access, update, or delete their data."
            ]
        },
        {
            icon: <Gavel className="h-6 w-6" />,
            title: "Limitation of Liability",
            content: [
                "We do not guarantee uninterrupted or error-free platform access.",
                "We are not responsible for loss of data, delays, or technical issues.",
                "We are not liable for user actions or content submitted by participants.",
                "Third-party integrations may have their own policies and limitations.",
                "Liability is limited to the maximum extent permitted by law."
            ]
        },
        {
            icon: <FileText className="h-6 w-6" />,
            title: "Modifications and Updates",
            content: [
                "We may update these Terms & Conditions to comply with event or legal requirements.",
                "Users will be notified in case of major updates.",
                "Continued use of the platform signifies acceptance of updated terms.",
                "All changes will include updated effective dates for transparency."
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
                                <FileText className="h-12 w-12 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                                Terms & Conditions
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Please read these Terms & Conditions carefully before participating in the HackOverflow Hackathon.
                        </p>
                    </motion.div>

                    {/* Intro */}
                    <motion.div className="mb-8 p-6 rounded-xl border border-primary/10 bg-gray-100 dark:bg-gray-950 shadow" variants={itemVariants}>
                        <p className="text-gray-600 leading-relaxed">
                            These Terms & Conditions govern your participation in the HackOverflow Hackathon. By registering or using the platform, you agree to follow all rules, policies, and legal guidelines outlined below.
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

                    {/* Governing Law */}
                    <motion.div className="mt-12 p-6 rounded-xl border border-primary/10 bg-gray-100 dark:bg-gray-950" variants={itemVariants}>
                        <h3 className="text-lg font-semibold text-primary mb-3">Governing Law</h3>
                        <p className="text-gray-600 leading-relaxed">
                            These terms are governed by the laws of India. All disputes will fall under the jurisdiction of Andhra Pradesh courts.
                        </p>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div className="mt-6 p-6 rounded-xl border border-primary/10 bg-gray-100 dark:bg-gray-950" variants={itemVariants}>
                        <h3 className="text-lg font-semibold text-primary mb-3">Contact Information</h3>
                        <p className="text-gray-600 leading-relaxed">
                            For questions or concerns regarding these Terms & Conditions, contact us at:<br /><br />
                            <strong>Email:</strong> srkrcodingclub@gmail.com<br />
                            <strong>Organization:</strong> SRKR Coding Club, SRKR Engineering College
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
