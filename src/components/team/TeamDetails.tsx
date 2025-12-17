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
                className="group relative bg-card rounded-2xl p-6 border border-primary/90 hover:shadow-md hover:-translate-y-1 transform transition duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-lg">
                    {member.certification_name?.trim()?.[0]?.toUpperCase() || member.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-bold text-foreground truncate" title={member.certification_name || member.name}>
                      {member.certification_name?.trim() || member.name}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {member.department || '—'} • Year {member.year_of_study || '—'}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center py-2 px-2 border-t border-border/50 first:border-t-0">
                      <div className="sm:col-span-1 text-sm text-muted-foreground font-medium">Email</div>
                    <div className="sm:col-span-3 text-sm text-foreground truncate">
                      <a className="text-primary/90 italic" href={`mailto:${member.email}`} title={member.email}>
                        {member.email || 'N/A'}
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center py-2 px-2 border-t border-border/50 first:border-t-0">
                      <div className="sm:col-span-1 text-sm text-muted-foreground font-medium">Phone</div>
                    <div className="sm:col-span-3 text-sm text-foreground truncate">
                      <a className="italic" href={`tel:${member.phone_number}`} title={member.phone_number}>
                        {member.phone_number || 'N/A'}
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center py-2 px-2 border-t border-border/50 first:border-t-0">
                      <div className="sm:col-span-1 text-sm text-muted-foreground font-medium">College</div>
                    <div className="sm:col-span-3 text-sm text-foreground truncate">{member.college_name || 'N/A'}</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center py-2 px-2 border-t border-border/50 first:border-t-0">
                      <div className="sm:col-span-1 text-sm text-muted-foreground font-medium">Reg. No</div>
                    <div className="sm:col-span-3 text-sm text-foreground truncate">{member.roll_number || 'N/A'}</div>
                  </div>

                  {member.tShirtSize && (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center py-2 px-2 border-t border-border/50 first:border-t-0">
                        <div className="sm:col-span-1 text-sm text-muted-foreground font-medium">T-Shirt</div>
                      <div className="sm:col-span-3 text-sm text-foreground truncate">{member.tShirtSize}</div>
                    </div>
                  )}

                  {member.gender && (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center py-2 px-2 border-t border-border/50 first:border-t-0">
                        <div className="sm:col-span-1 text-sm text-muted-foreground font-medium">Gender</div>
                      <div className="sm:col-span-3 text-sm text-foreground truncate">{member.gender}</div>
                    </div>
                  )}

                  {member.location && (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center py-2 px-2 border-t border-border/50 first:border-t-0">
                        <div className="sm:col-span-1 text-sm text-muted-foreground font-medium">Location</div>
                      <div className="sm:col-span-3 text-sm text-foreground truncate">{member.location}</div>
                    </div>
                  )}
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