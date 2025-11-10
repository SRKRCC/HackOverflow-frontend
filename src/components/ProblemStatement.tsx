import React, { useState, useEffect } from "react"
import ApiService from "../lib/api/service"
import type { ProblemStatement } from "../lib/types"

const ProblemStatements: React.FC = () => {
  const [problemStatements, setProblemStatements] = useState<ProblemStatement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter] = useState("")
  const [selectedPS, setSelectedPS] = useState<ProblemStatement | null>(null)

  useEffect(() => {
    const fetchProblemStatements = async () => {
      try {
        setLoading(true)
        const data = await ApiService.public.getProblemStatements()
        setProblemStatements(data)
      } catch (err) {
        console.error("Failed to fetch problem statements:", err)
        setError("Failed to load problem statements. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProblemStatements()
  }, [])

  const filteredData = problemStatements.filter((ps) => {
    return (
      (ps.psId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ps.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (categoryFilter === "" || ps.category === categoryFilter)
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

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading problem statements...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-20">
          <div className="text-red-500 mb-4">⚠️ {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Main Table */}
      {!loading && !error && (
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
              {filteredData.map((ps, idx) => (
                <tr
                  key={ps.psId}
                  onClick={() => setSelectedPS(ps)}
                  className={`cursor-pointer transition-all hover:bg-primary/10 ${
                    idx % 2 === 0 ? "bg-muted/50" : "bg-card"
                  }`}
                >
                  <td className="py-3 px-5 text-sm">{ps.psId}</td>
                  <td className="py-3 px-5 font-medium text-sm">{ps.title}</td>
                  <td className="py-3 px-5 text-sm max-w-[250px] truncate">
                    {ps.description}
                  </td>
                  <td className="py-3 px-5 text-sm">{ps.category}</td>
                  <td className="py-3 px-5 text-sm">
                    <div className="flex gap-2 flex-wrap">
                      {ps.tags.map((tag, tagIdx) => (
                        <span
                          key={`${ps.psId}-tag-${tagIdx}`}
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
      )}

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
                    <td className="px-4 py-2">{selectedPS.psId}</td>
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
                    <td className="px-4 py-2 font-semibold">Tags</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2 flex-wrap">
                        {selectedPS.tags.map((tag: string, tagIdx: number) => (
                          <span
                            key={`${selectedPS.psId}-tag-${tagIdx}`}
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