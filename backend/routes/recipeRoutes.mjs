import express from 'express';
import Recipe from '../models/Recipe.mjs';
import Joi from 'joi';

const router = express.Router();

// Define a schema for recipe validation
const recipeSchema = Joi.object({
  name: Joi.string().min(3).required(),
  image: Joi.string().uri().optional(),
  prepTime: Joi.string().optional(),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard').optional(),
  cuisine: Joi.string().min(3).required(),
  dietaryRestrictions: Joi.string().optional(),
  mainIngredient: Joi.string().optional()
});

// Fetch filtered recipes
router.post('/filter', async (req, res) => {
  const { cuisineType, dietaryRestrictions, prepTime, difficulty, mainIngredient } = req.body;

  try {
    const filters = {
      ...(cuisineType && { cuisine: cuisineType }),
      ...(dietaryRestrictions && { dietaryRestrictions }),
      ...(prepTime && { prepTime: { $lte: prepTime } }),
      ...(difficulty && { difficulty }),
      ...(mainIngredient && { mainIngredient })
    };

    const recipes = await Recipe.find(filters);
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching filtered recipes:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload new recipes
router.post('/upload', async (req, res) => {
  const recipes = req.body;
  console.log('Received recipes data:', recipes); // Log the incoming recipes data

  if (!Array.isArray(recipes)) {
    return res.status(400).json({ message: 'Invalid data format. Expected an array of recipes.' });
  }

  // Validate each recipe against the schema
  const invalidRecipes = recipes.filter(recipe => {
    const { error } = recipeSchema.validate(recipe);
    if (error) {
      console.log(`Validation error for recipe ${recipe.name}:`, error.details);
      return true; // Mark as invalid
    }
    return false;
  });

  if (invalidRecipes.length > 0) {
    console.log('Invalid recipes found:', invalidRecipes);
    return res.status(400).json({ message: 'Some recipes are invalid', invalidRecipes });
  }

  try {
    // Check for duplicate recipes
    for (const recipe of recipes) {
      const duplicate = await Recipe.findOne({ name: recipe.name, cuisine: recipe.cuisine });
      if (duplicate) {
        console.log(`Duplicate recipe found: ${recipe.name} - ${recipe.cuisine}`);
        return res.status(409).json({ message: `Duplicate recipe found: ${recipe.name} - ${recipe.cuisine}` });
      }
    }

    const savedRecipes = await Recipe.insertMany(recipes);
    res.status(201).json(savedRecipes);
  } catch (error) {
    console.error('Error saving recipes:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to save recipes' });
  }
});

// Edit existing recipe
router.put('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updates, { new: true });
    res.json(updatedRecipe);
  } catch (error) {
    console.error('Error editing recipe:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Preview recipe
router.get('/preview/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      console.error('Recipe not found with id:', id);
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Error previewing recipe:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a recipe
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(id);
    if (!deletedRecipe) {
      console.error('Recipe not found for deletion with id:', id);
      return res.status(404).json({ error: 'Recipe not found' });
    }
    console.log('Recipe deleted successfully:', deletedRecipe);
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch all recipes
router.get('/all', async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    console.log('All recipes fetched successfully:', recipes);
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching all recipes:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to clean duplicate recipes
router.delete('/clean-duplicates', async (req, res) => {
  try {
    // Aggregate to find duplicates
    const duplicates = await Recipe.aggregate([
      {
        $group: {
          _id: { name: "$name", cuisine: "$cuisine" },
          uniqueIds: { $addToSet: "$_id" },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    let totalRemoved = 0;

    // Remove duplicates
    for (const duplicate of duplicates) {
      const [firstId, ...restIds] = duplicate.uniqueIds;
      const result = await Recipe.deleteMany({ _id: { $in: restIds } });
      totalRemoved += result.deletedCount;
    }

    res.json({ message: 'Database cleaned successfully', duplicatesRemoved: totalRemoved });
  } catch (error) {
    console.error('Error cleaning duplicates:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;