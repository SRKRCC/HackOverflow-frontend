import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import Navbar from '../Navbar';

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
      <Navbar />
      <main className="pt-16 px-8 pb-8">
        {loading && (
          <div className="page-loader">
            <div className="loader-spinner"></div>
          </div>
        )}
        {/* Abstract background shapes */}
        {/* Abstract background shapes */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute rounded-full opacity-20 bg-amber-500 w-44 h-44 top-10 left-16"></div>
          <div className="absolute rounded-full opacity-20 bg-blue-500 w-32 h-32 top-80 right-20"></div>
          <div className="absolute rounded-full opacity-20 bg-amber-500 w-20 h-20 bottom-20 right-32"></div>
          <div className="absolute bg-blue-500 opacity-10 w-24 h-24 bottom-10 left-20 rotate-45"></div>
        </div>
  <h1 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-[#d18a00] via-[#d18a00] to-[#6a7fd1] bg-clip-text text-transparent drop-shadow-lg transition-all duration-500">Gallery</h1>
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
