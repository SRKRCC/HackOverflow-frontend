import React, { useState, useEffect } from 'react';
import { X, Download, Loader2, ZoomIn } from 'lucide-react';
import { ApiService } from '@/lib/api';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  // ✅ Fetch images from API
  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.team.getTeamImages();

      // normalize response
      if (response) {
        setImages(response);
      } else if (Array.isArray(response)) {
        setImages(response);
      } else {
        setImages([]);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to load images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  // ✅ Proper download handler using fetch
  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      setDownloading(imageUrl);
      
      // Fetch the image as a blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `gallery-image-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="bg-background min-h-screen font-inter relative transition-colors duration-300">
      {/* ----------------- HEADER (unchanged) ----------------- */}
      <header className="relative py-8 mb-5 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/20 to-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-20 left-1/2 w-60 h-60 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-2xl animate-pulse-glow"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-12 h-1 bg-gradient-to-r from-transparent to-primary rounded-full animate-slide-in"></div>
              <div className="mx-4">
                <svg className="w-8 h-8 text-primary animate-scale-in" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div className="w-12 h-1 bg-gradient-to-l from-transparent to-secondary rounded-full animate-slide-in" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-4 animate-fade-in">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                Gallery
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full animate-scale-in" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </header>

      {/* ----------------- GALLERY SECTION ----------------- */}
      <main className="px-4 md:px-8 pb-12 max-w-7xl mx-auto relative z-10">
        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-muted-foreground font-medium">Loading gallery...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center mt-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <X className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-destructive font-medium">{error}</p>
            <button
              onClick={loadImages}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && images.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-muted-foreground font-medium">No images found in the gallery</p>
          </div>
        )}

        {/* Gallery Grid - Enhanced */}
        {!loading && images.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="group relative bg-card rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.03] animate-fade-in border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/10"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Image Container with Aspect Ratio */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {/* View Button */}
                    <button
                      onClick={() => setSelectedImg(img)}
                      className="bg-white/90 backdrop-blur-sm text-primary p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
                      title="View image"
                    >
                      <ZoomIn size={20} />
                    </button>
                    
                    {/* Download Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(img, idx);
                      }}
                      disabled={downloading === img}
                      className="bg-primary/90 backdrop-blur-sm text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Download image"
                    >
                      {downloading === img ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Download size={20} />
                      )}
                    </button>
                  </div>
                  
                  {/* Image Number Badge */}
                  <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    #{idx + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ----------------- MODAL - Enhanced ----------------- */}
        {selectedImg && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4 transition-all duration-300 animate-fade-in"
            onClick={() => setSelectedImg(null)}
          >
            <div
              className="relative max-w-6xl max-h-[90vh] animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={selectedImg}
                  alt="Enlarged"
                  className="max-w-full max-h-[85vh] rounded-2xl object-contain mx-auto"
                  loading="lazy"
                />
                
                {/* Action Buttons - Floating */}
                <div className="absolute top-4 right-4 flex gap-3">
                  <button
                    onClick={() => {
                      const index = images.indexOf(selectedImg);
                      handleDownload(selectedImg, index);
                    }}
                    disabled={downloading === selectedImg}
                    className="bg-primary/90 backdrop-blur-md text-primary-foreground rounded-full p-3 shadow-2xl hover:bg-primary hover:scale-110 transition-all duration-300 disabled:opacity-50"
                    title="Download"
                  >
                    {downloading === selectedImg ? (
                      <Loader2 size={22} className="animate-spin" />
                    ) : (
                      <Download size={22} />
                    )}
                  </button>
                  <button
                    className="bg-white/90 backdrop-blur-md text-foreground rounded-full p-3 shadow-2xl hover:bg-destructive hover:text-destructive-foreground hover:scale-110 transition-all duration-300"
                    onClick={() => setSelectedImg(null)}
                    title="Close"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Image Navigation */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                  {images.indexOf(selectedImg) + 1} / {images.length}
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