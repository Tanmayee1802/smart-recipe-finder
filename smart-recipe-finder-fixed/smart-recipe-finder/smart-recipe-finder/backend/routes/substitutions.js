const express = require('express');
const router = express.Router();
const Substitution = require('../models/Substitution');

// GET /api/substitutions?ingredient=butter
router.get('/', async (req, res, next) => {
  try {
    const { ingredient } = req.query;
    if (!ingredient) {
      const all = await Substitution.find().sort('ingredient');
      return res.json({ success: true, data: all });
    }
    const sub = await Substitution.findOne({ ingredient: ingredient.toLowerCase().trim() });
    if (!sub) return res.json({ success: true, data: null, message: 'No substitutions found for this ingredient' });
    res.json({ success: true, data: sub });
  } catch (err) {
    next(err);
  }
});

// POST /api/substitutions — Create substitution
router.post('/', async (req, res, next) => {
  try {
    const existing = await Substitution.findOne({ ingredient: req.body.ingredient.toLowerCase() });
    if (existing) {
      const updated = await Substitution.findByIdAndUpdate(existing._id, req.body, { new: true });
      return res.json({ success: true, data: updated, message: 'Substitution updated' });
    }
    const sub = await Substitution.create(req.body);
    res.status(201).json({ success: true, data: sub, message: 'Substitution created' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
