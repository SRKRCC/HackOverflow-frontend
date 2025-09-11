import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

const images = [
  'https://www.gstatic.com/webp/gallery/1.webp',
  'https://www.gstatic.com/webp/gallery/2.webp',
  'https://www.gstatic.com/webp/gallery/3.webp',
  'https://www.gstatic.com/webp/gallery/4.webp',
  'https://www.gstatic.com/webp/gallery/5.webp',
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
    <div className="bg-white min-h-screen font-inter relative">
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
                    Gallery
                  </span>
                </h1>
                
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full animate-scale-in" style={{animationDelay: '0.4s'}}></div>
              </div>
              
            </div>
        </header>
      {/*<Navbar />*/}
      <main className="pt-16 px-8 pb-8">
        {loading && (
          <div className="page-loader">
            <div className="loader-spinner"></div>
          </div>
        )}
        {/* Abstract background shapes */}
        {/* Abstract background shapes */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* <div className="absolute rounded-full opacity-20  bg-amber-500 w-44 h-44 top-10 left-16"></div> */}
          <div className="absolute rounded-full opacity-20 bg-blue-500 w-32 h-32 top-80 right-20"></div>
          <div className="absolute rounded-full opacity-20 bg-amber-500 w-20 h-20 bottom-20 right-32"></div>
          <div className="absolute bg-blue-500 opacity-10 w-24 h-24 bottom-10 left-20 rotate-45"></div>
        </div>
        
        <div
          className={`grid gap-8 z-10 relative ${images.length < 3 ? 'grid-cols-1' : images.length < 5 ? 'grid-cols-2' : images.length < 9 ? 'grid-cols-3' : 'grid-cols-4'} transition-all duration-500`}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer flex items-center justify-center min-h-[220px] transition-transform duration-300 hover:scale-105 hover:shadow-primary"
              onClick={() => setSelectedImg(img)}
            >
              <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-52 object-cover rounded-xl transition-all duration-500" loading="lazy" />
            </div>
          ))}
        </div>
        {selectedImg && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-500" onClick={() => setSelectedImg(null)}>
            <div className="bg-white rounded-3xl p-6 shadow-2xl relative flex flex-col items-center transition-all duration-500" onClick={e => e.stopPropagation()}>
              <div className="relative">
                <img src={selectedImg} alt="Enlarged" className="max-w-[480px] max-h-[60vh] rounded-xl shadow-lg transition-all duration-500" loading="lazy" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button className="bg-gradient-to-r from-primary to-secondary text-white rounded-full p-2 shadow hover:from-secondary hover:to-primary transition-all duration-300" onClick={() => handleDownload(selectedImg, 'jpg')} title="Download">
                    <Download size={18} />
                  </button>
                  <button className="bg-white text-red-500 border border-red-200 rounded-full p-2 shadow hover:bg-red-500 hover:text-white transition-all duration-300" onClick={() => setSelectedImg(null)} title="Close">
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Gallery;
