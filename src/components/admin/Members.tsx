import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ApiService } from "@/lib/api";
import { Download, Search, Filter, X, Users } from "lucide-react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

interface Member {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  profile_image?: string | null;
  department?: string | null;
  college_name: string;
  year_of_study?: number | null;
  location?: string | null;
  attendance: number;
  tShirtSize?: string | null;
  teamId?: number | null;
  team?: {
    id: number;
    title: string;
    scc_id: string;
  } | null;
}

interface FilterOptions {
  departments: string[];
  colleges: string[];
  years: number[];
  tShirtSizes: string[];
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and Filter states
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [tShirtFilter, setTShirtFilter] = useState("");
  const [teamStatusFilter, setTeamStatusFilter] = useState<string>("all");
  
  // Filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    departments: [],
    colleges: [],
    years: [],
    tShirtSizes: [],
  });
  
  // Pagination
  const [page, setPage] = useState(0);
  const rowsPerPage = 20;
  
  // Show filters panel
  const [showFilters, setShowFilters] = useState(false);

  // Load members
  const loadMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {};
      if (search) params.search = search;
      if (departmentFilter) params.department = departmentFilter;
      if (collegeFilter) params.college = collegeFilter;
      if (yearFilter) params.year = parseInt(yearFilter);
      if (tShirtFilter) params.tShirtSize = tShirtFilter;
      if (teamStatusFilter !== "all") {
        params.hasTeam = teamStatusFilter === "with-team";
      }
      
      const membersData = await ApiService.admin.getAllMembers(params);
      setMembers(membersData || []);
    } catch (err) {
      console.error("Error loading members:", err);
      setError("Failed to load members. Please try again later.");
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  // Load filter options
  const loadFilterOptions = async () => {
    try {
      const options = await ApiService.admin.getMemberFilters();
      setFilterOptions(options);
    } catch (err) {
      console.error("Error loading filter options:", err);
    }
  };

  useEffect(() => {
    loadMembers();
    loadFilterOptions();
  }, []);

  // Apply filters
  const handleApplyFilters = () => {
    setPage(0);
    loadMembers();
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearch("");
    setDepartmentFilter("");
    setCollegeFilter("");
    setYearFilter("");
    setTShirtFilter("");
    setTeamStatusFilter("all");
    setPage(0);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== undefined) {
        loadMembers();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Export to Excel
  const handleExportToExcel = () => {
    try {
      const exportData = members.map((member) => ({
        "ID": member.id,
        "Name": member.name,
        "Email": member.email,
        "Phone": member.phone_number,
        "Department": member.department || "N/A",
        "College": member.college_name,
        "Year of Study": member.year_of_study || "N/A",
        "Location": member.location || "N/A",
        "T-Shirt Size": member.tShirtSize || "N/A",
        "Team ID": member.team?.id || "N/A",
        "Team Name": member.team?.title || "N/A",
        "Team SCC ID": member.team?.scc_id || "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

      // Auto-size columns
      const maxWidth = 30;
      const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
        wch: Math.min(
          maxWidth,
          Math.max(
            key.length,
            ...exportData.map((row) => String(row[key as keyof typeof row]).length)
          )
        ),
      }));
      worksheet["!cols"] = colWidths;

      const timestamp = new Date().toISOString().split("T")[0];
      XLSX.writeFile(workbook, `members_${timestamp}.xlsx`);
      toast.success("Members exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export members");
    }
  };

  // Pagination
  const startIndex = page * rowsPerPage;
  const paginatedMembers = members.slice(startIndex, startIndex + rowsPerPage);
  const hasPrevious = page > 0;
  const hasNext = startIndex + rowsPerPage < members.length;

  const activeFiltersCount = [
    departmentFilter,
    collegeFilter,
    yearFilter,
    tShirtFilter,
    teamStatusFilter !== "all" ? teamStatusFilter : "",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 dark:from-black dark:to-black px-4 sm:px-6 py-8 sm:py-12 transition-colors duration-300">
      {/* Page Heading */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-orange-600 dark:text-orange-400 mb-4 sm:mb-0">
            <Users className="inline-block mr-2 mb-1" size={32} />
            Members Management
          </h1>
          <button
            onClick={handleExportToExcel}
            disabled={members.length === 0}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg 
            flex items-center gap-2 shadow-md transition-colors duration-200"
          >
            <Download size={18} />
            Export to Excel
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-10 pr-4 py-2 border border-orange-300 dark:border-gray-600 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-black text-gray-800 dark:text-gray-100"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 ${
                showFilters || activeFiltersCount > 0
                  ? "bg-orange-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              <Filter size={18} />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Department Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Department
                      </label>
                      <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-black text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">All Departments</option>
                        {filterOptions.departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* College Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        College
                      </label>
                      <select
                        value={collegeFilter}
                        onChange={(e) => setCollegeFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-black text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">All Colleges</option>
                        {filterOptions.colleges.map((college) => (
                          <option key={college} value={college}>
                            {college}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Year Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Year of Study
                      </label>
                      <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-black text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">All Years</option>
                        {filterOptions.years.map((year) => (
                          <option key={year} value={year}>
                            Year {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* T-Shirt Size Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        T-Shirt Size
                      </label>
                      <select
                        value={tShirtFilter}
                        onChange={(e) => setTShirtFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-black text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">All Sizes</option>
                        {filterOptions.tShirtSizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Team Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Team Status
                      </label>
                      <select
                        value={teamStatusFilter}
                        onChange={(e) => setTeamStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-black text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="all">All Members</option>
                        <option value="with-team">With Team</option>
                        <option value="without-team">Without Team</option>
                      </select>
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleApplyFilters}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={() => {
                        handleClearFilters();
                        loadMembers();
                      }}
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 
                      text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <X size={18} />
                      Clear All
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4 justify-around text-center">
            <div>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{members.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Members Table */}
        {!loading && !error && (
          <>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-orange-600 dark:bg-orange-800 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Department</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">College</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Year</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">T-Shirt</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Team</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedMembers.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          No members found
                        </td>
                      </tr>
                    ) : (
                      paginatedMembers.map((member, index) => (
                        <tr
                          key={member.id}
                          className={`${
                            index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                          } hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors duration-150`}
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                            {member.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{member.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {member.phone_number}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {member.department || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {member.college_name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {member.year_of_study || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {member.tShirtSize || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {member.team ? (
                              <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                  {member.team.title}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {member.team.scc_id}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500 italic">No team</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {members.length > rowsPerPage && (
              <div className="flex justify-between items-center mt-6 px-4">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!hasPrevious}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg 
                  transition-colors duration-200"
                >
                  Previous
                </button>
                <span className="text-gray-700 dark:text-gray-300">
                  Page {page + 1} of {Math.ceil(members.length / rowsPerPage)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg 
                  transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
