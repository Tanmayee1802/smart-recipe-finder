import { createContext, useContext, useState, useCallback } from 'react';
import { getRecipes, getFeaturedRecipes } from '../utils/api';

const RecipeContext = createContext();

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const fetchRecipes = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRecipes(params);
      setRecipes(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeatured = useCallback(async () => {
    try {
      const res = await getFeaturedRecipes();
      setFeatured(res.data.data);
    } catch (err) {
      console.error('Failed to fetch featured recipes');
    }
  }, []);

  return (
    <RecipeContext.Provider value={{ recipes, featured, loading, error, pagination, fetchRecipes, fetchFeatured }}>
      {children}
    </RecipeContext.Provider>
  );
}

export const useRecipes = () => useContext(RecipeContext);
