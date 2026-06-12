import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { createRecipe, updateRecipe, getRecipeById } from '../utils/api';
import './RecipeForm.css';

const INITIAL = {
  title: '', description: '', category: 'Dinner', cuisine: 'International',
  difficulty: 'Medium', prepTime: '', cookTime: '', servings: '', image: '', videoUrl: '',
  tags: '',
  author: '',
  isFeatured: false,
  ingredients: [{ name: '', quantity: '', unit: '', notes: '' }],
  steps: [{ stepNumber: 1, instruction: '', duration: '' }],
  nutrition: { calories: '', protein: '', carbohydrates: '', fat: '', fiber: '', sugar: '' }
};

const REQUIRED = ['title', 'description', 'prepTime', 'cookTime', 'servings'];

function validate(form) {
  const errs = {};
  if (!form.title.trim()) errs.title = 'Title is required';
  if (!form.description.trim()) errs.description = 'Description is required';
  if (!form.prepTime || form.prepTime < 0) errs.prepTime = 'Prep time required';
  if (!form.cookTime && form.cookTime !== 0) errs.cookTime = 'Cook time required';
  if (!form.servings || form.servings < 1) errs.servings = 'Servings required';
  if (form.ingredients.some(i => !i.name.trim())) errs.ingredients = 'All ingredients need a name';
  if (form.steps.some(s => !s.instruction.trim())) errs.steps = 'All steps need an instruction';
  return errs;
}

