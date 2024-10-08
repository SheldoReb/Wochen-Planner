import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    prepTime: { type: String },
    difficulty: { type: String },
    cuisine: { type: String, required: true },
    dietaryRestrictions: { type: [String] },
    mainIngredient: { type: String }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;