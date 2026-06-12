import { Link } from 'react-router-dom';
import { Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">

        {/* TOP — Logo left, tagline right */}
        <div className="footer__top">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-script">Saffron</span>
            <span className="footer__logo-divider">— & —</span>
            <span className="footer__logo-script">Sage</span>
          </Link>
          <p className="footer__tagline">
            Where every ingredient tells a story and every meal becomes a memory.
          </p>
        </div>

        {/* DIVIDER */}
        <div className="footer__divider" />

        {/* MIDDLE — Nav columns */}
        <nav className="footer__nav">
          <div className="footer__nav-col">
            <h5>Explore</h5>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/search">All Recipes</Link></li>
              <li><Link to="/search?category=Breakfast">Breakfast</Link></li>
              <li><Link to="/search?category=Dinner">Dinner</Link></li>
              <li><Link to="/search?category=Dessert">Desserts</Link></li>
            </ul>
          </div>
          <div className="footer__nav-col">
            <h5>Cuisines</h5>
            <ul>
              <li><Link to="/search?cuisine=Italian">Italian</Link></li>
              <li><Link to="/search?cuisine=Thai">Thai</Link></li>
              <li><Link to="/search?cuisine=Moroccan">Moroccan</Link></li>
              <li><Link to="/search?cuisine=French">French</Link></li>
              <li><Link to="/search?cuisine=Japanese">Japanese</Link></li>
            </ul>
          </div>
          <div className="footer__nav-col">
            <h5>Tools</h5>
            <ul>
              <li><Link to="/add-recipe">Add Recipe</Link></li>
              <li><Link to="/substitutions">Substitutions</Link></li>
              <li><Link to="/search?difficulty=Easy">Easy Recipes</Link></li>
              <li><Link to="/search?difficulty=Hard">Gourmet</Link></li>
            </ul>
          </div>
          <div className="footer__nav-col">
            <h5>Built With</h5>
            <ul>
              <li><span>React + Vite</span></li>
              <li><span>Node.js + Express</span></li>
              <li><span>MongoDB Atlas</span></li>
              <li><span>MERN Stack</span></li>
            </ul>
          </div>
        </nav>

        {/* BOTTOM — credits left, social right */}
        <div className="footer__bottom">
          <div className="footer__credits">
            <p>Smart Recipe Finder — Full Stack Web Project</p>
            <p>Tanmayee · Renu Sri · Karthik</p>
          </div>
          <div className="footer__social">
            <a href="#" aria-label="Instagram"><Instagram size={17} /></a>
            <a href="#" aria-label="YouTube"><Youtube size={17} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={17} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={17} /></a>
          </div>
        </div>

      </div>
    </footer>
  );
}
