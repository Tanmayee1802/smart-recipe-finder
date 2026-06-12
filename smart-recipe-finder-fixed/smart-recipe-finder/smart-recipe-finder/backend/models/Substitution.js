const mongoose = require('mongoose');

const substitutionSchema = new mongoose.Schema(
  {
    ingredient: {
      type: String,
      required: [true, 'Ingredient name is required'],
      trim: true,
      lowercase: true
    },
    tasteBased: [
      {
        name: { type: String, required: true },
        ratio: { type: String, default: '1:1' },
        notes: { type: String, default: '' }
      }
    ],
    nutritionBased: [
      {
        name: { type: String, required: true },
        ratio: { type: String, default: '1:1' },
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        notes: { type: String, default: '' }
      }
    ]
  },
  { timestamps: true }
);

substitutionSchema.index({ ingredient: 1 });

module.exports = mongoose.model('Substitution', substitutionSchema);
