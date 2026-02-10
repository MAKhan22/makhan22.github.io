import { HashRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './components/ThemeProvider';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MouseGlow } from './components/MouseGlow';
import { ScrollToTop } from './components/ScrollToTop';
// import { EdgeVignette } from './components/EdgeVignette';
// Background animations (disabled for now, will revisit later)
// import { BackgroundCircuitBoard } from './components/BackgroundCircuitBoard';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { Publications } from './pages/Publications';
import { Awards } from './pages/Awards';
import { Contact } from './pages/Contact';

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="min-h-screen relative transition-colors duration-200 bg-white dark:bg-black overflow-x-hidden">
          {/* Mouse glow effect on background */}
          <MouseGlow />
          <div className="relative z-10 pt-16">
            <Navbar />
            <main>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/publications" element={<Publications />} />
                  <Route path="/awards" element={<Awards />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </AnimatePresence>
            </main>
            <Footer />
          </div>
        </div>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
