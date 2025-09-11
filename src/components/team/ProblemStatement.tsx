function ProblemStatement() {
  const problemStatements ={
    statement: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. In blanditiis neque placeat veritatis enim exercitationem voluptas accusantium voluptatibus explicabo error? Dolore quos sequi quod quia fuga suscipit veniam, neque alias. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores repellat blanditiis accusantium ullam modi necessitatibus nisi eligendi voluptatem voluptatibus consequuntur eveniet expedita adipisci, earum commodi, eos numquam excepturi, veritatis qui!",
    title: "Problem Statement Title",
    shortDesc:"This project on AI"
  }
  return (
    
      <>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <svg
          className="absolute top-10 left-15 w-32 h-32 text-primary animate-float"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path d="M30,50 Q50,30 70,50 Q50,70 30,50 Z" />
        </svg>

        <svg
          className="absolute bottom-20 right-10 w-24 h-24 text-secondary animate-float"
          style={{ animationDelay: "1s" }}
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <polygon
            points="50,10 80,90 20,90"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="50" cy="50" r="15" />
        </svg>

        <svg
          className="absolute top-1/3 right-1/4 w-20 h-20 text-accent animate-pulse"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <rect
            x="25"
            y="25"
            width="50"
            height="50"
            rx="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <line
            x1="25"
            y1="25"
            x2="75"
            y2="75"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="75"
            y1="25"
            x2="25"
            y2="75"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
       </div> 

      <div className=" relative z-10">
        {/* Heading */}
        <header className="relative py-8 px-4 mb-5">
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
                {problemStatements.title}
              </span>
            </h1>
            
            
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full animate-scale-in" style={{animationDelay: '0.4s'}}></div>
            <div className="text-center mb-8 mt-5">
                  <h1 className="relative inline-block group">
                    
                      {/* Text */}
                      <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-wide">
                        {problemStatements.shortDesc}
                      </span>
                      
                  
                  </h1>
                </div>

          </div>
          
        </div>
      </header>

        {/* Problem card */}
        <div className="relative max-w-5xl mx-auto">
          {/* Corner decorations */}
          <svg
            className="absolute -top-2 -left-2 w-6 h-6 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 2V8H2" />
          </svg>
          <svg
            className="absolute -top-2 -right-2 w-6 h-6 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M16 2V8H22" />
          </svg>
          <svg
            className="absolute -bottom-2 -left-2 w-6 h-6 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 22V16H2" />
          </svg>
          <svg
            className="absolute -bottom-2 -right-2 w-6 h-6 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M16 22V16H22" />
          </svg>

          <div className="bg-card text-card-foreground p-8 md:p-10 rounded-xl shadow-lg animate-slide-up border border-border relative overflow-hidden">
            {/* Subtle pattern background */}
            <div className="absolute inset-0 opacity-[0.03]">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id="smallGrid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#smallGrid)" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <svg
                  className="w-12 h-12 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 16V12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 8H12.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <p className="text-lg leading-relaxed md:leading-loose text-center">
                {problemStatements.statement}
              </p>
            </div>
          </div>
        </div>
      </div>
      </>
  );
}
export default ProblemStatement;