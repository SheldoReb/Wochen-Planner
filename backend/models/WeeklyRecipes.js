import mongoose from 'mongoose';

const weeklyRecipesSchema = new mongoose.Schema({
  monday: { type: [mongoose.Schema.Types.ObjectId], ref: 'Recipe', default: [] },
  tuesday: { type: [mongoose.Schema.Types.ObjectId], ref: 'Recipe', default: [] },
  wednesday: { type: [mongoose.Schema.Types.ObjectId], ref: 'Recipe', default: [] },
  thursday: { type: [mongoose.Schema.Types.ObjectId], ref: 'Recipe', default: [] },
  friday: { type: [mongoose.Schema.Types.ObjectId], ref: 'Recipe', default: [] },
  saturday: { type: [mongoose.Schema.Types.ObjectId], ref: 'Recipe', default: [] },
  sunday: { type: [mongoose.Schema.Types.ObjectId], ref: 'Recipe', default: [] }
});

const WeeklyRecipes = mongoose.model('WeeklyRecipes', weeklyRecipesSchema);

export default WeeklyRecipes;
