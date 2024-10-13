import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchAllRecipes } from '../services/recipeService';
import './RecipeSelectionSidebar.css'; // Import CSS for styling

const RecipeSelectionSidebar = ({ selectedRecipes, setSelectedRecipes, onApplyFilter }) => {
  const [recipes, setRecipes] = useState([]);
  const [groupedRecipes, setGroupedRecipes] = useState({});
  const [expandedCuisines, setExpandedCuisines] = useState({});
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      const allRecipes = await fetchAllRecipes();
      setRecipes(allRecipes);
      groupByCuisine(allRecipes);
    };
    fetchRecipes();
  }, []);

  const groupByCuisine = (recipes) => {
    const grouped = recipes.reduce((acc, recipe) => {
      const cuisine = recipe.cuisine || 'Other';
      if (!acc[cuisine]) {
        acc[cuisine] = [];
      }
      acc[cuisine].push(recipe);
      return acc;
    }, {});
    setGroupedRecipes(grouped);
  };

  const toggleCuisine = (cuisine) => {
    setExpandedCuisines((prev) => ({
      ...prev,
      [cuisine]: !prev[cuisine],
    }));
  };

  const handleRecipeClick = (recipe) => {
    const isSelected = selectedRecipes.some((r) => r._id === recipe._id);
    if (isSelected) {
      setSelectedRecipes(selectedRecipes.filter((r) => r._id !== recipe._id));
    } else {
      setSelectedRecipes([...selectedRecipes, recipe]);
    }
  };

  const handleApplyFilter = () => {
    console.log('Selected Recipes:', selectedRecipes);
    onApplyFilter(selectedRecipes, isFilterApplied);
  };

  const handleCheckboxChange = (e) => {
    setIsFilterApplied(e.target.checked);
  };

  return (
    <div className="recipe-selection-sidebar">
      <h2>Filter Recipes by Cuisine</h2>
      {Object.keys(groupedRecipes).map((cuisine) => (
        <div key={cuisine} className="cuisine-group">
          <div className="cuisine-header" onClick={() => toggleCuisine(cuisine)}>
            <span>{cuisine}</span>
            <span>{expandedCuisines[cuisine] ? '-' : '+'}</span>
          </div>
          {expandedCuisines[cuisine] && (
            <div className="recipes-list">
              {groupedRecipes[cuisine].map((recipe) => (
                <div
                  key={recipe._id}
                  className={`recipe-item ${selectedRecipes.some((r) => r._id === recipe._id) ? 'selected' : ''}`}
                  onClick={() => handleRecipeClick(recipe)}
                >
                  <img src={recipe.image || 'default-thumbnail.jpg'} alt={recipe.name} />
                  <p>{recipe.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="filter-checkbox">
        <input type="checkbox" id="applyFilter" checked={isFilterApplied} onChange={handleCheckboxChange} />
        <label htmlFor="applyFilter">Apply Selected Recipes Filter</label>
      </div>
      <button className="apply-filter-button" onClick={handleApplyFilter}>
        Apply Filter
      </button>
    </div>
  );
};

RecipeSelectionSidebar.propTypes = {
  selectedRecipes: PropTypes.array.isRequired,
  setSelectedRecipes: PropTypes.func.isRequired,
  onApplyFilter: PropTypes.func.isRequired,
};

export default RecipeSelectionSidebar;