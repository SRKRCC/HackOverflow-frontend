import { useState, useEffect } from 'react';

interface ProblemStatement {
  
  title: string;
  description: string;
  categories: string;
  tags: string;
}

const TeamProblemStatementViewer = () => {
  const [problemStatement, setProblemStatement] = useState<ProblemStatement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching data based on team ID
  useEffect(() => {
    const fetchProblemStatement = async () => {
      setIsLoading(true);
      try {
        // In a real application, you would fetch this data based on the team ID
        const mockData: ProblemStatement = {
          title: 'Reducing Food Waste Through Smart Distribution',
          description: 'Our solution connects restaurants with surplus food to local shelters and food banks in real-time, reducing waste and fighting hunger. We utilize a mobile application that alerts nearby shelters when excess food is available, and coordinate pickup through volunteer networks. This approach addresses both environmental concerns (reducing methane emissions from landfills) and social needs (fighting hunger in local communities).',
          categories: 'Sustainability',
          tags: 'sustainability'
        };
        setProblemStatement(mockData);
      } catch (error) {
        console.error('Error fetching problem statement:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblemStatement();
  }, []);

  if (isLoading) {
    return (
      <div id="home" className="min-h-screen flex items-center justify-between px-4 md:px-20 gap-8 md:gap-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 animate-gradient" />
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float" />
        <div
          className="absolute bottom-32 right-16 w-16 h-16 bg-accent/10 rounded-lg rotate-45 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div className="max-w-4xl mx-auto relative z-10 py-8 text-center">
          <div className="animate-pulse text-primary text-xl">Loading problem statement...</div>
        </div>
      </div>
    );
  }

  if (!problemStatement) {
    return (
      <div id="home" className="min-h-screen flex items-center justify-between px-4 md:px-20 gap-8 md:gap-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 animate-gradient" />
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float" />
        <div
          className="absolute bottom-32 right-16 w-16 h-16 bg-accent/10 rounded-lg rotate-45 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div className="max-w-4xl mx-auto relative z-10 py-8 text-center">
          <div className="text-destructive text-xl">Problem statement not found</div>
        </div>
      </div>
    );
  }

  return (
    <div id="home" className="min-h-screen flex items-center justify-between px-4 md:px-20 gap-8 md:gap-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 animate-gradient" />
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float" />
      <div
        className="absolute bottom-32 right-16 w-16 h-16 bg-accent/10 rounded-lg rotate-45 animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/3 left-1/4 w-12 h-12 bg-secondary/10 rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-20 left-20 w-14 h-14 bg-primary/5 rounded-lg rotate-12 animate-float"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="max-w-4xl mx-auto relative z-10 py-8 w-full">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-3xl font-bold text-primary mb-2">Problem Statement</h1>
          <p className="text-muted-foreground">Detailed view of your team's challenge</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border animate-scale-in">
          {/* Categories Header */}
          <div className="bg-gradient-to-r from-primary to-amber-600 p-4 text-primary-foreground">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary-foreground/20">
                  problemStatement details
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-card-foreground">{problemStatement.title}</h2>
            </div>

            {/* Description */}
            <div className="mb-6">
              <span className="text-sm text-muted-foreground">Description:</span>
              <p className="text-card-foreground mt-2 p-4 bg-muted rounded-lg leading-relaxed">
                {problemStatement.description}
              </p>
            </div>

            {/* Tags */}
            {problemStatement.tags && (
              <div className="mb-6">
                <span className="text-sm text-muted-foreground">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-block px-3 py-1 rounded-full text-sm bg-secondary/20 text-secondary">
                    #{problemStatement.tags}
                  </span>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-4">
              <p>For any modifications to your problem statement, please contact the administrator.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamProblemStatementViewer;