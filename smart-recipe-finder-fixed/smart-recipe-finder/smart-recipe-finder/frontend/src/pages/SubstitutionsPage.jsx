import { useState, useEffect, useRef } from 'react';
import { Search, Shuffle, Leaf, Star, ArrowRight } from 'lucide-react';
import { getSubstitution, getAllSubstitutions } from '../utils/api';
import './SubstitutionsPage.css';

const COMMON = ['butter', 'eggs', 'milk', 'sugar', 'all-purpose flour', 'heavy cream', 'olive oil', 'sour cream'];

export default function SubstitutionsPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(undefined); // undefined = not searched, null = no result
  const [allSubs, setAllSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIngredient, setActiveIngredient] = useState('');

  useEffect(() => {
    getAllSubstitutions()
      .then(r => setAllSubs(r.data.data || []))
      .catch(() => {});
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const term = query.trim();
    if (!term) return;
    doSearch(term);
  };

  const doSearch = async (term) => {
    setLoading(true);
    setActiveIngredient(term);
    setResult(undefined);
    try {
      const res = await getSubstitution(term);
      setResult(res.data.data || null);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const quickSearch = (ingredient) => {
    setQuery(ingredient);
    doSearch(ingredient);
  };

  const clearSearch = () => {
    setResult(undefined);
    setQuery('');
    setActiveIngredient('');
  };

  return (
    <div className="sub-page">
      {/* HERO */}
      <div className="sub-page__hero">
        <div className="container">
          <span className="sub-eyebrow">Smart Tool</span>
          <h1 className="sub-page__title">
            Ingredient<br /><em>Substitutions</em>
          </h1>
          <p className="sub-page__intro">
            Missing an ingredient? Find taste-perfect or nutrition-matched alternatives
            instantly. Cook freely, adapt confidently.
          </p>
          <form className="sub-page__form" onSubmit={handleSearch}>
            <div className="sub-page__input">
              <Search size={18} />
              <input
                type="text"
                placeholder="Type an ingredient e.g. butter, eggs, sugar..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoComplete="off"
              />
            </div>
            <button type="submit" className="btn btn-terracotta">Find Substitutes</button>
          </form>
          <div className="sub-page__quick">
            <span>Quick search:</span>
            {COMMON.map(c => (
              <button
                key={c}
                onClick={() => quickSearch(c)}
                className={`sub-quick-tag ${activeIngredient === c ? 'sub-quick-tag--active' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS AREA */}
      <div className="sub-page__content container">

        {/* LOADING */}
        {loading && (
          <div className="sub-loading">
            <div className="spinner" />
            <p>Finding substitutes for <strong>{activeIngredient}</strong>...</p>
          </div>
        )}

        {/* NO RESULT */}
        {!loading && result === null && (
          <div className="sub-no-result">
            <Shuffle size={48} />
            <h3>No substitutions found</h3>
            <p>We don't have substitutions for <strong>"{activeIngredient}"</strong> yet.</p>
            <button className="btn btn-outline" onClick={clearSearch}>← Back to all substitutions</button>
          </div>
        )}

        {/* RESULT FOUND */}
        {!loading && result && (
          <div className="sub-result">
            <div className="sub-result__header">
              <div className="sub-result__header-left">
                <Shuffle size={22} />
                <div>
                  <h2>Substitutes for <em>{result.ingredient}</em></h2>
                  <p>{(result.tasteBased?.length || 0) + (result.nutritionBased?.length || 0)} alternatives found</p>
                </div>
              </div>
              <button className="btn btn-outline sub-back-btn" onClick={clearSearch}>
                ← All substitutions
              </button>
            </div>

            <div className="sub-result__columns">
              {/* TASTE BASED */}
              <div className="sub-result__col">
                <div className="sub-col-header">
                  <div className="sub-col-icon sub-col-icon--taste"><Leaf size={16} /></div>
                  <div>
                    <h3>Taste-Based Alternatives</h3>
                    <p>Swap without changing the flavour of your dish.</p>
                  </div>
                </div>
                <div className="sub-cards">
                  {result.tasteBased?.length > 0 ? result.tasteBased.map((s, i) => (
                    <div key={i} className="sub-card">
                      <div className="sub-card__top">
                        <h4>{s.name}</h4>
                        <span className="sub-card__ratio">{s.ratio}</span>
                      </div>
                      {s.notes && <p className="sub-card__note">{s.notes}</p>}
                    </div>
                  )) : <p className="sub-empty-col">No taste-based substitutes listed.</p>}
                </div>
              </div>

              {/* NUTRITION BASED */}
              <div className="sub-result__col">
                <div className="sub-col-header">
                  <div className="sub-col-icon sub-col-icon--nutrition"><Star size={16} /></div>
                  <div>
                    <h3>Nutrition-Based Alternatives</h3>
                    <p>Match the macro or caloric profile of the original.</p>
                  </div>
                </div>
                <div className="sub-cards">
                  {result.nutritionBased?.length > 0 ? result.nutritionBased.map((s, i) => (
                    <div key={i} className="sub-card sub-card--nutrition">
                      <div className="sub-card__top">
                        <h4>{s.name}</h4>
                        <span className="sub-card__ratio">{s.ratio}</span>
                      </div>
                      <div className="sub-card__macros">
                        {s.calories !== undefined && <span className="sub-macro sub-macro--cal">{s.calories} kcal</span>}
                        {s.protein > 0 && <span className="sub-macro sub-macro--pro">{s.protein}g protein</span>}
                      </div>
                      {s.notes && <p className="sub-card__note">{s.notes}</p>}
                    </div>
                  )) : <p className="sub-empty-col">No nutrition-based substitutes listed.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ALL SUBSTITUTIONS GRID — shown only when not searching */}
        {!loading && result === undefined && (
          <div className="all-subs">
            <div className="all-subs__header">
              <span className="sub-eyebrow">Complete Library</span>
              <h2 className="all-subs__title">All <em>Substitutions</em></h2>
              <p>Browse our complete ingredient substitution database. Click any to explore alternatives.</p>
            </div>
            {allSubs.length === 0 ? (
              <div className="sub-loading"><div className="spinner" /></div>
            ) : (
              <div className="all-subs__grid">
                {allSubs.map((sub, i) => (
                  <button
                    key={sub._id}
                    className="all-subs__card"
                    onClick={() => quickSearch(sub.ingredient)}
                  >
                    <span className="all-subs__name">{sub.ingredient}</span>
                    <span className="all-subs__count">
                      {(sub.tasteBased?.length || 0) + (sub.nutritionBased?.length || 0)} alternatives
                    </span>
                    <span className="all-subs__arrow"><ArrowRight size={14} /></span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
