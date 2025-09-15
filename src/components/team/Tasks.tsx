import { motion } from "framer-motion";
import { CheckCircle, ClipboardList, ChevronRight , X } from "lucide-react";
import { useState } from "react";

const initialPhases = [
  {
    id: 1,
    title: "Phase 1 - Initial Evaluation",
    description: "Submit the detailed problem statement document clearly outlining the issue your project aims to solve. The document should include the background of the problem, the scope of the project, defined objectives, and measurable goals. Make sure to explain why this project is important and how it provides value. Provide references or supporting research if applicable.",
    status: "Pending",
  },
  {
    id: 2,
    title: "Phase 2 - Mid Evaluation",
    description: "Provide a comprehensive architecture diagram along with a detailed project plan. The architecture diagram should explain the system’s overall design, including frontend, backend, database, and integrations. The project plan must include milestones, timelines, resource allocation, and technologies chosen. Justify your design decisions and explain how the architecture supports scalability, reliability, and maintainability.",
    status: "Pending",
  },
  {
    id: 3,
    title: "Phase 3 - Pre-Final Review",
    description: "Demonstrate a working prototype of the project with at least two major features implemented. Showcase the core functionality with proper navigation, user interaction, and database connectivity where applicable. Provide screenshots, demo videos, or a live link. Explain any challenges faced during development and how they were addressed. Also, share testing strategies or initial test results if available.",
    status: "Pending",
  },
  {
    id: 4,
    title: "Phase 4 - Final Evaluation",
    description: "Submit the complete project with all features fully implemented and thoroughly tested. Ensure the final deliverable includes clean, well-documented code and a professional user interface. Provide a detailed project report covering system design, implementation details, results, challenges, and future scope. Include a deployment guide or installation manual to help evaluators run your project without issues.",
    status: "Pending",
  },
];


const Tasks = () => {
  const [phases, setPhases] = useState(initialPhases);
  const [openTaskIndex, setOpenTaskIndex] = useState(-1);
  const handleComplete = (idx : number) => {
    const updated = [...phases];
    updated[idx].status = "Completed";
    setPhases(updated);
    setOpenTaskIndex(-1); 
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Page Title */}
      <header className="relative py-8 px-4 mb-5 bg-gradient-to-br from-background via-muted/30 to-background">
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
                Assigned Tasks
              </span>
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full animate-scale-in" style={{animationDelay: '0.4s'}}></div>
          </div>
          
        </div>
      </header>
      {/* Progress Tracker */}
      <div className="flex justify-between items-center relative mb-16 max-w-4xl mx-auto">
        {phases.map((phase, idx) => (
          <div key={phase.id} className="flex flex-col items-center flex-1">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.2 }}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md border-2 ${phase.status === "Completed"? "bg-primary text-primary-foreground border-primary animate-pulse-glow": "bg-muted text-foreground border-border"}`}
            >
              {phase.status === "Completed" ? (<CheckCircle className="w-6 h-6" />) : (<span className="font-bold">{idx + 1}</span>)}
            </motion.div>
            <p className="mt-3 text-sm font-medium text-center text-muted-foreground">{phase.title}</p>
          </div>
        ))}
      </div>

      {/* Task Cards */}
      <div className="flex flex-wrap items-center justify-evenly max-w-5xl mx-auto">
        {phases.map((phase, idx) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.3 }}
            className={`p-6 sm:w-[40%] h-full rounded-2xl shadow-lg border mt-5 transition-all duration-500 hover:scale-[1.02] ${phase.status === "Completed"? "bg-card border-primary/60 shadow-primary/50": "bg-card border-border hover:shadow-secondary/40"}`}
          >
            {/* Card Header */}
            <div className="flex items-center gap-3 mb-4">
              <ClipboardList className={`${phase.status === "Completed" ? "text-primary" : "text-secondary"}`} size={22}/>
              <h2 className="text-lg font-semibold">{phase.title}</h2>
            </div>

            {/* Task */}
            <p className="text-sm mb-6">{phase.description.length >= 50? phase.description.slice(0, 50) + ".....": phase.description}</p>

            {/* Footer */}
            <div className="flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${phase.status === "Completed"? "bg-primary/20 text-primary": "bg-accent/20 text-accent animate-pulse"}`}>{phase.status}</span>

              {phase.status === "Completed" ? (
                <button disabled className="flex items-center gap-2 px-3 py-1 rounded-full text-sm border bg-muted text-muted-foreground cursor-not-allowed shadow-md"><CheckCircle size={14} /> Reviewed</button>) : (
                <button className="flex items-center gap-2 px-3 py-1 rounded-full text-sm  transition-all duration-300 shadow-md bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow"onClick={() => setOpenTaskIndex(idx)}> View more <ChevronRight size={16} /></button>
              )}
            </div>
          </motion.div>
        ))}
      </div>


      {/* Modal */}
      {openTaskIndex !== -1 && (
        <div className="fixed z-50 inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gradient-to-br from-card to-card/90 rounded-3xl shadow-2xl max-w-lg w-full p-8 border border-border/40"
          >
            {/* Close button */}
            <button onClick={() => setOpenTaskIndex(-1)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"><X size={24} /></button>

            {/* Modal Content */}
            <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{phases[openTaskIndex].title}</h2>

            <p className="text-base leading-relaxed text-muted-foreground mb-8 text-justify"> ✨ {phases[openTaskIndex].description}</p>

            <div className="border-t border-border/30 my-6"></div>

            {/* Complete Button */}
            <button onClick={() => handleComplete(openTaskIndex)} className="sm:w-[70%] mx-auto flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-primary text-primary-foreground font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"><CheckCircle size={20} />Completed, Please Verify</button>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default Tasks;
