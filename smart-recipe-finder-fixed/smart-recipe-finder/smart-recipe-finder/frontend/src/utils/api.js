import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Recipes
export const getRecipes = (params) => api.get('/recipes', { params });
export const getFeaturedRecipes = () => api.get('/recipes/featured');
export const getRecipeById = (id) => api.get(`/recipes/${id}`);
export const searchByIngredients = (ingredients) => api.get('/recipes/search-by-ingredients', { params: { ingredients } });
export const createRecipe = (data) => api.post('/recipes', data);
export const updateRecipe = (id, data) => api.put(`/recipes/${id}`, data);
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);
export const addReview = (id, review) => api.post(`/recipes/${id}/reviews`, review);

// Substitutions
export const getSubstitution = (ingredient) => api.get('/substitutions', { params: { ingredient } });
export const getAllSubstitutions = () => api.get('/substitutions');

export default api;
