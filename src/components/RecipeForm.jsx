import React from 'react';
import PropTypes from 'prop-types';

const RecipeForm = ({ recipe, handleChange, handleSubmit, handleFileUpload, isEditing }) => {
  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input type="text" name="name" value={recipe.name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Image URL</label>
        <input type="text" name="image" value={recipe.image} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Prep Time</label>
        <input type="text" name="prepTime" value={recipe.prepTime} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Difficulty</label>
        <input type="text" name="difficulty" value={recipe.difficulty} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Cuisine</label>
        <input type="text" name="cuisine" value={recipe.cuisine} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Dietary Restrictions</label>
        <input type="text" name="dietaryRestrictions" value={recipe.dietaryRestrictions} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Main Ingredient</label>
        <input type="text" name="mainIngredient" value={recipe.mainIngredient} onChange={handleChange} />
      </div>
      {isEditing ? (
        <button type="submit" className="btn btn-primary">Edit Recipe</button>
      ) : (
        <div className="form-group">
          <label>Upload JSON File</label>
          <input type="file" accept=".json" onChange={handleFileUpload} />
          <button type="submit" className="btn btn-primary">Upload Recipe</button>
        </div>
      )}
    </form>
  );
};

RecipeForm.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    prepTime: PropTypes.string,
    difficulty: PropTypes.string,
    cuisine: PropTypes.string.isRequired,
    dietaryRestrictions: PropTypes.string,
    mainIngredient: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func,  // Ensure this is included for non-editing mode
  isEditing: PropTypes.bool.isRequired
};

export default RecipeForm;