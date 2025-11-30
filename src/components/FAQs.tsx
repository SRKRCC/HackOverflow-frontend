import React, { useState } from "react"
import { ChevronDown, ChevronUp, HelpCircle, FileText, Gift, Star } from "lucide-react"

const FAQs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "What is the eligibility criteria for HackOverflow 2K25?",
      answer: "HackOverflow is open to students from engineering colleges. Teams can be formed from the same or different colleges."
    },
    {
      question: "What is the team size requirement?",
      answer: "Teams must consist of 4 to 6 members."
    },
    {
      question: "Can a participant be part of multiple teams?",
      answer: "No, participants cannot be members of multiple teams."
    },
    {
      question: "How much is the registration fee?",
      answer: "The registration fee is Rs. 850/- per head (Rs. 750/- for affiliates)."
    },
    {
      question: "What is the last date for registration?",
      answer: "All registrations must be completed by 13th December."
    },
    {
      question: "Will accommodation be provided?",
      answer: "Yes, participants from distant locations will be provided accommodation for one night, prior to the hackathon."
    },
    {
      question: "What should participants bring?",
      answer: "Participants are encouraged to bring their own laptops and accessories. A valid college ID is mandatory."
    },
    {
      question: "How will projects be evaluated?",
      answer: "Projects will be evaluated based on creativity, functionality, and impact. The jury's decisions are final."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/50 via-muted/30 to-muted/30 px-6 lg:px-12 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-fade-in">
          FREQUENTLY ASKED QUESTIONS
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Find answers to common questions about HackOverflow 2K25
        </p>
      </div>

      {/* FAQs */}
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card/80 backdrop-blur-md border border-border rounded-xl shadow-lg overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-primary/5 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <HelpCircle size={20} className="text-primary flex-shrink-0" />
                  <span className="font-medium text-foreground text-sm md:text-base">{faq.question}</span>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {openIndex === index ? (
                    <ChevronUp size={20} className="text-primary" />
                  ) : (
                    <ChevronDown size={20} className="text-muted-foreground" />
                  )}
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Innovation Journey Message */}
      <div className="text-center mt-16 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/10 animate-fade-in" style={{ animationDelay: "0.8s" }}>
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Join the Innovation Journey
          </h3>
          <p className="text-muted-foreground mb-6">
            Whether you win big or learn along the way, every participant contributes to building India's tech future.
            Network with like-minded innovators, showcase your skills, and be part of something extraordinary.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <FileText size={16} className="mr-2 text-primary" />
              <span>Certificates for All</span>
            </div>
            <div className="flex items-center">
              <Gift size={16} className="mr-2 text-primary" />
              <span>Exclusive Goodies</span>
            </div>
            <div className="flex items-center">
              <Star size={16} className="mr-2 text-primary" />
              <span>Recognition & Networking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQs