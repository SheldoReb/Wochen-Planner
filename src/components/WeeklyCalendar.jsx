import React, { useState } from 'react';
import './WeeklyCalendar.css';
import RecipeCard from './RecipeCard';
import { Modal } from 'react-bootstrap';
import RecipeSelectionModal from './RecipeSelectionModal';
import { fetchFilteredRecipes, cleanDuplicateRecipes } from '../services/recipeService';
import RecipeUploadForm from './RecipeUploadForm';

const WeeklyCalendar = () => {
  const [recipes, setRecipes] = useState({
    Monday: null,
    Tuesday: null,
    Wednesday: null,
    Thursday: null,
    Friday: null,
    Saturday: null,
    Sunday: null
  });

  const [showModal, setShowModal] = useState(false);
  const [modalDay, setModalDay] = useState('');
  const [showRecipeSelectionModal, setShowRecipeSelectionModal] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const regenerateRecipe = (day) => {
    console.log(`Regenerating recipe for ${day}`);
    const newRecipe = {
      name: `New Recipe for ${day}`,
      image: 'https://via.placeholder.com/150',
      prepTime: '30 mins',
      difficulty: 'Medium',
      cuisine: 'International'
    };
    setRecipes(prevRecipes => ({ ...prevRecipes, [day]: newRecipe }));
  };

  const handleRegenerateClick = (day) => {
    setModalDay(day);
    setShowModal(true);
  };

  const handleConfirmRegenerate = () => {
    try {
      Object.keys(recipes).forEach(day => {
        regenerateRecipe(day);
      });
      console.log(`Recipes regenerated for ${modalDay}`);
    } catch (error) {
      console.error('Error regenerating recipes:', error.message, error.stack);
    }
    setShowModal(false);
  };

  const handleCancelRegenerate = () => {
    setShowModal(false);
  };

  const determineDaysToUpdate = (filters) => {
    return filters.days.All
      ? Object.keys(recipes)
      : Object.keys(filters.days).filter((day) => filters.days[day]);
  };

  const handleFilterChange = async (filters) => {
    try {
      console.log('Applying filters:', filters);
      const filteredRecipes = await fetchFilteredRecipes({ cuisineTypes: filters.cuisineTypes });
      console.log('Filtered recipes:', filteredRecipes);

      const updatedRecipes = { ...recipes };
      const daysToUpdate = determineDaysToUpdate(filters);

      daysToUpdate.forEach((day, index) => {
        updatedRecipes[day] = filteredRecipes[index] || null;
        console.log(`Assigned recipe to ${day}:`, updatedRecipes[day]);
      });

      setRecipes(updatedRecipes);
    } catch (error) {
      console.error('Error applying filters:', error.message, error.stack);
    }
  };

  const handleSelectRecipe = (recipe) => {
    setRecipes(prevRecipes => ({ ...prevRecipes, [modalDay]: recipe }));
    console.log(`Recipe assigned to ${modalDay}:`, recipe);
    setShowRecipeSelectionModal(false);
  };

  const handleCleanDatabase = async () => {
    try {
      const result = await cleanDuplicateRecipes();
      alert(`Database cleaned: ${result.duplicatesRemoved} duplicates removed.`);
    } catch (error) {
      console.error('Error cleaning database:', error.message, error.stack);
      alert('Failed to clean the database. Please try again.');
    }
  };

  const toggleUploadForm = () => {
    setShowUploadForm(!showUploadForm);
  };

  return (
    <div className="weekly-calendar container">
      <div className="row">
        {Object.keys(recipes).map((day) => (
          <div key={day} className="col-md-4 col-lg-3 mb-4">
            <div className="day-card card">
              <div className="card-body">
                <h5 className="card-title">{day}</h5>
                <RecipeCard recipe={recipes[day]} />
                <button
                  className="btn btn-warning btn-sm mt-2"
                  onClick={() => handleRegenerateClick(day)}
                >
                  Regenerate {day}
                </button>
                <button
                  className="btn btn-primary btn-sm mt-2"
                  onClick={() => {
                    setModalDay(day);
                    setShowRecipeSelectionModal(true);
                  }}
                >
                  Assign Recipe
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="btn btn-danger mt-4"
        onClick={() => handleRegenerateClick('All')}
      >
        Regenerate All
      </button>
      <button
        className="btn btn-info mt-4"
        onClick={handleCleanDatabase}
      >
        Clean Database
      </button>
      <button
        className="btn btn-secondary mt-4"
        onClick={toggleUploadForm}
      >
        {showUploadForm ? 'Hide Upload Form' : 'Show Upload Form'}
      </button>
      {showUploadForm && <RecipeUploadForm />}

      <Modal show={showModal} onHide={handleCancelRegenerate}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Regeneration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to regenerate the recipe for {modalDay}?
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCancelRegenerate}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleConfirmRegenerate}>
            Confirm
          </button>
        </Modal.Footer>
      </Modal>

      <RecipeSelectionModal
        show={showRecipeSelectionModal}
        onHide={() => setShowRecipeSelectionModal(false)}
        onSelectRecipe={handleSelectRecipe}
      />
    </div>
  );
};

export default WeeklyCalendar;