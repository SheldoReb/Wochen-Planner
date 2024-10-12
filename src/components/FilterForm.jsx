import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
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
        const formattedCuisines = cuisines.map(cuisine => ({ value: cuisine, label: cuisine }));
        setCuisineOptions(formattedCuisines);
        if (process.env.NODE_ENV === 'development') {
          console.log('Cuisine options set:', formattedCuisines);
        }
      } catch (error) {
        console.error('Error fetching cuisine options:', error.message, error.stack);
      }
    };

    getCuisineOptions();
  }, []);

  const handleCuisineChange = (selectedOptions) => {
    const selectedCuisines = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFilters((prevFilters) => ({
      ...prevFilters,
      cuisineTypes: selectedCuisines,
    }));
  };

  const handleChange = (e) => {
    const { name, type, checked } = e.target;
    if (type === 'checkbox') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        days: { ...prevFilters.days, [name]: checked },
      }));
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
        <Select
          isMulti
          options={cuisineOptions}
          value={cuisineOptions.filter(option => filters.cuisineTypes.includes(option.value))}
          onChange={handleCuisineChange}
          className="cuisine-select"
        />
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