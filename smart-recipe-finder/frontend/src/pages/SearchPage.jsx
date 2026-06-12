import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import { deleteRecipe } from '../utils/api';
import './SearchPage.css';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Appetizer', 'Dessert', 'Snack', 'Beverage', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const CUISINES = ['Italian', 'Thai', 'Moroccan', 'Japanese', 'French', 'Indian', 'Chinese', 'Mexican', 'American', 'Mediterranean', 'Fusion', 'European', 'Modern'];
const SORTS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: '-rating', label: 'Highest Rated' },
  { value: 'prepTime', label: 'Quickest' },
  { value: 'title', label: 'A to Z' },
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { recipes, loading, error, pagination, fetchRecipes } = useRecipes();
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    difficulty: searchParams.get('difficulty') || '',
    cuisine: searchParams.get('cuisine') || '',
    sort: '-createdAt',
    page: 1
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [inputVal, setInputVal] = useState(filters.search);

  const load = useCallback(() => {
    const params = { ...filters };
    if (!params.search) delete params.search;
    if (!params.category) delete params.category;
    if (!params.difficulty) delete params.difficulty;
    if (!params.cuisine) delete params.cuisine;
    fetchRecipes(params);
  }, [filters, fetchRecipes]);

  useEffect(() => { load(); }, [load]);

  const updateFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilter('search', inputVal);
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', difficulty: '', cuisine: '', sort: '-createdAt', page: 1 });
    setInputVal('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await deleteRecipe(id);
      load();
    } catch (e) { alert('Delete failed'); }
  };

  const activeFiltersCount = [filters.category, filters.difficulty, filters.cuisine].filter(Boolean).length;

  return (
    <div className="search-page">
      <div className="search-page__hero">
        <div className="container">
          <h1 className="search-page__title">
            <em>Discover</em> Recipes
          </h1>
          <form className="search-page__form" onSubmit={handleSearch}>
            <div className="search-page__input-wrap">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search recipes, ingredients, cuisines..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
              {inputVal && (
                <button type="button" onClick={() => { setInputVal(''); updateFilter('search', ''); }}>
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
            <button
              type="button"
              className={`btn btn-outline filters-toggle ${activeFiltersCount ? 'has-filters' : ''}`}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal size={16} />
              Filters {activeFiltersCount ? `(${activeFiltersCount})` : ''}
            </button>
          </form>

          {filtersOpen && (
            <div className="search-page__filters">
              <div className="filter-group">
                <label>Category</label>
                <div className="filter-chips">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      className={`filter-chip ${filters.category === c ? 'active' : ''}`}
                      onClick={() => updateFilter('category', filters.category === c ? '' : c)}
                    >{c}</button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <label>Difficulty</label>
                <div className="filter-chips">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d}
                      className={`filter-chip ${filters.difficulty === d ? 'active' : ''}`}
                      onClick={() => updateFilter('difficulty', filters.difficulty === d ? '' : d)}
                    >{d}</button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <label>Cuisine</label>
                <div className="filter-chips">
                  {CUISINES.map(c => (
                    <button
                      key={c}
                      className={`filter-chip ${filters.cuisine === c ? 'active' : ''}`}
                      onClick={() => updateFilter('cuisine', filters.cuisine === c ? '' : c)}
                    >{c}</button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <label>Sort By</label>
                <div className="filter-chips">
                  {SORTS.map(s => (
                    <button
                      key={s.value}
                      className={`filter-chip ${filters.sort === s.value ? 'active' : ''}`}
                      onClick={() => updateFilter('sort', s.value)}
                    >{s.label}</button>
                  ))}
                </div>
              </div>
              {activeFiltersCount > 0 && (
                <button className="btn btn-outline clear-btn" onClick={clearFilters}>
                  <X size={14} /> Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container search-page__results">
        <div className="search-page__results-header">
          {!loading && (
            <p className="search-page__count">
              {pagination.total} recipe{pagination.total !== 1 ? 's' : ''} found
              {filters.search ? ` for "${filters.search}"` : ''}
              {filters.category ? ` in ${filters.category}` : ''}
            </p>
          )}
        </div>

        {loading ? (
          <div className="search-page__loading"><div className="spinner" /></div>
        ) : error ? (
          <div className="search-page__error">
            <p>{error}</p>
            <button className="btn btn-outline" onClick={load}>Try Again</button>
          </div>
        ) : recipes.length === 0 ? (
          <div className="search-page__empty">
            <p>No recipes found. Try different keywords or clear filters.</p>
            <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="search-page__grid">
              {recipes.map((r, i) => (
                <div key={r._id} style={{ animation: `fadeCardIn 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 60}ms both` }}>
                  <RecipeCard recipe={r} onDelete={handleDelete} showActions />
                </div>
              ))}
            </div>
            {pagination.pages > 1 && (
              <div className="pagination">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`pagination__btn ${filters.page === p ? 'active' : ''}`}
                    onClick={() => setFilters(f => ({ ...f, page: p }))}
                  >{p}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
