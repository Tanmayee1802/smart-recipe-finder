const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// GET /api/recipes — Get all recipes with search, filter, pagination
router.get('/', async (req, res, next) => {
  try {
    const { search, category, difficulty, cuisine, sort = '-createdAt', page = 1, limit = 12, featured } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (cuisine) query.cuisine = new RegExp(cuisine, 'i');
    if (featured === 'true') query.isFeatured = true;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-steps -reviews');

    res.json({
      success: true,
      data: recipes,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/recipes/featured — Get featured recipes
router.get('/featured', async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ isFeatured: true }).limit(6).select('-steps -reviews');
    res.json({ success: true, data: recipes });
  } catch (err) {
    next(err);
  }
});

// GET /api/recipes/search-by-ingredients — Search by multiple ingredients
router.get('/search-by-ingredients', async (req, res, next) => {
  try {
    const { ingredients } = req.query;
    if (!ingredients) return res.json({ success: true, data: [] });

    const ingredientList = ingredients.split(',').map(i => i.trim());
    const regexes = ingredientList.map(i => new RegExp(i, 'i'));

    const recipes = await Recipe.find({
      'ingredients.name': { $in: regexes }
    }).select('-steps -reviews');

    res.json({ success: true, data: recipes });
  } catch (err) {
    next(err);
  }
});

// GET /api/recipes/:id — Get single recipe
router.get('/:id', async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });
    res.json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
});

// POST /api/recipes — Create recipe
router.post('/', async (req, res, next) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json({ success: true, data: recipe, message: 'Recipe created successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT /api/recipes/:id — Update recipe
router.put('/:id', async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });
    res.json({ success: true, data: recipe, message: 'Recipe updated successfully' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/recipes/:id — Delete recipe
router.delete('/:id', async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });
    res.json({ success: true, message: 'Recipe deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// POST /api/recipes/:id/reviews — Add review
router.post('/:id/reviews', async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });

    recipe.reviews.push(req.body);
    const totalRating = recipe.reviews.reduce((sum, r) => sum + r.rating, 0);
    recipe.rating = (totalRating / recipe.reviews.length).toFixed(1);
    await recipe.save();

    res.status(201).json({ success: true, data: recipe, message: 'Review added' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
