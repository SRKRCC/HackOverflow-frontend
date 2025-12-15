import { useState, useEffect } from "react";
import { useTeamStore } from "@/lib/stores/team";
import Button from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Info, Edit, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function General() {
  const { generalInfo, loading, fetchGeneralInfo, updateGeneralInfo } = useTeamStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<
    Array<{
      id: number;
      name: string;
      certification_name: string;
      roll_number: string;
      gender: string;
    }>
  >([]);

  useEffect(() => {
    fetchGeneralInfo();
  }, [fetchGeneralInfo]);

  useEffect(() => {
    if (generalInfo?.data?.members) {
      setFormData(
        generalInfo.data.members.map((member) => ({
          id: member.id,
          name: member.name,
          certification_name: member.certification_name || "",
          roll_number: member.roll_number || "",
          gender: member.gender || "",
        }))
      );
    }
  }, [generalInfo]);

  const canEdit = generalInfo?.data?.members?.every(
    (member) =>
      !member.certification_name && !member.roll_number && !member.gender
  );

  const handleInputChange = (
    memberId: number,
    field: "certification_name" | "roll_number" | "gender",
    value: string
  ) => {
    setFormData((prev) =>
      prev.map((member) => {
        if (member.id === memberId) {
          if (field === "certification_name" || field === "roll_number") {
            return { ...member, [field]: value.toUpperCase() };
          }
          return { ...member, [field]: value };
        }
        return member;
      })
    );
  };

  const isFormValid = () => {
    return formData.every(
      (member) =>
        member.certification_name.trim() !== "" &&
        member.roll_number.trim() !== "" &&
        member.gender !== ""
    );
  };

  const handleVerifyClick = () => {
    if (!isFormValid()) {
      toast.error("Please fill all fields for all members");
      return;
    }
    setShowVerifyModal(true);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const membersToUpdate = formData.map((member) => ({
        id: member.id,
        certification_name: member.certification_name,
        roll_number: member.roll_number,
        gender: member.gender,
      }));

      await updateGeneralInfo(membersToUpdate);
      toast.success("Member details updated successfully!");
      setShowVerifyModal(false);
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update member details");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !generalInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-b border-border/40">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Info className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-4xl font-black">
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    General Information
                  </span>
                </h1>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                {canEdit
                  ? "Complete your team's general information for certificates"
                  : "Your general information has been submitted"}
              </p>
            </div>
            {canEdit && !isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="default"
                className="gap-2"
              >
                <Edit size={16} />
                Edit Details
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Important Note */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 rounded-xl"
          >
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Important Note
                </h3>
                <p className="text-sm text-muted-foreground">
                  The details you provide will reflect on certificates. Please
                  ensure they are formal and professional. Certification names
                  and roll numbers will be automatically converted to uppercase.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Team Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {generalInfo?.data?.team?.title}
          </h2>
          <p className="text-muted-foreground">
            Team ID: {generalInfo?.data?.team?.id}
          </p>
        </div>

        {/* Members List */}
        <div className="space-y-6">
          {formData.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Member {index + 1}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Certification Name */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={`cert-name-${member.id}`}
                    className="text-sm font-medium text-foreground"
                  >
                    Certification Name *
                  </label>
                  {isEditing ? (
                    <input
                      id={`cert-name-${member.id}`}
                      type="text"
                      value={member.certification_name}
                      onChange={(e) =>
                        handleInputChange(
                          member.id,
                          "certification_name",
                          e.target.value
                        )
                      }
                      className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                      placeholder="FULL NAME IN CAPS"
                      required
                    />
                  ) : (
                    <div className="h-11 rounded-xl border border-border bg-muted px-4 flex items-center text-sm text-foreground">
                      {member.certification_name || "Not provided"}
                    </div>
                  )}
                </div>

                {/* Roll Number */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={`roll-${member.id}`}
                    className="text-sm font-medium text-foreground"
                  >
                    Roll/Registration Number *
                  </label>
                  {isEditing ? (
                    <input
                      id={`roll-${member.id}`}
                      type="text"
                      value={member.roll_number}
                      onChange={(e) =>
                        handleInputChange(member.id, "roll_number", e.target.value)
                      }
                      className="h-11 rounded-xl border border-border bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                      placeholder="ROLL NUMBER"
                      required
                    />
                  ) : (
                    <div className="h-11 rounded-xl border border-border bg-muted px-4 flex items-center text-sm text-foreground">
                      {member.roll_number || "Not provided"}
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={`gender-${member.id}`}
                    className="text-sm font-medium text-foreground"
                  >
                    Gender *
                  </label>
                  {isEditing ? (
                    <Select
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                      ]}
                      placeholder="Select gender"
                      value={member.gender}
                      onChange={(e) =>
                        handleInputChange(member.id, "gender", e.target.value)
                      }
                      required
                    />
                  ) : (
                    <div className="h-11 rounded-xl border border-border bg-muted px-4 flex items-center text-sm text-foreground">
                      {member.gender || "Not provided"}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end gap-3 mt-8"
          >
            <Button
              onClick={() => {
                setIsEditing(false);
                // Reset form data
                if (generalInfo?.data?.members) {
                  setFormData(
                    generalInfo.data.members.map((member) => ({
                      id: member.id,
                      name: member.name,
                      certification_name: member.certification_name || "",
                      roll_number: member.roll_number || "",
                      gender: member.gender || "",
                    }))
                  );
                }
              }}
              variant="outline"
              className="gap-2"
            >
              <X size={16} />
              Cancel
            </Button>
            <Button
              onClick={handleVerifyClick}
              disabled={!isFormValid()}
              className="gap-2"
            >
              <Check size={16} />
              Verify Details
            </Button>
          </motion.div>
        )}
      </div>

      {/* Verification Modal */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !saving && setShowVerifyModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto z-10"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-6 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Verify Member Details
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Please review all information carefully before submitting
                    </p>
                  </div>
                  {!saving && (
                    <button
                      onClick={() => setShowVerifyModal(false)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {formData.map((member, index) => (
                  <div
                    key={member.id}
                    className="p-5 bg-muted/30 rounded-xl border border-border/50"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {member.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Member {index + 1}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Certification Name
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {member.certification_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Roll/Registration Number
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {member.roll_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Gender
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {member.gender}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Warning */}
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">
                      <strong>Important:</strong> These details will be used for
                      certificates. Make sure all information is accurate and
                      professional. Once submitted, you cannot edit these details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border p-6 flex justify-end gap-3">
                <Button
                  onClick={() => setShowVerifyModal(false)}
                  variant="outline"
                  disabled={saving}
                >
                  Go Back
                </Button>
                <Button onClick={handleSubmit} disabled={saving} className="gap-2">
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Confirm & Submit
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
