import express from 'express';
import Recipe from '../models/Recipe.mjs';

const router = express.Router();

// New endpoint to get all cuisine types
router.get('/cuisines', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Fetching distinct cuisine types from the database...');
    }
    const cuisines = await Recipe.distinct('cuisine');
    if (process.env.NODE_ENV === 'development') {
      console.log('Cuisines fetched successfully:', cuisines);
    }
    res.json(cuisines);
  } catch (error) {
    console.error('Error fetching cuisines:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to fetch cuisines' });
  }
});

export default router;