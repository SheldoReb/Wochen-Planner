import mongoose from 'mongoose';
import Recipe from './Recipe.mjs';

const weeklyRecipesSchema = new mongoose.Schema({
  monday: { type: Recipe.schema, default: {} },
  tuesday: { type: Recipe.schema, default: {} },
  wednesday: { type: Recipe.schema, default: {} },
  thursday: { type: Recipe.schema, default: {} },
  friday: { type: Recipe.schema, default: {} },
  saturday: { type: Recipe.schema, default: {} },
  sunday: { type: Recipe.schema, default: {} }
});

const WeeklyRecipes = mongoose.model('WeeklyRecipes', weeklyRecipesSchema);

export default WeeklyRecipes;
