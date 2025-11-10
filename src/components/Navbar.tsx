import { useState, useEffect } from "react"
import { Menu, X, Calendar, Trophy, Zap, Home, FileText } from "lucide-react"
import Button from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import ThemeToggle from "./ThemeToggle"
import { auth } from "@/lib/auth"

const Navbar = ({ className = "" }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const getNavItems = () => {
        const isTeam = auth.isTeam()

        if (isTeam) {
            return []  // Empty for team users since they use sidebar navigation
        }

        return [
            { name: "Home", icon: Home, href: "/" },
            { name: "Schedule", icon: Calendar, href: "/schedule" },
            { name: "Problem Statements", icon: FileText, href: "/problem-statements" },
            { name: "Prizes", icon: Trophy, href: "/prizes" },
        ]
    }

    const navItems = getNavItems()

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-transparent"
                } ${className}`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 animate-fade-in">
                        <div className="relative">
                            <Zap className="h-8 w-8 text-primary animate-pulse" />
                            <div className="absolute inset-0 h-8 w-8 text-primary animate-ping opacity-20" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            HackOverflow 2k25
                        </h1>
                        <div className="md:hidden">
                            <ThemeToggle />

                        </div>


                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item, index) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="group relative px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary/10 animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-center space-x-2 text-foreground group-hover:text-primary transition-colors duration-300">
                                    <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                                    <span className="font-medium nav-anim-text">{item.name}</span>
                                </div>
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}

                    </div>


                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-3 animate-fade-in" style={{ animationDelay: "600ms" }}>
                        <ThemeToggle />
                        {auth.isAuthenticated() ? (
                            <Button 
                                variant="outline" 
                                className="text-white bg-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                                onClick={() => {
                                    auth.logout()
                                    navigate('/')
                                    window.location.reload()
                                }}
                            >
                                Logout
                            </Button>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login">
                                    <Button variant="outline" className="text-white bg-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
                                        Register
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-300"
                    >
                        {isOpen ? (
                            <X className="h-6 w-6 text-foreground animate-spin" />
                        ) : (
                            <Menu className="h-6 w-6 text-foreground hover:text-primary transition-colors duration-300" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="py-4 space-y-2 bg-card/95 backdrop-blur-md rounded-lg mt-2 border border-border shadow-xl">
                        {navItems.map((item, index) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center space-x-3 px-4 py-3 text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 animate-slide-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}
                        <div className="px-4 py-3 space-y-2 border-t border-border">
                            {auth.isAuthenticated() ? (
                                <Button 
                                    variant="outline" 
                                    className="w-full bg-transparent"
                                    onClick={() => {
                                        auth.logout()
                                        navigate('/')
                                        window.location.reload()
                                    }}
                                >
                                    Logout
                                </Button>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <Button variant="outline" className="w-full bg-transparent">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button className="w-full bg-gradient-to-r from-primary to-secondary">Register Now</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar