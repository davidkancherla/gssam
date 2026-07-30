import { useCallback, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Sermons from '@/pages/Sermons';
import Events from '@/pages/Events';
import Ministries from '@/pages/Ministries';
import Give from '@/pages/Give';
import Contact from '@/pages/Contact';

const PAGES = ['home', 'about', 'sermons', 'events', 'ministries', 'give', 'contact'] as const;
type Page = (typeof PAGES)[number];

function pageFromHash(): Page {
  const h = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  return (PAGES as readonly string[]).includes(h) ? (h as Page) : 'home';
}

export default function App() {
  const [page, setPage] = useState<Page>(pageFromHash);

  const navigate = useCallback((p: string) => {
    const target = (PAGES as readonly string[]).includes(p) ? (p as Page) : 'home';
    window.location.hash = target === 'home' ? '/' : `/${target}`;
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  useEffect(() => {
    const onHash = () => {
      setPage(pageFromHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[70] focus:bg-saffron focus:text-maroon-deep focus:px-4 focus:py-2 focus:font-semibold"
      >
        Skip to main content
      </a>
      <Navbar page={page} navigate={navigate} />
      <main id="main" className="flex-1">
        {page === 'home' && <Home navigate={navigate} />}
        {page === 'about' && <About />}
        {page === 'sermons' && <Sermons />}
        {page === 'events' && <Events />}
        {page === 'ministries' && <Ministries navigate={navigate} />}
        {page === 'give' && <Give />}
        {page === 'contact' && <Contact />}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}
