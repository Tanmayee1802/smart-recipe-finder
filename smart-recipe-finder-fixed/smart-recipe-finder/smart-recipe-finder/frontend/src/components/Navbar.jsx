import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChefHat } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const navClass = `navbar ${scrolled || !isHome ? 'navbar--scrolled' : ''} ${menuOpen ? 'navbar--open' : ''}`;

  return (
    <header className={navClass}>
      <nav className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <ChefHat size={20} />
          <span>Saffron & Sage</span>
        </Link>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/search">Discover</Link></li>
          <li><Link to="/add-recipe">Add Recipe</Link></li>
          <li><Link to="/substitutions">Substitutions</Link></li>
        </ul>

        <div className="navbar__actions">
          <button className="navbar__icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
            {searchOpen ? <X size={18} /> : <Search size={18} />}
          </button>
          <Link to="/add-recipe" className="navbar__cta btn btn-primary">
            Add Recipe
          </Link>
          <button className="navbar__mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {searchOpen && (
        <div className="navbar__search-bar">
          <form onSubmit={handleSearch} className="navbar__search-form">
            <Search size={16} className="navbar__search-icon" />
            <input
              type="text"
              placeholder="Search recipes, ingredients, cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      )}
    </header>
  );
}
