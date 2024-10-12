import React, { useState, useEffect } from 'react';
import { fetchRandomRecipe, fetchFilteredRecipes, cleanDuplicateRecipes, saveWeeklyRecipes, loadWeeklyRecipes } from '../services/recipeService';
import RecipeSelectionModal from './RecipeSelectionModal';
import RecipeUploadForm from './RecipeUploadForm';
import { Modal } from 'react-bootstrap';

const WeeklyCalendar = ({ onUpload, appliedFilters }) => {
  const [recipes, setRecipes] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalDay, setModalDay] = useState('');
  const [showRecipeSelectionModal, setShowRecipeSelectionModal] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const loadedRecipes = await loadWeeklyRecipes();
        const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const filteredRecipes = Object.keys(loadedRecipes)
          .filter(day => validDays.includes(day))
          .reduce((obj, key) => {
            obj[key] = loadedRecipes[key];
            return obj;
          }, {});
        setRecipes(filteredRecipes);
      } catch (error) {
        console.error('Error loading weekly recipes:', error.message, error.stack);
      }
    };

    loadRecipes();
  }, []);

  useEffect(() => {
    if (appliedFilters && Object.keys(appliedFilters).length > 0) {
      console.log('Filters applied:', appliedFilters);
    }
  }, [appliedFilters]);

  const handleRegenerateClick = async (day) => {
    if (day === 'All') {
      // Regenerate all days
      const updatedRecipes = { ...recipes };
      for (const dayKey of Object.keys(recipes)) {
        try {
          const randomRecipe = await fetchRandomRecipe(appliedFilters);
          updatedRecipes[dayKey] = randomRecipe;
        } catch (error) {
          console.error(`Error regenerating recipe for ${dayKey}:`, error);
          updatedRecipes[dayKey] = null;
        }
      }
      setRecipes(updatedRecipes);
    } else {
      // Regenerate single day
      try {
        const randomRecipe = await fetchRandomRecipe(appliedFilters);
        setRecipes(prevRecipes => ({ ...prevRecipes, [day]: randomRecipe }));
      } catch (error) {
        console.error(`Error regenerating recipe for ${day}:`, error);
      }
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

  const handleSaveWeek = async () => {
    try {
      await saveWeeklyRecipes(recipes);
      alert('Weekly recipes saved successfully.');
      const loadedRecipes = await loadWeeklyRecipes(); // Reload the recipes        
      const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const filteredRecipes = Object.keys(loadedRecipes)
        .filter(day => validDays.includes(day))
        .reduce((obj, key) => {
          obj[key] = loadedRecipes[key];
          return obj;
        }, {});
      setRecipes(filteredRecipes);
    } catch (error) {
      console.error('Error saving weekly recipes:', error.message, error.stack);
      alert('Failed to save weekly recipes. Please try again.');
    }
  };

  return (
    <div className="weekly-calendar container">
      <div className="row">
        {Object.keys(recipes).map((day) => (
          <div key={day} className="col-sm-6 col-md-4 col-lg-3">
            <div className="card mb-4">
              <div className="card-header">{day}</div>
              <div className="card-body text-center">
                {recipes[day] ? (
                  <>
                    <img
                      src={recipes[day].image || '/path/to/default/image.jpg'}
                      alt={recipes[day].name}
                      className="img-fluid mb-2"
                    />
                    <h5 className="card-title">{recipes[day].name}</h5>
                    {recipes[day].url && (
                      <a
                        href={recipes[day].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-info btn-sm mt-2"
                      >
                        View Recipe
                      </a>
                    )}
                  </>
                ) : (
                  <p>No recipe assigned</p>
                )}
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
      {showUploadForm && <RecipeUploadForm onUpload={onUpload} />}
      <button
        className="btn btn-success mt-4"
        onClick={handleSaveWeek}
      >
        Save Week
      </button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Regeneration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to regenerate the recipe for {modalDay}?
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => handleRegenerateClick(modalDay)}>
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