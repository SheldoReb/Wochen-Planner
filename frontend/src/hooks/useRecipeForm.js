import { useState } from 'react';

const useRecipeForm = (initialState) => {
  const [recipe, setRecipe] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({ ...prevRecipe, [name]: value }));
  };

  const resetForm = () => {
    setRecipe(initialState);
  };

  return [recipe, handleChange, resetForm];
};

export default useRecipeForm;