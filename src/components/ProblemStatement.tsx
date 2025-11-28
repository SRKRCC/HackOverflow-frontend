import React, { useState, useEffect } from "react"
import { Search, X, RefreshCw, FileText, Tag } from "lucide-react"
import ApiService from "../lib/api/service"
import type { ProblemStatement } from "../lib/types"

const ProblemStatements: React.FC = () => {
  const [problemStatements, setProblemStatements] = useState<ProblemStatement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [selectedPS, setSelectedPS] = useState<ProblemStatement | null>(null)
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"id" | "title" | "category">("id")

  useEffect(() => {
    const fetchProblemStatements = async () => {
      try {
        setLoading(true)
        const data = await ApiService.public.getProblemStatements()
        setProblemStatements(data)
        
        // Extract unique categories for filter dropdown
        const categories = [...new Set(data.map(ps => ps.category).filter(Boolean))]
        setAvailableCategories(categories.sort())
      } catch (err) {
        console.error("Failed to fetch problem statements:", err)
        setError("Failed to load problem statements. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProblemStatements()
  }, [])

  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedPS) {
        setSelectedPS(null)
      }
    }

    if (selectedPS) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden" // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "auto"
    }
  }, [selectedPS])

  const filteredData = problemStatements
    .filter((ps) => {
      const matchesSearch = 
        ps.psId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ps.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ps.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ps.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = categoryFilter === "" || ps.category === categoryFilter
      
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "category":
          return a.category.localeCompare(b.category)
        case "id":
        default:
          return a.psId.localeCompare(b.psId)
      }
    })

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/50 via-muted/30 to-muted/30 px-6 lg:px-12 py-10">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-fade-in">
        PROBLEM STATEMENTS
      </h1>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 justify-center mb-8">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-4xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by ID, Title, Description, or Tags"
              className="pl-10 pr-4 py-3 border border-border rounded-lg w-full focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-card/50 backdrop-blur-sm shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative min-w-[180px]">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-10 py-3 border border-border rounded-lg w-full focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-card/50 backdrop-blur-sm shadow-sm appearance-none"
            >
            <option value="">All Categories</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
            </select>
          </div>
          
          {/* Sort By */}
          <div className="relative min-w-[150px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "id" | "title" | "category")}
              className="pl-10 pr-10 py-3 border border-border rounded-lg w-full focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-card/50 backdrop-blur-sm shadow-sm appearance-none"
            >
            <option value="id">Sort by ID</option>
            <option value="title">Sort by Title</option>
            <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Clear Filters */}
          {(searchQuery || categoryFilter) && (
            <button
              onClick={() => {
                setSearchQuery("")
                setCategoryFilter("")
              }}
              className="px-4 py-3 bg-secondary/20 text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/30 transition-colors shadow-sm"
            >
              Clear Filters
            </button>
          )}
          
          {/* Refresh Button */}
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-3 bg-primary/10 text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors shadow-sm flex items-center gap-2"
            title="Refresh problem statements"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
      
      {/* Results Count */}
      {!loading && !error && (
        <div className="text-center mb-4">
          <span className="text-sm text-muted-foreground">
            Showing {filteredData.length} of {problemStatements.length} problem statements
          </span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-primary absolute top-0 left-0"></div>
          </div>
          <span className="mt-4 text-muted-foreground font-medium">Loading problem statements...</span>
          <span className="mt-1 text-sm text-muted-foreground/70">Please wait while we fetch the latest data</span>
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
      {!loading && !error && filteredData.length > 0 && (
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
                  className={`cursor-pointer transition-all hover:bg-primary/10 hover:scale-[1.001] ${
                    idx % 2 === 0 ? "bg-muted/50" : "bg-card"
                  }`}
                >
                  <td className="py-4 px-5 text-sm font-mono">{ps.psId}</td>
                  <td className="py-4 px-5 font-medium text-sm">{ps.title}</td>
                  <td className="py-4 px-5 text-sm max-w-[250px] truncate">
                    {ps.description}
                  </td>
                  <td className="py-4 px-5 text-sm">
                    <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
                      {ps.category}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-sm">
                    <div className="flex gap-2 flex-wrap">
                      {ps.tags.slice(0, 3).map((tag, tagIdx) => (
                        <span
                          key={`${ps.psId}-tag-${tagIdx}`}
                          className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                      {ps.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                          +{ps.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Results State */}
      {!loading && !error && filteredData.length === 0 && problemStatements.length > 0 && (
        <div className="text-center py-16 bg-card/50 backdrop-blur-sm rounded-2xl border border-border">
          <div className="flex justify-center mb-4">
            <Search className="w-16 h-16 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Problem Statements Found</h3>
          <p className="text-muted-foreground mb-4">
            No problem statements match your current search criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery("")
              setCategoryFilter("")
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && problemStatements.length === 0 && (
        <div className="text-center py-16 bg-card/50 backdrop-blur-sm rounded-2xl border border-border">
          <div className="flex justify-center mb-4">
            <FileText className="w-16 h-16 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Problem Statements Available</h3>
          <p className="text-muted-foreground">
            There are currently no problem statements to display.
          </p>
        </div>
      )}

      {/* Modal Overlay */}
      {selectedPS && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPS(null)
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSelectedPS(null)
          }}
        >
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 rounded-t-2xl bg-gradient-to-r from-primary to-secondary text-primary-foreground">
              <div>
                <h2 className="text-xl font-bold">Problem Statement Details</h2>
                <p className="text-primary-foreground/80 text-sm">{selectedPS.psId}</p>
              </div>
              <button
                onClick={() => setSelectedPS(null)}
                className="hover:text-primary-foreground/80 transition-colors p-1"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{selectedPS.title}</h3>
                </div>

                {/* Category Badge */}
                <div>
                  <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary font-medium text-sm">
                    {selectedPS.category}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Description</h4>
                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedPS.description}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedPS.tags.map((tag: string, tagIdx: number) => (
                      <span
                        key={`modal-${selectedPS.psId}-tag-${tagIdx}`}
                        className="px-3 py-2 text-sm rounded-full bg-primary/20 text-primary font-medium border border-primary/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border bg-muted/30">
              <button
                onClick={() => setSelectedPS(null)}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProblemStatements