import React, { useState } from "react"

const problemStatements = [
  {
    id: 1,
    title:
      "Smart Community Health Monitoring and Early Warning System for Water-Borne Diseases in Rural Northeast India",
    description:
      "Develop a smart health monitoring platform leveraging IoT sensors, AI-driven analytics, and early warning systems to detect, predict, and prevent water-borne diseases in rural communities of Northeast India.",
    category: "Software",
    psNumber: "SIH25001",
    tags: ["MedTech", "BioTech", "HealthTech"],
    theme: "HealthTech",
  },
  {
    id: 2,
    title:
      "Smart Tourist Safety Monitoring & Incident Response System using AI, Geo-Fencing, and Blockchain-based Digital ID",
    description:
      "Create a robust safety monitoring and incident response solution that ensures safe tourism in sensitive areas using AI surveillance, geo-fencing alerts, and blockchain-based identity verification.",
    category: "Software",
    psNumber: "SIH25002",
    tags: ["Travel", "Tourism", "Blockchain"],
    theme: "Tourism",
  },
  {
    id: 3,
    title:
      "Low-Cost smart transportation solution for Agri produce from remote farms to nearest market",
    description:
      "Design a cost-effective transport system using IoT and smart routing for efficient delivery of agricultural produce from remote villages to local marketplaces.",
    category: "Hardware",
    psNumber: "SIH25003",
    tags: ["Transportation", "Logistics", "Agriculture"],
    theme: "Agriculture",
  },
]

// Fill up to 10
while (problemStatements.length < 10) {
  const id = problemStatements.length + 1
  problemStatements.push({
    id,
    title: `Sample Problem Statement ${id} for Smart India Hackathon`,
    description:
      "This is a sample description for problem statement to demonstrate truncation of text in the description field of the table.",
    category: id % 2 === 0 ? "Software" : "Hardware",
    psNumber: `SIH25${id.toString().padStart(3, "0")}`,
    tags: id % 2 === 0 ? ["Innovation", "Tech"] : ["Sustainability"],
    theme: id % 2 === 0 ? "Innovation" : "Environment",
  })
}

const ProblemStatements: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter] = useState("")
  const [themeFilter] = useState("")
  const [selectedPS, setSelectedPS] = useState<any>(null)

  const filteredData = problemStatements.filter((ps) => {
    return (
      (ps.psNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ps.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (categoryFilter === "" || ps.category === categoryFilter) &&
      (themeFilter === "" || ps.theme === themeFilter)
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/50 via-muted/30 to-muted/30 px-6 lg:px-12 py-10">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-fade-in">
        PROBLEM STATEMENTS
      </h1>

      {/* Search*/}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <input
          type="text"
          placeholder="🔍 Search by ID or Title"
          className="px-4 py-2 border border-border rounded-lg w-full sm:w-1/3 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-card/50 backdrop-blur-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto bg-card/80 backdrop-blur-md shadow-xl rounded-2xl border border-border animate-fade-in">
        <table className="w-full min-w-[600px] border-collapse">
          <thead className="sticky top-0 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <tr className="uppercase tracking-wide text-left text-sm">
              <th className="py-4 px-5 rounded-tl-2xl">ID</th>
              <th className="py-4 px-5">Title</th>
              <th className="py-4 px-5">Description</th>
              <th className="py-4 px-5">Category</th>
              <th className="py-4 px-5 rounded-tr-2xl">Tags</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.slice(0, 10).map((ps, idx) => (
              <tr
                key={ps.id}
                onClick={() => setSelectedPS(ps)}
                className={`cursor-pointer transition-all hover:bg-primary/10 ${
                  idx % 2 === 0 ? "bg-muted/50" : "bg-card"
                }`}
              >
                <td className="py-3 px-5 text-sm">{ps.psNumber}</td>
                <td className="py-3 px-5 font-medium text-sm">{ps.title}</td>
                <td className="py-3 px-5 text-sm max-w-[250px] truncate">
                  {ps.description}
                </td>
                <td className="py-3 px-5 text-sm">{ps.category}</td>
                <td className="py-3 px-5 text-sm">
                  <div className="flex gap-2 flex-wrap">
                    {ps.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Subpage */}
      {selectedPS && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-card rounded-2xl border border-border shadow-xl w-11/12 md:w-2/3 lg:w-1/2 animate-fade-in">
            {/* Heading */}
            <div className="flex justify-between items-center px-4 py-3 rounded-t-2xl bg-gradient-to-r from-primary to-secondary text-white">
              <h2 className="text-lg font-bold">Problem Statement Details</h2>
              <button
                onClick={() => setSelectedPS(null)}
                className="text-xl font-bold hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Details Table */}
            <div className="p-4">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  <tr>
                    <td className="px-4 py-2 font-semibold">ID</td>
                    <td className="px-4 py-2">{selectedPS.psNumber}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Title</td>
                    <td className="px-4 py-2">{selectedPS.title}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Description</td>
                    <td className="px-4 py-2">{selectedPS.description}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Category</td>
                    <td className="px-4 py-2">{selectedPS.category}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Theme</td>
                    <td className="px-4 py-2">{selectedPS.theme}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Tags</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2 flex-wrap">
                        {selectedPS.tags.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProblemStatements