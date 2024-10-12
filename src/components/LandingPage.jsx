import React, { useState } from 'react';
import WeeklyCalendar from './WeeklyCalendar';
import FilterForm from './FilterForm'; // Import the FilterForm component
import './LandingPage.css';

const LandingPage = ({ onFilterChange }) => {
  const [showFilterForm, setShowFilterForm] = useState(false);

  const toggleFilterForm = () => {
    setShowFilterForm((prev) => !prev);
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Meal Planner</h1>
        <p>Plan your meals for the week with ease!</p>
      </header>
      <WeeklyCalendar />
      <button
        className="btn btn-secondary mt-4"
        onClick={toggleFilterForm}
      >
        {showFilterForm ? 'Hide Filter' : 'Show Filter'}
      </button>
      {showFilterForm && <FilterForm onFilterChange={onFilterChange} />}
    </div>
  );
};

export default LandingPage;