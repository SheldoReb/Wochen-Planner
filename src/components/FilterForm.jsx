import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './FilterForm.css';
import { fetchCuisineOptions } from '../services/recipeService';

const FilterForm = ({ onFilterChange }) => {
  const [cuisineOptions, setCuisineOptions] = useState([]);
  const [filters, setFilters] = useState({
    cuisineTypes: [],
    days: {
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
      All: false,
    },
  });

  useEffect(() => {
    const getCuisineOptions = async () => {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('Fetching cuisine options...');
        }
        const cuisines = await fetchCuisineOptions();
        setCuisineOptions(cuisines);
        if (process.env.NODE_ENV === 'development') {
          console.log('Cuisine options set:', cuisines);
        }
      } catch (error) {
        console.error('Error fetching cuisine options:', error.message, error.stack);
      }
    };

    getCuisineOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name in filters.days) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          days: { ...prevFilters.days, [name]: checked },
        }));
      } else {
        setFilters((prevFilters) => {
          const newCuisineTypes = checked
            ? [...prevFilters.cuisineTypes, value]
            : prevFilters.cuisineTypes.filter((cuisine) => cuisine !== value);
          return { ...prevFilters, cuisineTypes: newCuisineTypes };
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (process.env.NODE_ENV === 'development') {
      console.log('Submitting filters:', filters);
    }
    onFilterChange(filters);
  };

  return (
    <form className="filter-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Cuisine Types</label>
        <div className="cuisine-options">
          {cuisineOptions.map((cuisine) => (
            <div key={cuisine} className="form-check">
              <input
                type="checkbox"
                name="cuisineType"
                value={cuisine}
                checked={filters.cuisineTypes.includes(cuisine)}
                onChange={handleChange}
                className="form-check-input"
              />
              <label className="form-check-label">{cuisine}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label>Days to Apply</label>
        {Object.keys(filters.days).map((day) => (
          <div key={day} className="form-check">
            <input
              type="checkbox"
              name={day}
              checked={filters.days[day]}
              onChange={handleChange}
              className="form-check-input"
            />
            <label className="form-check-label">{day}</label>
          </div>
        ))}
      </div>
      <button type="submit" className="btn btn-primary">
        Apply Filters
      </button>
    </form>
  );
};

FilterForm.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterForm;