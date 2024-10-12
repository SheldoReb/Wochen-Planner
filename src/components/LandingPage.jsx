import React, { useState } from 'react';
import WeeklyCalendar from './WeeklyCalendar';
import FilterForm from './FilterForm';
import './LandingPage.css';

const LandingPage = ({ onUpload }) => {
  const [appliedFilters, setAppliedFilters] = useState({});

  const handleFilterChange = (filters) => {
    console.log('Filters applied:', filters);
    setAppliedFilters(filters);
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Meal Planner</h1>
        <p>Plan your meals for the week with ease!</p>
      </header>
      <FilterForm onFilterChange={handleFilterChange} />
      <WeeklyCalendar onUpload={onUpload} appliedFilters={appliedFilters} />
    </div>
  );
};

export default LandingPage;