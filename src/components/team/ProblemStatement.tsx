import { useEffect } from "react";
import { useTeamStore } from "@/lib/stores/team";

function ProblemStatement() {
  const { problemStatement: ps, loading, error, fetchProblemStatements } = useTeamStore();

  useEffect(() => {
    if (!ps) {
      fetchProblemStatements();
    }
  }, [ps, fetchProblemStatements]);

  if (loading && !ps) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-600">
        Loading problem statement...
      </div>
    );
  }

  if (error || !ps) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 font-semibold">
        {error || "Problem statement not found."}
      </div>
    );
  }

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
        <svg
          className="absolute top-10 left-5 sm:left-15 w-20 h-20 sm:w-32 sm:h-32 text-primary animate-float"
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
          className="absolute bottom-20 right-5 sm:right-10 w-16 h-16 sm:w-24 sm:h-24 text-secondary animate-float"
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
          className="absolute top-1/3 right-1/4 w-14 h-14 sm:w-20 sm:h-20 text-accent animate-pulse"
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

      <div className="relative z-10 md:pb-6">
        <header className="relative py-6 sm:py-8 px-4 mb-4 sm:mb-5 text-center">
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
            <div className="w-8 sm:w-12 h-1 bg-gradient-to-r from-transparent to-primary rounded-full"></div>
            <div className="mx-3 sm:mx-4">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <div className="w-8 sm:w-12 h-1 bg-gradient-to-l from-transparent to-secondary rounded-full"></div>
          </div>

          <h1 className="text-3xl sm:text-3xl md:text-5xl font-black mb-3 sm:pb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent px-2">
            {ps.title}
          </h1>

          <div className="text-lg sm:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-3 sm:mt-4 px-2">
            {ps.category}
          </div>
        </header>

        <div className="relative max-w-5xl mx-auto px-4">
          <div className="bg-card text-card-foreground p-6 sm:p-8 md:p-10 rounded-xl shadow-lg border border-border relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]">
              <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
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
              <div className="flex justify-center mb-4 sm:mb-6">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 16V12M12 8H12.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <p className="text-base sm:text-lg leading-relaxed md:leading-loose text-center whitespace-pre-line">
                {ps.description}
              </p>

              {ps.tags && ps.tags.length > 0 && (
                <div className="mt-5 sm:mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
                  {ps.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 sm:px-4 py-1 bg-primary/10 text-primary font-medium rounded-full text-xs sm:text-sm border border-primary/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProblemStatement;
