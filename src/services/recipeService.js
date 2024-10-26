import axios from 'axios';
import { handleDuplicateRecipeError } from '../utils/errorHandling';

const isMockEnvironment = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const apiClient = axios.create({
  baseURL: backendUrl
});

export const fetchFilteredRecipes = async (filters) => {
  if (isMockEnvironment) {
    return Promise.resolve([]); // Simulate empty filtered results
  }
  try {
    const response = await apiClient.post('/api/recipes/filter', filters);
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered recipes:', error.message, error.stack);
    throw new Error('Failed to fetch filtered recipes');
  }
};

export const uploadRecipe = async (recipe) => {
  if (isMockEnvironment) {
    return Promise.resolve(recipe); // Simulate successful upload
  }
  try {
    const recipeArray = Array.isArray(recipe) ? recipe : [recipe];
    const response = await apiClient.post('/api/recipes/upload', recipeArray);
    return response.data;
  } catch (error) {
    handleDuplicateRecipeError(error);
    console.error('Error uploading recipe:', error.response ? error.response.data : error.message, error.stack);
    throw new Error('Failed to upload recipe');
  }
};

export const editRecipe = async (recipeId, recipe) => {
  if (isMockEnvironment) {
    return Promise.resolve(recipe); // Simulate successful edit
  }
  try {
    const response = await apiClient.put(`/api/recipes/edit/${recipeId}`, recipe);
    return response.data;
  } catch (error) {
    console.error('Error editing recipe:', error.message, error.stack);
    throw new Error('Failed to edit recipe');
  }
};

export const fetchAllRecipes = async () => {
  if (isMockEnvironment) {
    return Promise.resolve([]); // Simulate empty recipe list
  }
  try {
    const response = await apiClient.post('/api/recipes/filter');
    return response.data;
  } catch (error) {
    console.error('Error fetching all recipes:', error.message, error.stack);
    throw new Error('Failed to fetch all recipes');
  }
};

export const cleanDuplicateRecipes = async () => {
  if (isMockEnvironment) {
    return Promise.resolve({ message: 'Mock clean success', duplicatesRemoved: 0 });
  }
  try {
    const response = await apiClient.delete('/api/recipes/clean-duplicates');
    return response.data;
  } catch (error) {
    console.error('Error cleaning duplicate recipes:', error.message, error.stack);
    throw new Error('Failed to clean duplicate recipes');
  }
};

export const fetchCuisineOptions = async () => {
  if (isMockEnvironment) {
    return Promise.resolve(['Italian', 'Mexican', 'Asian', 'Eintop Curry', 'International']); // Simulate available cuisines
  }
  try {
    const response = await apiClient.get('/api/cuisines');
    return response.data;
  } catch (error) {
    console.error('Error fetching cuisine options:', error.message, error.stack);
    throw new Error('Failed to fetch cuisine options');
  }
};
