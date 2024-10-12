import React, { useState } from 'react';
import RecipeEditForm from './components/RecipeEditForm';
import { uploadRecipe, editRecipe } from './services/recipeService';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from './components/LandingPage';

const App = () => {
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  const handleUpload = async (recipe) => {
    try {
      console.log('Uploading recipe:', recipe);
      await uploadRecipe(recipe);
      alert('Recipe uploaded successfully!');
    } catch (error) {
      if (error.code === 'DUPLICATE_RECIPE') {
        const duplicateRecipeName = error.duplicateRecipe.name;
        const userChoice = window.confirm(`Duplicate recipe found: ${duplicateRecipeName}. Would you like to replace the existing recipe?`);
        if (userChoice) {
          // Placeholder for future implementation of replacing the existing recipe
          alert('Replace functionality is not yet implemented.');
        } else {
          alert('Upload canceled.');
        }
      } else if (error.code === 'MISSING_DUPLICATE_DETAILS') {
        console.error('Duplicate recipe details are missing:', error.message, error.stack);
        alert('Duplicate recipe details are missing. Please try again.');
      } else {
        console.error('Error uploading recipe:', error.message, error.stack);
        alert('Failed to upload recipe. Please try again.');
      }
    }
  };

  const handleEdit = async (recipeId, recipe) => {
    try {
      console.log('Editing recipe:', recipeId, recipe);
      await editRecipe(recipeId, recipe);
      alert('Recipe edited successfully!');
    } catch (error) {
      console.error('Error editing recipe:', error.message, error.stack);
      alert('Failed to edit recipe. Please try again.');
    }
  };

  const handleFilterChange = (filters) => {
    console.log('Filters applied:', filters);
    // Implement the logic to handle filter changes
  };

  return (
    <div className="App">
      <LandingPage onFilterChange={handleFilterChange} />
      {selectedRecipeId && <RecipeEditForm recipeId={selectedRecipeId} onEdit={handleEdit} />}
    </div>
  );
};

export default App;