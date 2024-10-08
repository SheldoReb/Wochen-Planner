import React from 'react';
import PropTypes from 'prop-types';
import './RecipeCard.css';

const RecipeCard = ({ recipe }) => {
  if (!recipe) {
    return <p className="card-text">No recipe selected</p>;
  }

  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.name} className="recipe-image" />
      <h6 className="recipe-name">{recipe.name}</h6>
      <p className="recipe-info">Prep Time: {recipe.prepTime}</p>
      <p className="recipe-info">Difficulty: {recipe.difficulty}</p>
      <p className="recipe-info">Cuisine: {recipe.cuisine}</p>
    </div>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    prepTime: PropTypes.string,
    difficulty: PropTypes.string,
    cuisine: PropTypes.string,
  }),
};

export default RecipeCard;