export default function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      getRecipeById(id).then(res => {
        const r = res.data.data;
        setForm({
          ...r,
          tags: r.tags?.join(', ') || '',
          nutrition: { ...INITIAL.nutrition, ...r.nutrition }
        });
        setLoadingEdit(false);
      });
    }
  }, [id, isEdit]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Ingredients
  const addIngredient = () => setForm(f => ({ ...f, ingredients: [...f.ingredients, { name: '', quantity: '', unit: '', notes: '' }] }));
  const removeIngredient = (i) => setForm(f => ({ ...f, ingredients: f.ingredients.filter((_, idx) => idx !== i) }));
  const updateIngredient = (i, key, val) => setForm(f => ({ ...f, ingredients: f.ingredients.map((ing, idx) => idx === i ? { ...ing, [key]: val } : ing) }));

  // Steps
  const addStep = () => setForm(f => ({ ...f, steps: [...f.steps, { stepNumber: f.steps.length + 1, instruction: '', duration: '' }] }));
  const removeStep = (i) => setForm(f => ({ ...f, steps: f.steps.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, stepNumber: idx + 1 })) }));
  const updateStep = (i, key, val) => setForm(f => ({ ...f, steps: f.steps.map((s, idx) => idx === i ? { ...s, [key]: val } : s) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); window.scrollTo(0, 0); return; }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        prepTime: Number(form.prepTime),
        cookTime: Number(form.cookTime),
        servings: Number(form.servings),
        nutrition: Object.fromEntries(Object.entries(form.nutrition).map(([k,v]) => [k, Number(v) || 0]))
      };
      if (isEdit) {
        await updateRecipe(id, payload);
        navigate(`/recipe/${id}`);
      } else {
        const res = await createRecipe(payload);
        navigate(`/recipe/${res.data.data._id}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEdit) return <div style={{ display:'flex', justifyContent:'center', padding:'10rem' }}><div className="spinner" /></div>;

  return (
    <div className="recipe-form-page">
      <div className="recipe-form-page__hero">
        <div className="container">
          <button className="back-link" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="recipe-form-page__title">
            {isEdit ? <><em>Edit</em> Recipe</> : <>Add a <em>New Recipe</em></>}
          </h1>
          <p>{isEdit ? 'Update your recipe details below.' : 'Share your culinary creation with the world.'}</p>
        </div>
      </div>

      <div className="container recipe-form-page__content">
        {Object.keys(errors).length > 0 && (
          <div className="form-errors">
            {Object.values(errors).map((e, i) => <p key={i}>⚠ {e}</p>)}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* BASIC INFO */}
          <section className="form-section">
            <h2 className="form-section__title">Basic Information</h2>
            <div className="form-grid-2">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label>Recipe Title *</label>
                <input type="text" placeholder="e.g. Saffron Risotto with Truffle Oil"
                  value={form.title} onChange={e => set('title', e.target.value)}
                  className={errors.title ? 'error' : ''} />
                {errors.title && <span className="error-msg">{errors.title}</span>}
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label>Description *</label>
                <textarea rows={3} placeholder="Describe your dish in a few enticing sentences..."
                  value={form.description} onChange={e => set('description', e.target.value)}
                  className={errors.description ? 'error' : ''} />
                {errors.description && <span className="error-msg">{errors.description}</span>}
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}>
                  {['Breakfast','Lunch','Dinner','Appetizer','Dessert','Snack','Beverage','Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Cuisine</label>
                <input type="text" placeholder="e.g. Italian, Thai, Fusion..." value={form.cuisine} onChange={e => set('cuisine', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Difficulty</label>
                <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
                  {['Easy','Medium','Hard'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Author</label>
                <input type="text" placeholder="Your name" value={form.author} onChange={e => set('author', e.target.value)} />
              </div>
            </div>
          </section>

          {/* TIMING */}
          <section className="form-section">
            <h2 className="form-section__title">Timing & Servings</h2>
            <div className="form-grid-3">
              <div className="form-group">
                <label>Prep Time (minutes) *</label>
                <input type="number" min="0" placeholder="15" value={form.prepTime}
                  onChange={e => set('prepTime', e.target.value)} className={errors.prepTime ? 'error' : ''} />
                {errors.prepTime && <span className="error-msg">{errors.prepTime}</span>}
              </div>
              <div className="form-group">
                <label>Cook Time (minutes) *</label>
                <input type="number" min="0" placeholder="30" value={form.cookTime}
                  onChange={e => set('cookTime', e.target.value)} className={errors.cookTime ? 'error' : ''} />
                {errors.cookTime && <span className="error-msg">{errors.cookTime}</span>}
              </div>
              <div className="form-group">
                <label>Servings *</label>
                <input type="number" min="1" placeholder="4" value={form.servings}
                  onChange={e => set('servings', e.target.value)} className={errors.servings ? 'error' : ''} />
                {errors.servings && <span className="error-msg">{errors.servings}</span>}
              </div>
            </div>
          </section>

          {/* MEDIA */}
          <section className="form-section">
            <h2 className="form-section__title">Media</h2>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Image URL</label>
                <input type="url" placeholder="https://images.unsplash.com/..." value={form.image} onChange={e => set('image', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Video URL (YouTube)</label>
                <input type="url" placeholder="https://youtube.com/watch?v=..." value={form.videoUrl} onChange={e => set('videoUrl', e.target.value)} />
              </div>
              {form.image && (
                <div className="image-preview">
                  <img src={form.image} alt="Preview" onError={e => e.target.style.display='none'} />
                </div>
              )}
            </div>
          </section>

          {/* INGREDIENTS */}
          <section className="form-section">
            <div className="form-section__header">
              <h2 className="form-section__title">Ingredients</h2>
              <button type="button" className="btn btn-outline btn-sm" onClick={addIngredient}>
                <Plus size={15} /> Add Ingredient
              </button>
            </div>
            {errors.ingredients && <div className="form-errors"><p>⚠ {errors.ingredients}</p></div>}
            <div className="ingredients-builder">
              {form.ingredients.map((ing, i) => (
                <div key={i} className="ingredient-row">
                  <div className="form-group">
                    <label>Quantity</label>
                    <input type="text" placeholder="300" value={ing.quantity} onChange={e => updateIngredient(i, 'quantity', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Unit</label>
                    <input type="text" placeholder="g / ml / tbsp..." value={ing.unit} onChange={e => updateIngredient(i, 'unit', e.target.value)} />
                  </div>
                  <div className="form-group ingredient-name">
                    <label>Ingredient Name *</label>
                    <input type="text" placeholder="Arborio rice" value={ing.name} onChange={e => updateIngredient(i, 'name', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Notes</label>
                    <input type="text" placeholder="finely diced..." value={ing.notes} onChange={e => updateIngredient(i, 'notes', e.target.value)} />
                  </div>
                  {form.ingredients.length > 1 && (
                    <button type="button" className="remove-btn" onClick={() => removeIngredient(i)}>
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* STEPS */}
          <section className="form-section">
            <div className="form-section__header">
              <h2 className="form-section__title">Cooking Steps</h2>
              <button type="button" className="btn btn-outline btn-sm" onClick={addStep}>
                <Plus size={15} /> Add Step
              </button>
            </div>
            {errors.steps && <div className="form-errors"><p>⚠ {errors.steps}</p></div>}
            <div className="steps-builder">
              {form.steps.map((step, i) => (
                <div key={i} className="step-row">
                  <div className="step-num">{step.stepNumber}</div>
                  <div className="step-row__fields">
                    <div className="form-group">
                      <label>Instruction *</label>
                      <textarea rows={2} placeholder="Describe this step clearly..." value={step.instruction} onChange={e => updateStep(i, 'instruction', e.target.value)} />
                    </div>
                    <div className="form-group" style={{ maxWidth: '180px' }}>
                      <label>Duration</label>
                      <input type="text" placeholder="5 min" value={step.duration} onChange={e => updateStep(i, 'duration', e.target.value)} />
                    </div>
                  </div>
                  {form.steps.length > 1 && (
                    <button type="button" className="remove-btn" onClick={() => removeStep(i)}>
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* NUTRITION */}
          <section className="form-section">
            <h2 className="form-section__title">Nutrition (per serving)</h2>
            <div className="form-grid-3">
              {[['calories','Calories (kcal)'],['protein','Protein (g)'],['carbohydrates','Carbohydrates (g)'],['fat','Fat (g)'],['fiber','Fiber (g)'],['sugar','Sugar (g)']].map(([k,l]) => (
                <div className="form-group" key={k}>
                  <label>{l}</label>
                  <input type="number" min="0" placeholder="0" value={form.nutrition[k]} onChange={e => setForm(f => ({ ...f, nutrition: { ...f.nutrition, [k]: e.target.value } }))} />
                </div>
              ))}
            </div>
          </section>

          {/* TAGS & FEATURED */}
          <section className="form-section">
            <h2 className="form-section__title">Tags & Options</h2>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input type="text" placeholder="Italian, Vegetarian, Quick, Gourmet..." value={form.tags} onChange={e => set('tags', e.target.value)} />
              </div>
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} />
                  Mark as Featured Recipe
                </label>
              </div>
            </div>
          </section>

          <div className="form-submit">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Save size={16} />
              {submitting ? 'Saving...' : isEdit ? 'Update Recipe' : 'Publish Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
