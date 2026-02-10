import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Terminal } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { motion } from 'framer-motion';
import { Terminal as TerminalComponent } from './Terminal';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isAboutSectionVisible, setIsAboutSectionVisible] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // Track navigation changes to disable animation
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Scroll detection for About section on Home page
  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById('about');
      const aboutEndSection = document.getElementById('about-end');
      
      if (aboutSection && aboutEndSection && (location.pathname === '/' || location.hash === '#/')) {
        const navbarHeight = 64;
        const aboutRect = aboutSection.getBoundingClientRect();
        const aboutEndRect = aboutEndSection.getBoundingClientRect();
        
        // About is active when we've scrolled past the start of the about section
        // and before we reach the about-end section
        const isPastAboutStart = aboutRect.top <= navbarHeight;
        const isBeforeAboutEnd = aboutEndRect.top > navbarHeight;
        
        setIsAboutSectionVisible(isPastAboutStart && isBeforeAboutEnd);
      } else {
        setIsAboutSectionVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const isActive = (path: string, isAbout: boolean = false) => {
    if (isAbout) {
      // About is active when on home page and scrolled to about section
      return isAboutSectionVisible;
    }
    return location.pathname === path || location.hash === `#${path}`;
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/' || location.hash === '#/') {
      // Already on home page, scroll to about section with offset for navbar
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        const navbarHeight = 64; // h-16 = 4rem = 64px
        const elementPosition = aboutSection.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      // Navigate to home and scroll to about section
      navigate('/');
      setTimeout(() => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          const navbarHeight = 64;
          const elementPosition = aboutSection.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navbarHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Immediately scroll to top
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    navigate('/');
  };

  const navItems = [
    { path: '/', label: 'Home', isAbout: false, isHome: true, onClick: handleHomeClick },
    { path: '#about', label: 'About', isAbout: true, onClick: handleAboutClick },
    { path: '/projects', label: 'Projects', isAbout: false },
    { path: '/publications', label: 'Publications', isAbout: false },
    { path: '/awards', label: 'Awards', isAbout: false },
    { path: '/contact', label: 'Contact', isAbout: false },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex items-center h-16">
          {/* Logo/Name - Expands on Hover */}
          <Link 
            to="/" 
            onClick={handleHomeClick}
            className="group ml-16"
          >
            <span className="text-xl font-bold text-text-light dark:text-text-dark group-hover:text-primary dark:group-hover:text-primary-dark transition-colors duration-200 whitespace-nowrap inline-flex items-baseline">
              <span>M</span>
              <span className="overflow-hidden inline-block max-w-0 opacity-0 group-hover:max-w-[3.5rem] group-hover:opacity-100 transition-all duration-500 ease-out">
                usab
              </span>
              <span className="inline-block w-0 opacity-0 group-hover:w-2 group-hover:opacity-100 transition-all duration-500">&nbsp;</span>
              <span>A</span>
              <span className="overflow-hidden inline-block max-w-0 opacity-0 group-hover:max-w-[3.5rem] group-hover:opacity-100 transition-all duration-500 ease-out delay-75">
                hmed
              </span>
              <span className="inline-block w-0 opacity-0 group-hover:w-2 group-hover:opacity-100 transition-all duration-500 delay-75">&nbsp;</span>
              <span>K</span>
              <span className="overflow-hidden inline-block max-w-0 opacity-0 group-hover:max-w-[3rem] group-hover:opacity-100 transition-all duration-500 ease-out delay-150">
                han
              </span>
            </span>
          </Link>

          {/* Spacer */}
          <div className="flex-grow"></div>

          {/* Nav Links */}
          <div className="flex items-center space-x-8 mr-8">
            {navItems.map((item) => (
              item.isAbout || item.isHome ? (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={item.onClick}
                  className="relative text-sm font-medium text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors cursor-pointer"
                >
                  {item.label}
                  {isActive(item.path, item.isAbout) && !isNavigating && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary dark:bg-primary-dark"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      initial={false}
                    />
                  )}
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative text-sm font-medium text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors"
                >
                  {item.label}
                  {isActive(item.path, item.isAbout) && !isNavigating && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary dark:bg-primary-dark"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      initial={false}
                    />
                  )}
                </Link>
              )
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
              aria-label="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-muted-light" />
                ) : (
                  <Sun className="w-5 h-5 text-muted-dark" />
                )}
              </motion.div>
            </button>

            {/* Terminal Toggle (to the right of theme) */}
            <button
              onClick={() => setIsTerminalOpen(!isTerminalOpen)}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
              aria-label="Toggle terminal"
            >
              <Terminal className={`w-5 h-5 ${isTerminalOpen ? 'text-primary dark:text-primary-dark' : 'text-muted-light dark:text-muted-dark'}`} />
            </button>
          </div>
        </div>
      </div>
      <TerminalComponent isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
    </nav>
  );
};
