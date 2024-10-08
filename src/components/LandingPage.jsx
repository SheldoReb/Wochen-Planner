import React from 'react';
import WeeklyCalendar from './WeeklyCalendar';
import FilterForm from './FilterForm'; // Import the FilterForm component
import './LandingPage.css';

const LandingPage = ({ onFilterChange }) => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Meal Planner</h1>
        <p>Plan your meals for the week with ease!</p>
      </header>
      <WeeklyCalendar />
      <FilterForm onFilterChange={onFilterChange} />
    </div>
  );
};

export default LandingPage;