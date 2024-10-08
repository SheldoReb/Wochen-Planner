export const handleDuplicateRecipeError = (error) => {
  if (error.response && error.response.status === 409) {
    const duplicateRecipe = error.response.data.duplicateRecipe;
    if (duplicateRecipe && duplicateRecipe.name) {
      console.error('Duplicate recipe error:', error.response.data.message);
      const duplicateError = new Error(`Duplicate recipe found: ${duplicateRecipe.name}`);
      duplicateError.code = 'DUPLICATE_RECIPE';
      duplicateError.duplicateRecipe = duplicateRecipe;
      throw duplicateError;
    } else {
      console.error('Duplicate recipe details are missing in the response.');
      const missingDetailsError = new Error('Duplicate recipe details are missing.');
      missingDetailsError.code = 'MISSING_DUPLICATE_DETAILS';
      throw missingDetailsError;
    }
  }
  console.error('Error:', error.response ? error.response.data : error.message, error.stack);
  const genericError = new Error('An error occurred');
  genericError.code = 'GENERIC_ERROR';
  throw genericError;
};