import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { CheckCircle, Home, MessageCircle } from "lucide-react"
import Button from '@/components/ui/button'
import { ApiService } from '@/lib/api/service'

export default function PaymentSuccess() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [loading, setLoading] = useState(true)
    const [registrationData, setRegistrationData] = useState<{
        message: string
        sccId?: string
        teamName?: string
    } | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const handlePaymentSuccess = async () => {
            try {
                const teamId = searchParams.get('teamId')
                const transactionId = searchParams.get('txnId')
                
                if (!teamId) {
                    setError("Invalid payment confirmation. Team ID not found.")
                    setLoading(false)
                    return
                }

                // Get registration data from session storage if available
                const storedData = sessionStorage.getItem('registrationData')
                let data = null
                
                if (storedData) {
                    data = JSON.parse(storedData)
                    sessionStorage.removeItem('registrationData')
                }

                // Confirm payment with backend
                if (transactionId) {
                    await ApiService.public.confirmPayment(teamId, {
                        transactionId,
                        paymentStatus: 'success',
                        timestamp: new Date().toISOString()
                    })
                }

                setRegistrationData({
                    message: data?.message || 'Your payment has been processed successfully! Your registration is now complete.',
                    sccId: data?.sccId || teamId,
                    teamName: data?.teamName
                })
            } catch (err) {
                console.error('Payment confirmation error:', err)
                setError("There was an issue confirming your payment. Please contact support with your transaction details.")
            } finally {
                setLoading(false)
            }
        }

        handlePaymentSuccess()
    }, [searchParams])

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">Processing payment confirmation...</p>
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
                <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-2xl max-w-lg w-full text-center">
                    <div className="inline-flex p-4 bg-red-100 rounded-full mb-6">
                        <div className="h-12 w-12 text-red-600 flex items-center justify-center">❌</div>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-4">Payment Confirmation Error</h1>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <Button
                        onClick={() => navigate("/", { replace: true })}
                        className="w-full px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold"
                    >
                        <Home className="h-5 w-5 mr-2" />
                        Back to Home
                    </Button>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
            <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-2xl max-w-lg w-full text-center">
                <div className="inline-flex p-4 bg-green-100 rounded-full mb-6">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-4">Payment Successful!</h1>
                <div className="text-muted-foreground mb-6 space-y-3">
                    <p>{registrationData?.message}</p>
                    {registrationData?.sccId && (
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
                            <p className="text-sm text-primary font-semibold">
                                Your SCC ID: <span className="font-mono text-lg">{registrationData.sccId}</span>
                            </p>
                        </div>
                    )}
                    {registrationData?.teamName && (
                        <p className="text-sm text-muted-foreground">
                            Team: <span className="font-medium">{registrationData.teamName}</span>
                        </p>
                    )}
                </div>
                
                {/* WhatsApp Group Section */}
                <div className="bg-green-50/50 border border-green-200/50 rounded-xl p-6 mb-6">
                    <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center justify-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Join our WhatsApp Group
                    </h4>
                    <p className="text-sm text-green-700 mb-4">
                        Stay updated with the latest announcements and connect with other participants!
                    </p>
                    
                    <Button
                        onClick={() => window.open('https://chat.whatsapp.com/GUg1kFD0let90x7LCA3amy', '_blank')}
                        className="w-full px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <MessageCircle className="h-4 w-4" />
                        Join WhatsApp Group
                    </Button>
                </div>

                <Button
                    onClick={() => navigate("/", { replace: true })}
                    className="w-full px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg"
                >
                    <Home className="h-5 w-5 mr-2" />
                    Back to Home
                </Button>
            </div>
        </main>
    )
}