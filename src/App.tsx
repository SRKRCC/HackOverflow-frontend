import Navbar from './components/Navbar'
import './App.css'
import HeroSection from './components/HeroSection'
import Gallery from './components/Gallery';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <HeroSection />
          </>
        } />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </Router>
  );
}

export default App
