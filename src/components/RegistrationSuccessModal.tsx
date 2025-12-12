import { CheckCircle, CreditCard, X } from "lucide-react"
import Button from "./ui/button"

interface RegistrationSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  teamName: string
  sccId: string
  totalMembers: number
  totalAmount: number
  onContinueToPayment: () => void
}

export default function RegistrationSuccessModal({
  isOpen,
  onClose,
  teamName,
  sccId,
  totalMembers,
  totalAmount,
  onContinueToPayment
}: RegistrationSuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-green-500 rounded-full animate-ping opacity-20" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your team has been registered for HackOverflow 2K25
          </p>
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 mb-6 border border-primary/20">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Team Name:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{teamName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">SCC ID:</span>
              <span className="font-mono font-bold text-primary">{sccId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Members:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{totalMembers}</span>
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Amount to Pay:</span>
              <span className="text-xl font-bold text-primary">₹{totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Important:</strong> Complete your payment to confirm your team's participation.
          </p>
        </div>

        <Button
          onClick={onContinueToPayment}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl py-3 font-semibold text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
        >
          <CreditCard className="h-5 w-5" />
          Continue to Payment
        </Button>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
