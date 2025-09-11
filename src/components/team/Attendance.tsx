const Attendance = () => {
    return (
        <>
            <header className="relative  py-8 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/20 to-accent/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-20 left-1/2 w-60 h-60 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-2xl animate-pulse-glow"></div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto text-center">
                {/* Main Title */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center mb-4">
                    <div className="w-12 h-1 bg-gradient-to-r from-transparent to-primary rounded-full animate-slide-in"></div>
                    <div className="mx-4">
                        <svg className="w-8 h-8 text-primary animate-scale-in" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                        </svg>
                    </div>
                    <div className="w-12 h-1 bg-gradient-to-l from-transparent to-secondary rounded-full animate-slide-in" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black mb-4 animate-fade-in">
                    <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                        Attendance
                    </span>
                    </h1>
                    
                    <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full animate-scale-in" style={{animationDelay: '0.4s'}}></div>
                </div>
                
                </div>
            </header>
        </>
    )
}

export default Attendance ;
