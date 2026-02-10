import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Force scroll to top synchronously before browser paint
    document.documentElement.scrollTo(0, 0);
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
};
