import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

const images = [
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
];

const Gallery: React.FC = () => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = (img: string, format: string) => {
    const link = document.createElement('a');
    link.href = img;
    link.download = `gallery-image.${format}`;
    link.click();
  };

  return (
    <div className="bg-background min-h-screen font-inter relative transition-colors duration-300">
      <header className="relative py-8 mb-5 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
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
                Gallery
              </span>
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full animate-scale-in" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </header>

      <main className="px-4 md:px-8 pb-12 max-w-7xl mx-auto">
        {loading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="relative z-10">
          <div className={`
            grid gap-4 md:gap-6 
            ${images.length <= 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' : 
              images.length <= 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' : 
              'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} 
            transition-all duration-500
          `}>
            {images.map((img, idx) => (
              <div
                key={idx}
                className="group relative bg-card rounded-xl shadow-lg border border-border overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-primary/30 animate-fade-in"
                style={{animationDelay: `${idx * 100}ms`}}
                onClick={() => setSelectedImg(img)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={img} 
                    alt={`Gallery ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    loading="lazy" 
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {selectedImg && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-lg flex items-center justify-center z-50 p-4 transition-all duration-300" 
            onClick={() => setSelectedImg(null)}
          >
            <div 
              className="bg-card rounded-2xl p-4 md:p-6 shadow-2xl border border-border relative max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in" 
              onClick={e => e.stopPropagation()}
            >
              <div className="relative">
                <img 
                  src={selectedImg} 
                  alt="Enlarged" 
                  className="max-w-full max-h-[70vh] rounded-lg object-contain mx-auto" 
                  loading="lazy" 
                />
                
                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button 
                    className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105" 
                    onClick={() => handleDownload(selectedImg, 'jpg')} 
                    title="Download"
                  >
                    <Download size={18} />
                  </button>
                  <button 
                    className="bg-card border border-border text-foreground rounded-full p-2 shadow-lg hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-300 hover:scale-105" 
                    onClick={() => setSelectedImg(null)} 
                    title="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Decorative elements - using theme colors */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute rounded-full bg-primary/10 w-32 h-32 top-20 left-10 animate-float"></div>
          <div className="absolute rounded-full bg-secondary/10 w-24 h-24 top-60 right-16 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute rounded-full bg-accent/10 w-16 h-16 bottom-32 right-20 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bg-primary/5 w-20 h-20 bottom-16 left-16 rotate-45 animate-pulse"></div>
        </div>
      </main>
    </div>
  );
};

export default Gallery;