import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Upload,
  Edit,
  Trash2,
  FileText,
  Download,
  AlertCircle,
  CheckCircle,
  X,
} from 'lucide-react';
import { ApiService } from '@/lib/api';

interface ProblemStatement {
  psId: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
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
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

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
              <span className="hidden sm:inline">Add Single</span>
              <span className="sm:hidden">Add</span>
            </button>
            
            <button
              onClick={() => setShowCsvUpload(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Upload size={20} />
              <span className="hidden sm:inline">Upload CSV</span>
              <span className="sm:hidden">CSV</span>
            </button>
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {problemStatements.map((statement) => (
              <motion.div
                key={statement.psId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-orange-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 hover:border-orange-300 dark:hover:border-gray-600"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-lg">
                    {statement.psId}
                  </span>
                  <div className="flex gap-2">
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
                </div>
              
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 overflow-hidden">
                <span className="block" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {statement.title}
                </span>
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 overflow-hidden">
                <span className="block" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {statement.description}
                </span>
              </p>
                
                <div className="mb-4">
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-lg">
                    {statement.category}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {statement.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
            </motion.div>
          ))}
          </div>
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
    </div>
  );
};

export default ProblemStatements;