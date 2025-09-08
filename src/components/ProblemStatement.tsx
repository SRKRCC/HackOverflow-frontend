import React, { useState } from "react"
import Button from "@/components/ui/button"

const problemStatements = [
  {
    id: 1,
    organization: "Ministry of Development of North Eastern Region",
    title:
      "Smart Community Health Monitoring and Early Warning System for Water-Borne Diseases in Rural Northeast India",
    category: "Software",
    psNumber: "SIH25001",
    theme: "MedTech / BioTech / HealthTech",
  },
  {
    id: 2,
    organization: "Ministry of Development of North Eastern Region",
    title:
      "Smart Tourist Safety Monitoring & Incident Response System using AI, Geo-Fencing, and Blockchain-based Digital ID",
    category: "Software",
    psNumber: "SIH25002",
    theme: "Travel & Tourism",
  },
  {
    id: 3,
    organization: "Ministry of Development of North Eastern Region",
    title:
      "Low-Cost smart transportation solution for Agri produce from remote farms to nearest market",
    category: "Hardware",
    psNumber: "SIH25003",
    theme: "Transportation & Logistics",
  },
]

// Generate dummy data up to 50
while (problemStatements.length < 50) {
  const id = problemStatements.length + 1
  problemStatements.push({
    id,
    organization: "Sample Organization",
    title: `Sample Problem Statement ${id} for Smart India Hackathon`,
    category: id % 2 === 0 ? "Software" : "Hardware",
    psNumber: `SIH25${id.toString().padStart(3, "0")}`,
    theme: id % 2 === 0 ? "Innovation & Tech" : "Sustainability",
  })
}

const ITEMS_PER_PAGE = 10

const ProblemStatements: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [themeFilter, setThemeFilter] = useState("")

  const filteredData = problemStatements.filter((ps) => {
    return (
      (ps.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ps.organization.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (categoryFilter ? ps.category === categoryFilter : true) &&
      (themeFilter ? ps.theme === themeFilter : true)
    )
  })

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const currentItems = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const uniqueCategories = Array.from(
    new Set(problemStatements.map((ps) => ps.category))
  )
  const uniqueThemes = Array.from(new Set(problemStatements.map((ps) => ps.theme)))

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/50 via-muted/30 to-muted/30 px-6 lg:px-12 py-10 pt-24">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-fade-in">
        PROBLEM STATEMENTS
      </h1>

      {/* Total Count */}
      <div className="flex justify-center mb-8">
        <div className="bg-card/80 backdrop-blur-md px-8 py-6 rounded-2xl shadow-lg text-center border border-border">
          <p className="text-muted-foreground text-lg">TOTAL STATEMENTS</p>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {problemStatements.length}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Search by title or organization"
          className="px-4 py-2 border border-border rounded-lg w-full sm:w-1/3 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-card/50 backdrop-blur-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-border rounded-lg w-full sm:w-auto focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-card/50 backdrop-blur-sm"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          className="px-4 py-2 border border-border rounded-lg w-full sm:w-auto focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-card/50 backdrop-blur-sm"
          value={themeFilter}
          onChange={(e) => setThemeFilter(e.target.value)}
        >
          <option value="">All Themes</option>
          {uniqueThemes.map((theme, idx) => (
            <option key={idx} value={theme}>
              {theme}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-card/80 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-border animate-fade-in">
        <table className="w-full min-w-[600px] border-collapse">
          <thead className="sticky top-0 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <tr className="uppercase tracking-wide text-left text-sm">
              <th className="py-3 px-5 rounded-tl-2xl">S.No</th>
              <th className="py-3 px-5">Organization</th>
              <th className="py-3 px-5">Problem Statement</th>
              <th className="py-3 px-5">Category</th>
              <th className="py-3 px-5">PS Number</th>
              <th className="py-3 px-5 rounded-tr-2xl">Theme</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((ps, idx) => (
              <tr
                key={ps.id}
                className={`transition-all hover:bg-primary/10 ${
                  idx % 2 === 0 ? "bg-muted/50" : "bg-card"
                }`}
              >
                <td className="py-3 px-5 text-sm">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                <td className="py-3 px-5 font-medium text-sm">{ps.organization}</td>
                <td className="py-3 px-5 text-sm">{ps.title}</td>
                <td className="py-3 px-5 text-sm">{ps.category}</td>
                <td className="py-3 px-5 text-sm">{ps.psNumber}</td>
                <td className="py-3 px-5 text-sm">{ps.theme}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-2 flex-wrap">
        <Button
          variant="outline"
          className="hover:scale-105 transition-all border-primary text-primary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </Button>
        {[...Array(totalPages)].map((_, idx) => (
          <Button
            key={idx}
            className={`hover:scale-105 transition-all ${
              currentPage === idx + 1
                ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          className="hover:scale-105 transition-all border-primary text-primary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default ProblemStatements