import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true }, // Added url as required
    image: { type: String }, // Made image optional
    prepTime: { type: String },
    difficulty: { type: String },
    cuisine: { type: String },
    dietaryRestrictions: { type: [String] },
    mainIngredient: { type: String }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;