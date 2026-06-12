import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Clock, Star, ChefHat, Leaf, Shuffle } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import { useMultiReveal } from '../utils/useScrollReveal';
import './Home.css';

const CATEGORIES = [
  { name: 'Breakfast', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop' },
  { name: 'Lunch',     img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop' },
  { name: 'Dinner',   img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500&auto=format&fit=crop' },
  { name: 'Dessert',  img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop' },
  { name: 'Snack',    img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop' },
  { name: 'Beverage', img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop' },
];

const STATS = [
  { value: '500+', label: 'Recipes' },
  { value: '50+',  label: 'Cuisines' },
  { value: '200+', label: 'Substitutions' },
  { value: '100%', label: 'Free to use' },
];

export default function Home() {
  const navigate = useNavigate();
  const { featured, loading, fetchFeatured } = useRecipes();
  const [searchQuery, setSearchQuery] = useState('');
  const [heroOffset, setHeroOffset]   = useState(0);
  const [topVisible, setTopVisible]   = useState(false);
  const [botVisible, setBotVisible]   = useState(false);
  const heroRef    = useRef(null);
  const topRef     = useRef(null);   // ref for featured cards group
  const botRef     = useRef(null);   // ref for recently added cards group
  const revealRef  = useMultiReveal(featured.length);

  useEffect(() => { fetchFeatured(); }, [fetchFeatured]);

  // Watch card groups — animate ONLY when scrolled into view
  useEffect(() => {
    if (featured.length === 0) return;

    const observe = (ref, setter) => {
      if (!ref.current) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setter(true);
            obs.disconnect();
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
      );
      obs.observe(ref.current);
      return obs;
    };

    // Small delay so refs are attached after render
    const timer = setTimeout(() => {
      const o1 = observe(topRef, setTopVisible);
      const o2 = observe(botRef, setBotVisible);
      return () => { o1?.disconnect(); o2?.disconnect(); };
    }, 80);

    return () => clearTimeout(timer);
  }, [featured.length]);

  // Smooth parallax
  useEffect(() => {
    let rafId, current = 0, target = 0;
    const onScroll = () => { target = window.scrollY * 0.38; };
    const tick = () => {
      current += (target - current) * 0.1;
      setHeroOffset(Math.abs(target - current) > 0.1 ? current : target);
      rafId = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId); };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <main className="home" ref={revealRef} style={{ paddingTop: 0 }}>

      {/* ── HERO ── */}
      <section className="hero" ref={heroRef}>
        <div className="hero__bg" style={{ transform: `translate3d(0,${heroOffset}px,0)` }} />
        <div className="hero__overlay" />
        <div className="hero__content">
          <p className="hero__eyebrow">Smart Recipe Finder</p>
          <h1 className="hero__title">
            Discover the Art<br /><em>of Cooking</em>
          </h1>
          <p className="hero__subtitle">
            Explore thousands of recipes, find smart ingredient substitutions,<br />
            and bring extraordinary meals to your table.
          </p>
          <form className="hero__search" onSubmit={handleSearch}>
            <div className="hero__search-inner">
              <Search size={18} className="hero__search-icon" />
              <input type="text" placeholder="Search recipes, ingredients, cuisines..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <button type="submit" className="btn btn-terracotta">Search</button>
            </div>
          </form>
          <div className="hero__quick-links">
            {['Italian','Thai','Moroccan','Fusion','Japanese'].map(c => (
              <button key={c} onClick={() => navigate(`/search?cuisine=${c}`)} className="hero__quick-tag">{c}</button>
            ))}
          </div>
        </div>
        <div className="hero__scroll-indicator">
          <span>Scroll</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-bar__inner">
            {STATS.map((s,i) => (
              <div key={i} className="stats-bar__item reveal" style={{ transitionDelay:`${i*0.1}s` }}>
                <span className="stats-bar__value">{s.value}</span>
                <span className="stats-bar__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="section featured-section">
        <div className="container">
          <div className="section__header reveal">
            <span className="section__eyebrow">Curated Collection</span>
            <h2 className="section__title">Featured <em>Recipes</em></h2>
            <p className="section__desc">Handpicked dishes that bring the world's finest flavours to your kitchen.</p>
          </div>

          {loading ? (
            <div className="recipes-grid">
              {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
            </div>
          ) : featured.length > 0 ? (
            <div ref={topRef} className={`recipes-grid cards-group ${topVisible ? 'cards-group--visible' : ''}`}>
              {featured.slice(0,3).map((r,i) => (
                <div key={r._id} className="card-stagger" style={{ '--idx': i }}>
                  <RecipeCard recipe={r} />
                </div>
              ))}
            </div>
          ) : null}

          <div className="section__cta reveal">
            <Link to="/search" className="btn btn-outline">View All Recipes <ArrowRight size={16}/></Link>
          </div>
        </div>
      </section>

      {/* ── EDITORIAL ── */}
      <section className="editorial">
        <div className="editorial__image-side">
          <img src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=900&auto=format&fit=crop" alt="Ingredients" />
        </div>
        <div className="editorial__content">
          <span className="section__eyebrow reveal-right">The Philosophy</span>
          <h2 className="editorial__title reveal-right" style={{transitionDelay:'0.1s'}}>
            Every Ingredient<br /><em>Has a Story</em>
          </h2>
          <p className="editorial__text reveal-right" style={{transitionDelay:'0.2s'}}>
            Great cooking begins with understanding your ingredients — their flavours,
            their textures, their origins. Whether you're substituting due to dietary
            needs or simply exploring new tastes, our smart substitution tool helps you cook with confidence.
          </p>
          <div className="editorial__features reveal-right" style={{transitionDelay:'0.3s'}}>
            <div className="editorial__feature">
              <Leaf size={18} className="editorial__feature-icon"/>
              <div>
                <h4>Taste-Based Substitutions</h4>
                <p>Swap ingredients while keeping the flavour profile you love.</p>
              </div>
            </div>
            <div className="editorial__feature">
              <Star size={18} className="editorial__feature-icon"/>
              <div>
                <h4>Nutrition-Based Alternatives</h4>
                <p>Find substitutes that match the nutritional value of any ingredient.</p>
              </div>
            </div>
          </div>
          <Link to="/substitutions" className="btn btn-primary reveal-right" style={{transitionDelay:'0.4s'}}>
            Try Substitutions <Shuffle size={16}/>
          </Link>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section categories-section">
        <div className="container">
          <div className="section__header reveal">
            <span className="section__eyebrow">Browse By Type</span>
            <h2 className="section__title">What are you <em>craving?</em></h2>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat,i) => (
              <Link key={cat.name} to={`/search?category=${cat.name}`}
                className="category-card reveal" style={{transitionDelay:`${i*0.08}s`}}>
                <img src={cat.img} alt={cat.name} />
                <div className="category-card__overlay" />
                <div className="category-card__content">
                  <span className="category-card__name">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section__header reveal">
            <span className="section__eyebrow">Simple Process</span>
            <h2 className="section__title">How It <em>Works</em></h2>
          </div>
          <div className="how-it-works__steps">
            {[
              { num:'01', icon:<Search size={28}/>,    title:'Search a Recipe',    desc:'Search by name, ingredients, cuisine, or difficulty level.' },
              { num:'02', icon:<ChefHat size={28}/>,   title:'Follow the Steps',   desc:'Detailed cooking instructions with ingredient lists and prep times.' },
              { num:'03', icon:<Shuffle size={28}/>,   title:'Substitute Freely',  desc:'Missing an ingredient? Get taste or nutrition-based alternatives instantly.' },
              { num:'04', icon:<Star size={28}/>,      title:'Share & Enjoy',      desc:'Add your own recipes, rate dishes, and build your recipe collection.' },
            ].map((step,i) => (
              <div key={i} className="how-it-works__step reveal" style={{transitionDelay:`${i*0.12}s`}}>
                <span className="how-it-works__num">{step.num}</span>
                <div className="how-it-works__icon">{step.icon}</div>
                <h3 className="how-it-works__title">{step.title}</h3>
                <p className="how-it-works__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENTLY ADDED ── */}
      <section className="section">
        <div className="container">
          <div className="section__header reveal">
            <span className="section__eyebrow">More Discoveries</span>
            <h2 className="section__title">Recently <em>Added</em></h2>
          </div>
          {loading && (
            <div className="recipes-grid">
              {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
            </div>
          )}
          {!loading && featured.length > 3 && (
            <div ref={botRef} className={`recipes-grid cards-group ${botVisible ? 'cards-group--visible' : ''}`}>
              {featured.slice(3,6).map((r,i) => (
                <div key={r._id} className="card-stagger" style={{ '--idx': i }}>
                  <RecipeCard recipe={r} />
                </div>
              ))}
            </div>
          )}
          <div className="section__cta reveal">
            <Link to="/search" className="btn btn-outline">Explore All Recipes <ArrowRight size={16}/></Link>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="cta-banner__bg" />
        <div className="container cta-banner__inner">
          <h2 className="cta-banner__title reveal">Share Your <em>Culinary Story</em></h2>
          <p className="cta-banner__text reveal" style={{transitionDelay:'0.1s'}}>
            Have a recipe that deserves to be discovered? Add it to our growing collection and inspire home cooks everywhere.
          </p>
          <div className="reveal" style={{transitionDelay:'0.2s'}}>
            <Link to="/add-recipe" className="btn btn-terracotta">Add Your Recipe <ArrowRight size={16}/></Link>
          </div>
        </div>
      </section>

    </main>
  );
}
