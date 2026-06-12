import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, Users, ChefHat, Star, ArrowLeft, Shuffle, Edit, Trash2, Play, CheckCircle, Circle } from 'lucide-react';
import { getRecipeById, deleteRecipe, addReview, getSubstitution } from '../utils/api';
import { useScrollReveal, useMultiReveal } from '../utils/useScrollReveal';
import './RecipeDetail.css';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [substitution, setSubstitution] = useState(null);
  const [subIngredient, setSubIngredient] = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [review, setReview] = useState({ user: '', comment: '', rating: 5 });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('ingredients');
  const heroRef = useRef(null);
  const [heroOffset, setHeroOffset] = useState(0);
  const revealRef = useMultiReveal(activeTab + (recipe?._id || ''));

  useEffect(() => {
    loadRecipe();
  }, [id]);

  useEffect(() => {
    let rafId;
    let currentOffset = 0;
    let targetOffset = 0;
    const handleScroll = () => { targetOffset = window.scrollY * 0.35; };
    const animate = () => {
      currentOffset += (targetOffset - currentOffset) * 0.1;
      setHeroOffset(Math.abs(targetOffset - currentOffset) > 0.1 ? currentOffset : targetOffset);
      rafId = requestAnimationFrame(animate);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = requestAnimationFrame(animate);
    return () => { window.removeEventListener('scroll', handleScroll); cancelAnimationFrame(rafId); };
  }, []);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      const res = await getRecipeById(id);
      setRecipe(res.data.data);
    } catch (e) {
      navigate('/search');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this recipe?')) return;
    await deleteRecipe(id);
    navigate('/search');
  };

  const toggleStep = (num) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.has(num) ? next.delete(num) : next.add(num);
      return next;
    });
  };

  const handleSubstitution = async (e) => {
    e.preventDefault();
    if (!subIngredient.trim()) return;
    setSubLoading(true);
    setSubstitution(null);
    try {
      const res = await getSubstitution(subIngredient.trim());
      setSubstitution(res.data.data);
    } catch (e) {}
    setSubLoading(false);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!review.user.trim() || !review.comment.trim()) return;
    setReviewSubmitting(true);
    try {
      const res = await addReview(id, review);
      setRecipe(res.data.data);
      setReview({ user: '', comment: '', rating: 5 });
    } catch (e) {}
    setReviewSubmitting(false);
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'10rem' }}><div className="spinner" /></div>;
  if (!recipe) return null;

  const totalTime = recipe.prepTime + recipe.cookTime;
  const imageUrl = recipe.image || 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=1200';

  return (
    <div className="recipe-detail" ref={revealRef}>
      {/* HERO */}
      <div className="recipe-detail__hero" ref={heroRef}>
        <div className="recipe-detail__hero-bg" style={{ backgroundImage: `url(${imageUrl})`, transform: `translate3d(0, ${heroOffset}px, 0)` }} />
        <div className="recipe-detail__hero-overlay" />
        <div className="recipe-detail__hero-content">
          <Link to="/search" className="recipe-detail__back">
            <ArrowLeft size={16} /> Back to Recipes
          </Link>
          <div className="recipe-detail__hero-meta">
            <span className="tag tag-terracotta">{recipe.category}</span>
            <span className="tag">{recipe.cuisine}</span>
          </div>
          <h1 className="recipe-detail__hero-title">{recipe.title}</h1>
          <p className="recipe-detail__hero-desc">{recipe.description}</p>
          <div className="recipe-detail__hero-stats">
            <div className="recipe-detail__stat"><Clock size={16} /><span>{recipe.prepTime + recipe.cookTime} min total</span></div>
            <div className="recipe-detail__stat"><Users size={16} /><span>{recipe.servings} servings</span></div>
            <div className="recipe-detail__stat"><ChefHat size={16} /><span>{recipe.difficulty}</span></div>
            {recipe.rating > 0 && <div className="recipe-detail__stat"><Star size={16} fill="currentColor" /><span>{Number(recipe.rating).toFixed(1)}</span></div>}
          </div>
          <div className="recipe-detail__hero-actions">
            <Link to={`/edit-recipe/${recipe._id}`} className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
              <Edit size={15} /> Edit
            </Link>
            <button className="btn" style={{ background: 'rgba(192,57,43,0.8)', color: '#fff', border: 'none' }} onClick={handleDelete}>
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>
      </div>

      <div className="recipe-detail__body container">
        <div className="recipe-detail__main">
          {/* TABS */}
          <div className="recipe-tabs reveal">
            {['ingredients', 'steps', 'nutrition'].map(tab => (
              <button key={tab} className={`recipe-tabs__tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* INGREDIENTS TAB */}
          {activeTab === 'ingredients' && (
            <div className="recipe-detail__section reveal">
              <h2 className="recipe-detail__section-title">Ingredients</h2>
              <p className="recipe-detail__serving-note">For {recipe.servings} servings</p>
              <ul className="ingredients-list">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="ingredients-list__item">
                    <span className="ingredients-list__qty">{ing.quantity} {ing.unit}</span>
                    <span className="ingredients-list__name">{ing.name}</span>
                    {ing.notes && <span className="ingredients-list__notes">{ing.notes}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* STEPS TAB */}
          {activeTab === 'steps' && (
            <div className="recipe-detail__section reveal">
              <h2 className="recipe-detail__section-title">Cooking Steps</h2>
              <p className="recipe-detail__serving-note">Click each step to mark as complete</p>
              <div className="steps-list">
                {recipe.steps.sort((a,b) => a.stepNumber - b.stepNumber).map((step) => {
                  const done = completedSteps.has(step.stepNumber);
                  return (
                    <div key={step.stepNumber} className={`step-item ${done ? 'step-item--done' : ''}`} onClick={() => toggleStep(step.stepNumber)}>
                      <div className="step-item__num">
                        {done ? <CheckCircle size={22} /> : <Circle size={22} />}
                      </div>
                      <div className="step-item__content">
                        <div className="step-item__header">
                          <span className="step-item__label">Step {step.stepNumber}</span>
                          {step.duration && <span className="step-item__duration"><Clock size={12} /> {step.duration}</span>}
                        </div>
                        <p className="step-item__instruction">{step.instruction}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {completedSteps.size === recipe.steps.length && recipe.steps.length > 0 && (
                <div className="steps-complete">🎉 You've completed all steps! Enjoy your meal!</div>
              )}
            </div>
          )}

          {/* NUTRITION TAB */}
          {activeTab === 'nutrition' && recipe.nutrition && (
            <div className="recipe-detail__section reveal">
              <h2 className="recipe-detail__section-title">Nutrition Facts</h2>
              <p className="recipe-detail__serving-note">Per serving (approximate)</p>
              <div className="nutrition-grid">
                {[
                  { label: 'Calories', value: recipe.nutrition.calories, unit: 'kcal' },
                  { label: 'Protein', value: recipe.nutrition.protein, unit: 'g' },
                  { label: 'Carbohydrates', value: recipe.nutrition.carbohydrates, unit: 'g' },
                  { label: 'Fat', value: recipe.nutrition.fat, unit: 'g' },
                  { label: 'Fiber', value: recipe.nutrition.fiber, unit: 'g' },
                  { label: 'Sugar', value: recipe.nutrition.sugar, unit: 'g' },
                ].map(n => (
                  <div key={n.label} className="nutrition-item">
                    <span className="nutrition-item__value">{n.value}<span className="nutrition-item__unit">{n.unit}</span></span>
                    <span className="nutrition-item__label">{n.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVIEWS */}
          <div className="recipe-detail__section reveal">
            <h2 className="recipe-detail__section-title">Reviews</h2>
            {recipe.reviews?.length > 0 ? (
              <div className="reviews-list">
                {recipe.reviews.map((r, i) => (
                  <div key={i} className="review-item">
                    <div className="review-item__header">
                      <div className="review-item__avatar">{r.user?.charAt(0).toUpperCase()}</div>
                      <div>
                        <strong>{r.user}</strong>
                        <div className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                      </div>
                    </div>
                    <p className="review-item__comment">{r.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-reviews">No reviews yet. Be the first to review!</p>
            )}

            <form className="review-form" onSubmit={handleReview}>
              <h3>Leave a Review</h3>
              <div className="review-form__rating">
                <label>Rating</label>
                <select value={review.rating} onChange={(e) => setReview(r => ({ ...r, rating: Number(e.target.value) }))}>
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{'★'.repeat(n)} {n}/5</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" placeholder="Jane Smith" value={review.user} onChange={e => setReview(r => ({...r, user: e.target.value}))} required />
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea rows={3} placeholder="Share your experience with this recipe..." value={review.comment} onChange={e => setReview(r => ({...r, comment: e.target.value}))} required />
              </div>
              <button className="btn btn-primary" type="submit" disabled={reviewSubmitting}>
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="recipe-detail__sidebar">
          {/* Quick facts */}
          <div className="sidebar-card reveal">
            <h3>Quick Facts</h3>
            <div className="quick-facts">
              <div className="quick-fact"><span>Prep Time</span><strong>{recipe.prepTime} min</strong></div>
              <div className="quick-fact"><span>Cook Time</span><strong>{recipe.cookTime} min</strong></div>
              <div className="quick-fact"><span>Total Time</span><strong>{totalTime} min</strong></div>
              <div className="quick-fact"><span>Servings</span><strong>{recipe.servings}</strong></div>
              <div className="quick-fact"><span>Difficulty</span><strong>{recipe.difficulty}</strong></div>
              <div className="quick-fact"><span>Author</span><strong>{recipe.author}</strong></div>
            </div>
          </div>

          {/* Tags */}
          {recipe.tags?.length > 0 && (
            <div className="sidebar-card reveal">
              <h3>Tags</h3>
              <div className="tags-wrap">
                {recipe.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          )}

          {/* Video */}
          {recipe.videoUrl && (
            <div className="sidebar-card reveal">
              <h3>Video Guide</h3>
              <a href={recipe.videoUrl} target="_blank" rel="noreferrer" className="video-link">
                <Play size={20} /> Watch on YouTube
              </a>
            </div>
          )}

          {/* Substitutions */}
          <div className="sidebar-card substitution-card reveal">
            <div className="substitution-card__header">
              <Shuffle size={18} />
              <h3>Ingredient Substitutions</h3>
            </div>
            <p>Find taste or nutrition-based alternatives for any ingredient.</p>
            <form onSubmit={handleSubstitution} className="sub-form">
              <input
                type="text"
                placeholder="e.g. butter, eggs, sugar..."
                value={subIngredient}
                onChange={e => setSubIngredient(e.target.value)}
              />
              <button type="submit" className="btn btn-terracotta" disabled={subLoading}>
                {subLoading ? '...' : 'Find'}
              </button>
            </form>
            {substitution === null && subIngredient && !subLoading && (
              <p className="sub-none">No substitutions found. Try the full list!</p>
            )}
            {substitution && (
              <div className="sub-results">
                <div className="sub-section">
                  <h4>Taste-Based</h4>
                  {substitution.tasteBased?.map((s, i) => (
                    <div key={i} className="sub-item">
                      <strong>{s.name}</strong>
                      <span className="sub-ratio">{s.ratio}</span>
                      {s.notes && <p>{s.notes}</p>}
                    </div>
                  ))}
                </div>
                <div className="sub-section">
                  <h4>Nutrition-Based</h4>
                  {substitution.nutritionBased?.map((s, i) => (
                    <div key={i} className="sub-item">
                      <strong>{s.name}</strong>
                      <span className="sub-ratio">{s.ratio}</span>
                      {s.calories !== undefined && <span className="sub-cal">{s.calories} kcal</span>}
                      {s.notes && <p>{s.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Link to="/substitutions" className="sub-link">View all substitutions →</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
