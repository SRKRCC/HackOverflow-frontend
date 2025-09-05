function ProblemStatement() {
  const problemStatements ={
    statement: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. In blanditiis neque placeat veritatis enim exercitationem voluptas accusantium voluptatibus explicabo error? Dolore quos sequi quod quia fuga suscipit veniam, neque alias. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores repellat blanditiis accusantium ullam modi necessitatibus nisi eligendi voluptatem voluptatibus consequuntur eveniet expedita adipisci, earum commodi, eos numquam excepturi, veritatis qui!",
    title: "Problem Statement Title",
    shortDesc:"this project on AI"
  }
  return (
    <section className="relative bg-background text-foreground px-6 py-16 md:py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <svg
          className="absolute top-10 left-5 w-32 h-32 text-primary animate-float"
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

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Heading */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4 animate-fade-in">
              {problemStatements.title}
            </h1>

            {/* Decorative underline */}
            <svg
              className="w-64 h-2 mx-auto mt-2"
              viewBox="0 0 256 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 5C32.5 -1 85 1.5 127 5C169 8.5 223.5 3.5 255 1"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="oklch(0.65 0.15 70)" />
                  <stop offset="100%" stopColor="oklch(0.6 0.2 270)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Short description */}
          <p className="text-primary font-medium text-xl mt-4">
            {problemStatements.shortDesc}
          </p>
        </div>

        {/* Problem card */}
        <div className="relative">
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
    </section>
  );
}
export default ProblemStatement;