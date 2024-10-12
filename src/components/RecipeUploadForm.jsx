import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RecipeForm from './RecipeForm';
import './RecipeUploadForm.css';

const RecipeUploadForm = ({ onUpload }) => {
  const [recipe, setRecipe] = useState({
    name: '',
    url: '', // Initialize url with an empty string
    image: '',
    prepTime: '',
    difficulty: '',
    cuisine: '',
    dietaryRestrictions: '',
    mainIngredient: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({ ...prevRecipe, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting recipe:', recipe); // Log the recipe data being submitted
      // Wrap the single recipe in an array
      await onUpload([recipe]);
      setRecipe({
        name: '',
        url: '', // Reset url to an empty string
        image: '',
        prepTime: '',
        difficulty: '',
        cuisine: '',
        dietaryRestrictions: '',
        mainIngredient: ''
      });
      console.log('Recipe uploaded successfully');
    } catch (error) {
      console.error('Error uploading recipe:', error.message, error.stack);
      alert('Failed to upload recipe. Please try again.');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          if (validateJson(jsonData)) {
            console.log('Uploading recipes from JSON file:', jsonData); // Log the JSON data being uploaded
            await onUpload(jsonData); // Pass the entire array of recipes
            console.log('Recipes uploaded from JSON file successfully');
          } else {
            throw new Error('Invalid JSON structure');
          }
        } catch (error) {
          console.error('Error uploading recipes from JSON file:', error.message, error.stack);
          alert('Invalid JSON format. Please check your file and try again.');
        }
      };
      reader.readAsText(file);
    }
  };

  const validateJson = (json) => {
    // Log the entire JSON data for debugging
    console.log('Validating JSON data:', json);

    // Ensure the JSON is an array of recipe objects
    const isValid = Array.isArray(json) && json.every(item => {
      const hasRequiredFields = item.hasOwnProperty('name') && item.hasOwnProperty('cuisine');
      const isNameValid = typeof item.name === 'string' && item.name.trim() !== '';
      const isCuisineValid = typeof item.cuisine === 'string' && item.cuisine.trim() !== '';

      // Log validation details for each recipe
      console.log(`Recipe: ${item.name}, hasRequiredFields: ${hasRequiredFields}, isNameValid: ${isNameValid}, isCuisineValid: ${isCuisineValid}`);

      return hasRequiredFields && isNameValid && isCuisineValid;
    });

    console.log('Validation result:', isValid);
    return isValid;
  };

  return (
    <RecipeForm
      recipe={recipe}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleFileUpload={handleFileUpload}
      isEditing={false}
    />
  );
};

RecipeUploadForm.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default RecipeUploadForm;