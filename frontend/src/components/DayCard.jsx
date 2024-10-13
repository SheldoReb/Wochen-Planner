// frontend/src/components/DayCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './DayCard.css';
import { formatDateGerman } from '../utils/dateUtils';

const DayCard = ({ day, recipe, onRegenerate, onAssign, appliedFilters }) => {
  // Get the current week's dates
  const getDateForDay = (dayName) => {
    const today = new Date();
    const dayIndex = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(dayName);
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    const targetDate = new Date(firstDayOfWeek);
    targetDate.setDate(firstDayOfWeek.getDate() + dayIndex);
    return formatDateGerman(targetDate);
  };

  return (
    <div className="day-card">
      <div className="card-header">
        <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
        <p className="date">{getDateForDay(day)}</p>
      </div>
      <div className="card-body">
        {recipe ? (
          <>
            {/* Reintroduced the img tag for thumbnails */}
            <img
              src={recipe.image || '/assets/default-image.jpg'}
              alt={recipe.name}
              className="recipe-thumbnail img-fluid mb-2"
            />
            <p className="recipe-name">{recipe.name}</p>
            {recipe.url && (
              <a
                href={recipe.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-info btn-sm mt-2"
              >
                View Recipe
              </a>
            )}
          </>
        ) : (
          <p className="no-recipe">No recipe assigned</p>
        )}
        <div className="button-group">
          <button
            className="btn btn-warning btn-sm"
            onClick={() => onRegenerate(day)}
          >
            Regenerate
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onAssign(day)}
          >
            Assign Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

DayCard.propTypes = {
  day: PropTypes.string.isRequired,
  recipe: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string,
    image: PropTypes.string, // Ensure image property exists
  }),
  onRegenerate: PropTypes.func.isRequired,
  onAssign: PropTypes.func.isRequired,
  appliedFilters: PropTypes.object,
};

export default DayCard;