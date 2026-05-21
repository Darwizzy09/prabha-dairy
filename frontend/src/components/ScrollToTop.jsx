import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Whenever the pathname changes, scroll to the absolute top-left of the window
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component doesn't actually render any HTML, it just does background work!
  return null; 
}