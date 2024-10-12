import axios from 'axios';
import { handleDuplicateRecipeError } from '../utils/errorHandling';

const isMockEnvironment = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const apiClient = axios.create({
  baseURL: backendUrl
});

export const fetchFilteredRecipes = async (filters) => {
  if (isMockEnvironment) {
    console.log('Mock fetch filtered recipes with filters:', filters);
    return Promise.resolve([]); // Simulate empty filtered results
  }
  try {
    const response = await apiClient.post('/api/recipes/filter', filters);
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered recipes:', error.message, error.stack);
    return {};
  }
};

export const uploadRecipe = async (recipe) => {
  if (isMockEnvironment) {
    console.log('Mock upload recipe:', recipe);
    return Promise.resolve(recipe); // Simulate successful upload
  }
  try {
    // Ensure the recipe is wrapped in an array before sending to the backend
    const recipeArray = Array.isArray(recipe) ? recipe : [recipe];
    console.log('Uploading recipe data:', recipeArray); // Log the array of recipe data being sent

    // Log each recipe's details for debugging
    recipeArray.forEach((rec, index) => {
      console.log(`Recipe ${index + 1}:`, rec);
    });

    const response = await apiClient.post('/api/recipes/upload', recipeArray);
    console.log('Recipe uploaded successfully:', response.data);
    return response.data;
  } catch (error) {
    handleDuplicateRecipeError(error);
    console.error('Error uploading recipe:', error.response ? error.response.data : error.message, error.stack);
    throw error; // Re-throw the error for further handling
  }
};

export const editRecipe = async (recipeId, recipe) => {
  if (isMockEnvironment) {
    console.log('Mock edit recipe:', recipeId, recipe);
    return Promise.resolve(recipe); // Simulate successful edit
  }
  try {
    const response = await apiClient.put(`/api/recipes/edit/${recipeId}`, recipe);
    console.log('Recipe edited successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error editing recipe:', error.message, error.stack);
    throw new Error('Failed to edit recipe');
  }
};

export const fetchAllRecipes = async () => {
  if (isMockEnvironment) {
    console.log('Mock fetch all recipes');
    return Promise.resolve([]); // Simulate empty recipe list
  }
  try {
    console.log('Fetching all recipes');
    const response = await apiClient.post('/api/recipes/filter');
    console.log('All recipes fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching all recipes:', error.message, error.stack);
    return [];
  }
};

export const cleanDuplicateRecipes = async () => {
  if (isMockEnvironment) {
    console.log('Mock clean duplicate recipes');
    return Promise.resolve({ message: 'Mock clean success', duplicatesRemoved: 0 });
  }
  try {
    const response = await apiClient.delete('/api/recipes/clean-duplicates');
    console.log('Database cleaned successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error cleaning duplicate recipes:', error.message, error.stack);
    throw new Error('Failed to clean duplicate recipes');
  }
};

export const fetchCuisineOptions = async () => {
  if (isMockEnvironment) {
    console.log('Mock fetch cuisine options');
    return Promise.resolve(['Italian', 'Mexican', 'Asian', 'Eintop Curry', 'International']); // Simulate available cuisines
  }
  try {
    console.log('Fetching cuisine options');
    const response = await apiClient.get('/api/cuisines');
    console.log('Cuisine options fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching cuisine options:', error.message, error.stack);
    return [];
  }
};

// Add a function to fetch a random recipe with filters
export const fetchRandomRecipe = async (filters) => {
  try {
    const response = await apiClient.post('/api/recipes/random', filters);
    return response.data;
  } catch (error) {
    console.error('Error fetching random recipe:', error.message, error.stack);
    throw error;
  }
};