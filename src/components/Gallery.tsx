import React, { useState } from 'react';
import './Gallery.css';
import { Zap, Trophy, Calendar, Home, X, Download } from 'lucide-react';

const images = [
  '/HS1.webp',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1465101178521-c1a4c8a0a8b7',
];

const formats = ['png', 'jpg', 'webp', 'svg'];

const Gallery: React.FC = () => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const handleDownload = (img: string, format: string) => {
    // For demo: just download the original image
    const link = document.createElement('a');
    link.href = img;
    link.download = `gallery-image.${format}`;
    link.click();
  };

  return (
    <div className="gallery-page">
      <header className="gallery-header">
        <div className="gallery-logo-wrap">
          <Zap className="gallery-zap" />
          <h1 className="gallery-brand">HackOverflow <span className="accent">2k25</span></h1>
        </div>
        <nav className="gallery-nav">
          <a href="/" className="nav-btn"><Home className="nav-icon" /> Home</a>
          <a href="#schedule" className="nav-btn"><Calendar className="nav-icon" /> Schedule</a>
          <a href="/gallery" className="nav-btn"><Trophy className="nav-icon" /> Gallery</a>
          <a href="#prizes" className="nav-btn"><Trophy className="nav-icon" /> Prizes</a>
        </nav>
        <div className="gallery-actions">
          <button className="login-btn">Login</button>
          <button className="register-btn">Register Now</button>
        </div>
      </header>
      <main className="gallery-main">
        {/* Abstract background shapes */}
        <div className="gallery-bg-shapes">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
          <div className="bg-diamond bg-diamond-1"></div>
        </div>
        <h1 className="gallery-title">Gallery</h1>
        <div
          className="gallery-grid"
          style={{
            gridTemplateColumns: `repeat(${images.length < 3 ? images.length : images.length < 5 ? 2 : images.length < 9 ? 3 : 4}, minmax(220px, 1fr))`
          }}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className="gallery-img-card"
              onClick={() => setSelectedImg(img)}
            >
              <img src={img} alt={`Gallery ${idx + 1}`} className="gallery-img" />
            </div>
          ))}
        </div>
        {selectedImg && (
          <div className="gallery-modal" onClick={() => setSelectedImg(null)}>
            <div className="gallery-modal-content" onClick={e => e.stopPropagation()}>
              <div className="gallery-modal-imgbox">
                <img src={selectedImg} alt="Enlarged" className="gallery-modal-img" />
                <div className="gallery-modal-actions">
                  <button className="download-icon-btn" onClick={() => handleDownload(selectedImg, 'jpg')} title="Download">
                    <Download size={24} />
                  </button>
                  <button className="gallery-modal-x" onClick={() => setSelectedImg(null)} title="Close">
                    <X size={28} />
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
