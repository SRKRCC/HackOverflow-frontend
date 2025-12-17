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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedPS) {
        setSelectedPS(null)
      }
    }

    if (selectedPS) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
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
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fade-in">
          Problem Statements
        </h1>
        <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
          Discover innovative challenges designed to test your skills and creativity
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 justify-center mb-8">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-4xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search by ID, Title, Description, or Tags"
              className="pl-11 pr-4 py-3 border border-border rounded-xl w-full focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-card/80 backdrop-blur-md shadow-sm hover:shadow-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative min-w-[200px]">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-11 pr-10 py-3 border border-border rounded-xl w-full focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-card/80 backdrop-blur-md shadow-sm appearance-none hover:shadow-md cursor-pointer"
            >
            <option value="">All Categories</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
            </select>
          </div>
          

          <div className="relative min-w-[180px]">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "id" | "title" | "category")}
              className="pl-11 pr-10 py-3 border border-border rounded-xl w-full focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-card/80 backdrop-blur-md shadow-sm appearance-none hover:shadow-md cursor-pointer"
            >
            <option value="id">Sort by ID</option>
            <option value="title">Sort by Title</option>
            <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          {(searchQuery || categoryFilter) && (
            <button
              onClick={() => {
                setSearchQuery("")
                setCategoryFilter("")
              }}
              className="px-5 py-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl hover:from-red-500/20 hover:to-orange-500/20 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              Clear Filters
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20 rounded-xl hover:from-primary/20 hover:to-secondary/20 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 font-medium"
            title="Refresh problem statements"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

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

      {!loading && !error && filteredData.length > 0 && (
        <div className="overflow-hidden bg-card/90 backdrop-blur-md shadow-2xl rounded-2xl border border-border/50 animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gradient-to-r from-primary via-primary/90 to-secondary">
                <tr>
                  <th className="py-5 px-6 text-left text-xs font-bold text-primary-foreground uppercase tracking-wider border-r border-primary-foreground/10 last:border-r-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary-foreground/60 rounded-full"></span>
                      Problem ID
                    </div>
                  </th>
                  <th className="py-5 px-6 text-left text-xs font-bold text-primary-foreground uppercase tracking-wider border-r border-primary-foreground/10 last:border-r-0">Title</th>
                  <th className="py-5 px-6 text-left text-xs font-bold text-primary-foreground uppercase tracking-wider border-r border-primary-foreground/10 last:border-r-0">Description</th>
                  <th className="py-5 px-6 text-left text-xs font-bold text-primary-foreground uppercase tracking-wider border-r border-primary-foreground/10 last:border-r-0">Category</th>
                  <th className="py-5 px-6 text-left text-xs font-bold text-primary-foreground uppercase tracking-wider">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredData.map((ps, idx) => (
                  <tr
                    key={ps.psId}
                    onClick={() => setSelectedPS(ps)}
                    className={`group cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 hover:shadow-lg hover:scale-[1.002] ${
                      idx % 2 === 0 ? "bg-muted/30" : "bg-card/50"
                    }`}
                  >
                    <td className="py-5 px-6 border-r border-border/20 last:border-r-0">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-primary/20 p-2 to-secondary/20 rounded-lg flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                          <span className="text-xs font-bold text-primary">{ps.psId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 border-r border-border/20 last:border-r-0">
                      <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{ps.title}</div>
                    </td>
                    <td className="py-5 px-6 border-r border-border/20 last:border-r-0">
                      <p className="text-sm text-muted-foreground max-w-[300px] truncate leading-relaxed">
                        {ps.description}
                      </p>
                    </td>
                    <td className="py-5 px-6 border-r border-border/20 last:border-r-0">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-secondary/20 to-secondary/30 text-secondary border border-secondary/30">
                        {ps.category}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex gap-1.5 flex-wrap">
                        {ps.tags.slice(0, 2).map((tag, tagIdx) => (
                          <span
                            key={`${ps.psId}-tag-${tagIdx}`}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-gradient-to-r from-primary/15 to-primary/25 text-primary border border-primary/20"
                          >
                            {tag}
                          </span>
                        ))}
                        {ps.tags.length > 2 && (
                          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-muted/50 text-muted-foreground border border-border">
                            +{ps.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
            <div className="flex justify-between items-center px-6 py-4 rounded-t-2xl bg-primary text-primary-foreground">
              <div>
                <h2 className="text-xl font-bold">Problem Statement Details</h2>
                <p className="text-primary-foreground/80 text-sm">{selectedPS.psId}</p>
              </div>
              <button
                onClick={() => setSelectedPS(null)}
                className="hover:text-primary-foreground/80 transition-colors p-1 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{selectedPS.title}</h3>
                </div>

                <div>
                  <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary font-medium text-sm">
                    {selectedPS.category}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Description</h4>
                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedPS.description}
                    </p>
                  </div>
                </div>

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
          </div>
        </div>
      )}
    </div>
  )
}

export default ProblemStatements