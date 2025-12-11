import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ApiService } from "@/lib/api";
import type { Team, Member, ValidationError } from "@/lib/types";

interface EditMemberModalProps {
  team: Team;
  member: Member;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedMember: Member) => void;
}

const T_SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const DEPARTMENT_OPTIONS = [
  { value: "", label: "Select department" },
  { value: "CSE", label: "Computer Science & Engineering" },
  { value: "CSBS", label: "Computer Science & Business Systems" },
  { value: "CSD", label: "Computer Science & Design" },
  { value: "CSIT", label: "Computer Science & Information Technology" },
  { value: "IT", label: "Information Technology" },
  { value: "AI&DS", label: "Artificial Intelligence & Data Science" },
  { value: "AI&ML", label: "Artificial Intelligence & Machine Learning" },
  { value: "ECE", label: "Electronics & Communication Engineering" },
  { value: "EEE", label: "Electrical & Electronics Engineering" },
  { value: "MECH", label: "Mechanical Engineering" },
  { value: "CIVIL", label: "Civil Engineering" },
  { value: "CHEM", label: "Chemical Engineering" },
  { value: "BIO", label: "Biotechnology" },
  { value: "OTHER", label: "Other" },
];

export default function EditMemberModal({ team, member, isOpen, onClose, onUpdate }: EditMemberModalProps) {
  const [formData, setFormData] = useState({
    name: member.name,
    email: member.email,
    phone_number: member.phone_number,
    department: member.department || "",
    college_name: member.college_name,
    year_of_study: member.year_of_study || 1,
    location: member.location || "",
    tShirtSize: member.tShirtSize || "M",
    attendance: member.attendance,
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: member.name,
        email: member.email,
        phone_number: member.phone_number,
        department: member.department || "",
        college_name: member.college_name,
        year_of_study: member.year_of_study || 1,
        location: member.location || "",
        tShirtSize: member.tShirtSize || "M",
        attendance: member.attendance,
      });
      setErrors([]);
    }
  }, [isOpen, member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      // Only send changed fields
      const updates: any = {};
      
      if (formData.name !== member.name) {
        updates.name = formData.name;
      }
      if (formData.email !== member.email) {
        updates.email = formData.email;
      }
      if (formData.phone_number !== member.phone_number) {
        updates.phone_number = formData.phone_number;
      }
      if (formData.department !== (member.department || "")) {
        updates.department = formData.department;
      }
      if (formData.college_name !== member.college_name) {
        updates.college_name = formData.college_name;
      }
      if (formData.year_of_study !== (member.year_of_study || 1)) {
        updates.year_of_study = formData.year_of_study;
      }
      if (formData.location !== (member.location || "")) {
        updates.location = formData.location;
      }
      if (formData.tShirtSize !== (member.tShirtSize || "M")) {
        updates.tShirtSize = formData.tShirtSize;
      }
      if (formData.attendance !== member.attendance) {
        updates.attendance = formData.attendance;
      }

      // Don't make API call if nothing changed
      if (Object.keys(updates).length === 0) {
        onClose();
        return;
      }

      const response = await ApiService.admin.updateMember(team.teamId, member.id, updates);
      
      if (response.success) {
        onUpdate(response.data);
        onClose();
      }
    } catch (error: any) {
      console.error("Failed to update member:", error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors([{ 
          field: "general", 
          message: error.response?.data?.message || "Failed to update member" 
        }]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Edit Member Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* General errors */}
        {getFieldError("general") && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{getFieldError("general")}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                getFieldError("name")
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
              }`}
              placeholder="Enter full name"
              minLength={2}
              required
              disabled={isSubmitting}
            />
            {getFieldError("name") && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {getFieldError("name")}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                getFieldError("email")
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
              }`}
              placeholder="Enter email address"
              required
              disabled={isSubmitting}
            />
            {getFieldError("email") && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {getFieldError("email")}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                getFieldError("phone_number")
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
              }`}
              placeholder="Enter phone number"
              required
              disabled={isSubmitting}
            />
            {getFieldError("phone_number") && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {getFieldError("phone_number")}
              </p>
            )}
          </div>

          {/* Department and Year in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                  getFieldError("department")
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
                }`}
                disabled={isSubmitting}
              >
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
              {getFieldError("department") && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {getFieldError("department")}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Year of Study
              </label>
              <select
                value={formData.year_of_study}
                onChange={(e) => setFormData({ ...formData, year_of_study: parseInt(e.target.value) })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                  getFieldError("year_of_study")
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
                }`}
                disabled={isSubmitting}
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
              {getFieldError("year_of_study") && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {getFieldError("year_of_study")}
                </p>
              )}
            </div>
          </div>

          {/* College Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              College Name *
            </label>
            <input
              type="text"
              value={formData.college_name}
              onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                getFieldError("college_name")
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
              }`}
              placeholder="Enter college name"
              required
              disabled={isSubmitting}
            />
            {getFieldError("college_name") && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {getFieldError("college_name")}
              </p>
            )}
          </div>

          {/* Location and T-Shirt Size in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                  getFieldError("location")
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
                }`}
                placeholder="Enter location"
                disabled={isSubmitting}
              />
              {getFieldError("location") && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {getFieldError("location")}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                T-Shirt Size
              </label>
              <select
                value={formData.tShirtSize}
                onChange={(e) => setFormData({ ...formData, tShirtSize: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                  getFieldError("tShirtSize")
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
                }`}
                disabled={isSubmitting}
              >
                {T_SHIRT_SIZES.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              {getFieldError("tShirtSize") && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {getFieldError("tShirtSize")}
                </p>
              )}
            </div>
          </div>

          {/* Attendance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attendance Score
            </label>
            <input
              type="number"
              value={formData.attendance}
              onChange={(e) => setFormData({ ...formData, attendance: parseInt(e.target.value) || 0 })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                getFieldError("attendance")
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
              }`}
              placeholder="Enter attendance score"
              min={0}
              disabled={isSubmitting}
            />
            {getFieldError("attendance") && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {getFieldError("attendance")}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 rounded-lg transition-colors flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}