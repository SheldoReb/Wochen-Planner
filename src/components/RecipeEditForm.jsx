import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import RecipeForm from './RecipeForm';
import './RecipeEditForm.css';

const RecipeEditForm = ({ recipeId, onEdit }) => {
  const [recipe, setRecipe] = useState({
    name: '',
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

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/preview/${recipeId}`);
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error('Error previewing recipe:', error.message, error.stack);
      }
    };
    fetchRecipe();
  }, [recipeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onEdit(recipeId, recipe);
    } catch (error) {
      console.error('Error editing recipe:', error.message, error.stack);
    }
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <RecipeForm
      recipe={recipe}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isEditing={true}
    />
  );
};

RecipeEditForm.propTypes = {
  recipeId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default RecipeEditForm;