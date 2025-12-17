import { useTeamStore } from "@/lib/stores/team";
import { useEffect } from "react";

export default function TeamDetails() {
  const { team: teamDetails, loading, fetchTeam } = useTeamStore();

  useEffect(() => {
    if (!teamDetails) {
      fetchTeam();
    }
  }, [teamDetails, fetchTeam]);

  if (loading && !teamDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (
    !teamDetails ||
    !teamDetails.members ||
    teamDetails.members.length === 0
  ) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No team members found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-b border-border/40">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {teamDetails.title}
              </span>
            </h1>

            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl px-6 py-4 border border-border/40 shadow-sm">
                <div className="text-2xl font-bold text-primary">{teamDetails.scc_id}</div>
                <div className="text-sm text-muted-foreground">Team ID</div>
              </div>
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl px-6 py-4 border border-border/40 shadow-sm">
                <div className="text-2xl font-bold text-secondary">{teamDetails.members.length}</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {teamDetails.members.map((member) => {

            return (
              <div
                key={member.id}
                className={`group relative bg-card rounded-3xl p-6 border border-border/40 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-visible`}
              >
                <div className="absolute inset-0 rounded-3xl opacity-5 z-0 pointer-events-none">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
                      backgroundSize: "20px 20px"
                    }}
                  />
                </div>

                  <div className="relative z-10">
                    <div className="absolute -top-15 left-1/2 -translate-x-1/2 z-40">
                    <div className="px-4 py-2 text-lg rounded-full bg-background border border-primary/50 text-primary font-bold max-w-[100%] truncate shadow-sm">
                      {member.name}
                    </div>
                  </div>

                  <div className="mt-6 w-full bg-card rounded-xl p-3 border border-border/30">
                    <p className="text-sm font-medium text-foreground truncate">{member.email}</p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="grid grid-cols-[48px_1fr] items-center gap-1 p-3 rounded-xl bg-card border border-border/30">
                      <div className={`w-9 h-9 rounded-lg bg-primary/30 flex items-center justify-center flex-shrink-0 text-white`}> 
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7H7v6H3v8h18v-8h-6V7z" />
                        </svg>
                      </div>
                      <div className="flex items-center justify-left">
                        <p className="text-sm font-semibold text-foreground">{member.department}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-[48px_1fr] items-center gap-3 p-3 rounded-xl bg-card border border-border/30">
                      <div className={`w-9 h-9 rounded-lg bg-primary/30 flex items-center justify-center flex-shrink-0 text-white`}> 
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center justify-left">
                          <p className="text-sm font-medium text-foreground">{member.phone_number}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-[48px_1fr] items-center gap-3 p-3 rounded-xl bg-card border border-border/30">
                      <div className={`w-9 h-9 rounded-lg bg-primary/30 flex items-center justify-center flex-shrink-0 text-white`}> 
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center justify-left">
                          <p className="text-sm font-medium text-foreground">{member.college_name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-[48px_1fr] items-center gap-3 p-3 rounded-xl bg-card border border-border/30">
                      <div className={`w-9 h-9 rounded-lg bg-primary/30 flex items-center justify-center flex-shrink-0 text-white`}> 
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center justify-left">
                          <p className="text-sm font-medium text-foreground">Year {member.year_of_study}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {teamDetails.members.length === 0 && (
          <div className="text-center py-16">
            <div className="w-28 h-28 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-border/30 shadow-sm">
              <div className="w-20 h-20 rounded-xl bg-card/40 flex items-center justify-center text-foreground/70"> 
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Team Members</h3>
            <p className="text-muted-foreground">Your team roster is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}