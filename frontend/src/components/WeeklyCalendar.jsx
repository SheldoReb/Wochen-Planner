import React, { useState, useEffect } from 'react';
import { fetchRandomRecipe, fetchFilteredRecipes, cleanDuplicateRecipes, saveWeeklyRecipes, loadWeeklyRecipes } from '../services/recipeService';
import RecipeSelectionModal from './RecipeSelectionModal';
import RecipeUploadForm from './RecipeUploadForm';
import { Modal } from 'react-bootstrap';
import DayCard from './DayCard';
import { getWeekNumber, formatDateGerman } from '../utils/dateUtils';
import './WeeklyCalendar.css';

const WeeklyCalendar = ({ onUpload, appliedFilters }) => {
  const [recipes, setRecipes] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalDay, setModalDay] = useState('');
  const [showRecipeSelectionModal, setShowRecipeSelectionModal] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [currentWeek, setCurrentWeek] = useState({
    number: getWeekNumber(new Date()),
    startDate: '',
    endDate: '',
  });

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

        // Set current week dates
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
        setCurrentWeek({
          number: getWeekNumber(firstDayOfWeek),
          startDate: formatDateGerman(firstDayOfWeek),
          endDate: formatDateGerman(lastDayOfWeek),
        });
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
          console.error(`Error regenerating recipe for ${dayKey}:`, error.message);
        }
      }
      setRecipes(updatedRecipes);
    } else {
      try {
        const randomRecipe = await fetchRandomRecipe(appliedFilters);
        setRecipes(prev => ({ ...prev, [day]: randomRecipe }));
      } catch (error) {
        console.error(`Error regenerating recipe for ${day}:`, error.message);
      }
    }
  };

  const handleCleanDatabase = async () => {
    try {
      await cleanDuplicateRecipes();
      alert('Database cleaned successfully.');
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
      <div className="week-info">
        <h2>KW {currentWeek.number}: {currentWeek.startDate} - {currentWeek.endDate}</h2>
      </div>
      <div className="week-view">
        {Object.keys(recipes).sort((a, b) => {
          const order = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
          return order.indexOf(a) - order.indexOf(b);
        }).map((day) => (
          <DayCard
            key={day}
            day={day}
            recipe={recipes[day]}
            onRegenerate={handleRegenerateClick}
            onAssign={(day) => {
              setModalDay(day);
              setShowRecipeSelectionModal(true);
            }}
            appliedFilters={appliedFilters}
          />
        ))}
      </div>
      <div className="action-buttons">
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
      </div>

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
        onSelectRecipe={(recipe) => {
          setRecipes(prev => ({ ...prev, [modalDay]: recipe }));
          setShowRecipeSelectionModal(false);
        }}
      />
    </div>
  );
};

export default WeeklyCalendar;