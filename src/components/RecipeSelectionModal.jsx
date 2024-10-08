import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { fetchAllRecipes } from '../services/recipeService'; // Assume this function fetches all recipes

const RecipeSelectionModal = ({ show, onHide, onSelectRecipe }) => {
  const [allRecipes, setAllRecipes] = React.useState([]);

  React.useEffect(() => {
    const fetchRecipes = async () => {
      try {
        console.log('Fetching all recipes for selection modal');
        const recipes = await fetchAllRecipes();
        console.log('Recipes fetched successfully:', recipes); // Log fetched recipes
        if (recipes.length === 0) {
          console.log('No recipes found');
        }
        setAllRecipes(recipes);
      } catch (error) {
        console.error('Error fetching recipes:', error.message, error.stack);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Select a Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul>
          {allRecipes.map(recipe => (
            <li key={recipe._id}> {/* Use _id instead of id */}
              <button onClick={() => {
                console.log('Selected recipe:', recipe); // Log selected recipe
                onSelectRecipe(recipe);
              }}>
                {recipe.name}
              </button>
            </li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RecipeSelectionModal;