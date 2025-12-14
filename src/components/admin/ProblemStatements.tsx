import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Download,
  AlertCircle,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { ApiService } from '@/lib/api';

interface ProblemStatement {
  psId: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  teamCount?: number;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  tags: string;
}

const FormModal = ({
  isEdit = false,
  onSubmit,
  onClose,
  formData,
  handleInputChange,
  categories,
}: {
  isEdit?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  categories: string[];
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-orange-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEdit ? 'Edit Problem Statement' : 'Create New Problem Statement'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
            placeholder="Enter problem statement title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
            placeholder="Enter detailed problem description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags * (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
            placeholder="e.g., React, JavaScript, Frontend"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Separate tags with commas
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {isEdit ? 'Update' : 'Create'} Problem Statement
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  </motion.div>
);

const ProblemStatements = () => {
  const [problemStatements, setProblemStatements] = useState<ProblemStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingStatement, setEditingStatement] = useState<ProblemStatement | null>(null);
  const [showCsvUpload, setShowCsvUpload] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingStatement, setViewingStatement] = useState<ProblemStatement | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'psId' | 'title' | 'teamCount'>('psId');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    tags: '',
  });

  const categories = [
    'AI & Machine Learning',
    'Web3 & Blockchain',
    'Healthcare Technology',
    'Sustainable Development',
    'FinTech Innovation',
    'Education Technology',
    'IoT & Smart Devices',
    'Open Innovation'
  ];

  useEffect(() => {
    fetchProblemStatements();
  }, []);

  const fetchProblemStatements = async () => {
    try {
      setLoading(true);
      const response = await ApiService.admin.problemStatements.getAll();
      setProblemStatements(response.data || []);
    } catch (error: any) {
      showNotification('error', 'Failed to fetch problem statements');
      console.error('Error fetching problem statements:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      tags: '',
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await ApiService.admin.problemStatements.create({
        ...formData,
        tags,
      });

      showNotification('success', 'Problem statement created successfully');
      setShowCreateForm(false);
      resetForm();
      fetchProblemStatements();
    } catch (error: any) {
      showNotification('error', error.response?.data?.error || 'Failed to create problem statement');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStatement) return;

    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await ApiService.admin.problemStatements.update(editingStatement.psId, {
        ...formData,
        tags,
      });

      showNotification('success', 'Problem statement updated successfully');
      setShowEditForm(false);
      setEditingStatement(null);
      resetForm();
      fetchProblemStatements();
    } catch (error: any) {
      showNotification('error', error.response?.data?.error || 'Failed to update problem statement');
    }
  };

  const handleEdit = (statement: ProblemStatement) => {
    setEditingStatement(statement);
    setFormData({
      title: statement.title,
      description: statement.description,
      category: statement.category,
      tags: statement.tags.join(', '),
    });
    setShowEditForm(true);
  };

  const handleView = (statement: ProblemStatement) => {
    setViewingStatement(statement);
    setShowViewModal(true);
  };

  const handleDelete = async (psId: string) => {
    if (!window.confirm('Are you sure you want to delete this problem statement?')) {
      return;
    }

    try {
      await ApiService.admin.problemStatements.delete(psId);
      showNotification('success', 'Problem statement deleted successfully');
      fetchProblemStatements();
    } catch (error: any) {
      showNotification('error', error.response?.data?.error || 'Failed to delete problem statement');
    }
  };

  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      showNotification('error', 'Please select a CSV file');
      return;
    }

    try {
      setUploadProgress(true);
      const formData = new FormData();
      formData.append('csv-file', csvFile);

      await ApiService.admin.problemStatements.uploadCsv(formData);
      
      showNotification('success', 'CSV uploaded successfully');
      setShowCsvUpload(false);
      setCsvFile(null);
      fetchProblemStatements();
    } catch (error: any) {
      showNotification('error', error.response?.data?.error || 'Failed to upload CSV');
    } finally {
      setUploadProgress(false);
    }
  };

  const downloadSampleCsv = () => {
    const csvContent = `title,description,category,tags
Example Problem 1,This is a sample problem description for web development,Web Development,"React, JavaScript, Frontend"
Example Problem 2,This is a sample problem description for AI/ML,AI/ML,"Python, Machine Learning, Data Analysis"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'problem-statements-sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filter and search logic
  const filteredStatements = problemStatements.filter((statement) => {
    const matchesSearch = searchQuery === '' ||
      statement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      statement.psId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      statement.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || statement.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Sort logic
  const sortedStatements = [...filteredStatements].sort((a, b) => {
    let compareValue = 0;
    
    if (sortBy === 'psId') {
      compareValue = a.psId.localeCompare(b.psId);
    } else if (sortBy === 'title') {
      compareValue = a.title.localeCompare(b.title);
    } else if (sortBy === 'teamCount') {
      compareValue = (a.teamCount || 0) - (b.teamCount || 0);
    }
    
    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedStatements.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedStatements.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 dark:from-black dark:to-black px-4 sm:px-6 py-8 sm:py-12 transition-colors duration-300">
      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{notification.message}</span>
        </motion.div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-orange-600 dark:text-orange-400 mb-2">Problem Statements</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Manage hackathon problem statements
            </p>
          </div>
        
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
            </button>
            
            {/* <button
              onClick={() => setShowCsvUpload(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Upload size={20} />
              <span className="hidden sm:inline">Upload CSV</span>
              <span className="sm:hidden">CSV</span>
            </button> */}
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by PS ID, title, or description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'psId' | 'title' | 'teamCount')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
            >
              <option value="psId">Sort by PS ID</option>
              <option value="title">Sort by Title</option>
              <option value="teamCount">Sort by Team Count</option>
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white transition-all duration-200 flex items-center gap-2"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortOrder === 'asc' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
              )}
              <span className="hidden sm:inline">{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
            </button>

            {/* Clear Filters */}
            {(searchQuery || categoryFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 flex items-center gap-2"
              >
                <X size={16} />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredStatements.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedStatements.length)} of {sortedStatements.length} problem statements
            {(searchQuery || categoryFilter !== 'all') && (
              <span className="ml-2 text-orange-600 dark:text-orange-400">
                (filtered from {problemStatements.length} total)
              </span>
            )}
          </div>
        </div>

        {/* Problem Statements List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
            </div>
          </div>
        ) : problemStatements.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-orange-200 dark:border-gray-700">
            <FileText size={64} className="mx-auto text-orange-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Problem Statements
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by creating your first problem statement
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Create Problem Statement
            </button>
          </div>
        ) : (
          <>
            {/* Table Container */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-orange-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-orange-50 dark:bg-gray-800 border-b border-orange-200 dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        PS ID
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Tags
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Teams
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentItems.map((statement, index) => (
                      <motion.tr
                        key={statement.psId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors duration-150"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">
                            {statement.psId}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white max-w-xs">
                            <div className="line-clamp-2" title={statement.title}>
                              {statement.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2" title={statement.description}>
                              {statement.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">
                            {statement.category}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {statement.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {statement.tags.length > 3 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                                +{statement.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {statement.teamCount || 0}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleView(statement)}
                              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(statement)}
                              className="p-2 text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-200"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(statement.psId)}
                              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedStatements.length)} of {sortedStatements.length} entries
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    {generatePageNumbers().map((page, idx) => (
                      <button
                        key={idx}
                        onClick={() => typeof page === 'number' && handlePageChange(page)}
                        disabled={page === '...'}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          page === currentPage
                            ? 'bg-orange-600 text-white'
                            : page === '...'
                            ? 'text-gray-400 dark:text-gray-500 cursor-default'
                            : 'border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <FormModal
          onSubmit={handleCreateSubmit}
          onClose={() => {
            setShowCreateForm(false);
            resetForm();
          }}
          formData={formData}
          handleInputChange={handleInputChange}
          categories={categories}
        />
      )}

      {/* Edit Form Modal */}
      {showEditForm && (
        <FormModal
          isEdit={true}
          onSubmit={handleEditSubmit}
          onClose={() => {
            setShowEditForm(false);
            setEditingStatement(null);
            resetForm();
          }}
          formData={formData}
          handleInputChange={handleInputChange}
          categories={categories}
        />
      )}

      {/* CSV Upload Modal */}
      {showCsvUpload && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-2xl border border-orange-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Upload CSV File
              </h2>
              <button
                onClick={() => setShowCsvUpload(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCsvUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
                  required
                />
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2">CSV should contain columns: title, description, category, tags</p>
                <button
                  type="button"
                  onClick={downloadSampleCsv}
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Download size={16} />
                  Download Sample CSV
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={uploadProgress}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadProgress ? 'Uploading...' : 'Upload CSV'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCsvUpload(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* View Modal */}
      {showViewModal && viewingStatement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowViewModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-orange-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Problem Statement Details
                </h2>
                <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-lg">
                  {viewingStatement.psId}
                </span>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Title
                </h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {viewingStatement.title}
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {viewingStatement.description}
                </p>
              </div>

              {/* Category */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Category
                </h3>
                <span className="inline-block text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-lg">
                  {viewingStatement.category}
                </span>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Tags ({viewingStatement.tags.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {viewingStatement.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Team Count */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Teams Selected
                </h3>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {viewingStatement.teamCount || 0} {viewingStatement.teamCount === 1 ? 'Team' : 'Teams'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(viewingStatement);
                }}
                className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Edit size={16} />
                Edit Problem Statement
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProblemStatements;