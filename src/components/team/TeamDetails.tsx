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
                className={`group relative bg-card rounded-3xl p-6 border border-border/150 hover:border-primary/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-visible`}
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
                    <div className="px-4 py-2 text-lg rounded-full bg-background border border-primary/150 text-primary font-bold max-w-[100%] truncate shadow-sm">
                      {member.name}
                    </div>
                  </div>

                  <div className="mt-6 w-full bg-card rounded-xl p-2 border border-border/150">
                    <p className="text-sm font-medium text-foreground truncate">Email: {member.email}</p>
                  </div>

                  <div className="mt-2 w-full bg-card rounded-xl p-2 border border-border/150">
                    <p className="text-sm font-medium text-foreground truncate">Name: {member.certification_name || "Not Provided Certification Name"}</p>
                  </div>

                  <div className="mt-2 w-full bg-card rounded-xl p-2 border border-border/150">
                    <p className="text-sm font-medium text-foreground truncate">College: {member.college_name}</p>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <div className="gap-1 p-3 rounded-xl bg-card border border-border/150">
                        <p className="text-sm font-medium text-foreground">Dept: {member.department}</p>
                    </div>

                    <div className="gap-1 p-3 rounded-xl bg-card border border-border/150">
                      <div>
                          <p className="text-sm font-medium text-foreground">Year: {member.year_of_study}</p>
                      </div>
                    </div>

                    <div className="gap-1 p-3 rounded-xl bg-card border border-border/150">
                      <div>
                        <p className="text-sm font-medium text-foreground">Ph:{member.phone_number}</p>
                      </div>
                    </div>

                    <div className="gap-1 p-3 rounded-xl bg-card border border-border/150">
                      <div>
                          <p className="text-sm font-medium text-foreground">Reg: {member.roll_number || 'N/A'}</p>
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