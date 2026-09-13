import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const scrollToHash = () => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 90;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      };

      scrollToHash();
      const timer = setTimeout(scrollToHash, 150);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
