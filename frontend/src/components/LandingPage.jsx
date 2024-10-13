// src/components/LandingPage.jsx
import React, { useState } from 'react';
import WeeklyCalendar from './WeeklyCalendar';
import FilterForm from './FilterForm';
import RecipeSelectionSidebar from './RecipeSelectionSidebar';
import './LandingPage.css';

const LandingPage = ({ onUpload }) => {
  const [appliedFilters, setAppliedFilters] = useState({});
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Sidebar visibility state

  const handleFilterChange = (filters) => {
    console.log('Filters applied:', filters);
    setAppliedFilters(filters);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="landing-page">
      {isSidebarVisible && (
        <RecipeSelectionSidebar
          selectedRecipes={selectedRecipes}
          setSelectedRecipes={setSelectedRecipes}
        />
      )}
      <div className={`main-content ${isSidebarVisible ? 'with-sidebar' : 'full-width'}`}>
        <button className="toggle-sidebar-button" onClick={toggleSidebar}>
          {isSidebarVisible ? 'Hide Filters' : 'Show Filters'}
        </button>
        <FilterForm onFilterChange={handleFilterChange} />
        <WeeklyCalendar
          onUpload={onUpload}
          appliedFilters={appliedFilters}
          selectedRecipes={selectedRecipes}
        />
      </div>
    </div>
  );
};

export default LandingPage;