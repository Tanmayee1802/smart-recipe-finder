const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  unit: { type: String, default: '' },
  notes: { type: String, default: '' }
});

const stepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  instruction: { type: String, required: true },
  duration: { type: String, default: '' }
});

const nutritionSchema = new mongoose.Schema({
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbohydrates: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 }
});

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Recipe title is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    category: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Appetizer', 'Dessert', 'Snack', 'Beverage', 'Other'],
      default: 'Other'
    },
    cuisine: { type: String, default: 'International', trim: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    prepTime: { type: Number, required: true, min: 0 },
    cookTime: { type: Number, required: true, min: 0 },
    servings: { type: Number, required: true, min: 1 },
    ingredients: [ingredientSchema],
    steps: [stepSchema],
    nutrition: nutritionSchema,
    image: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    author: { type: String, default: 'Anonymous', trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [
      {
        user: String,
        comment: String,
        rating: { type: Number, min: 1, max: 5 },
        date: { type: Date, default: Date.now }
      }
    ],
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Text index for full-text search
recipeSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
  'ingredients.name': 'text',
  cuisine: 'text'
});

module.exports = mongoose.model('Recipe', recipeSchema);
