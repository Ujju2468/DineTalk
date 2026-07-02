const express = require('express');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route GET /api/recipes  -> all recipes, optional ?category= & ?search=
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (search) filter.$text = { $search: search };

    const recipes = await Recipe.find(filter)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/recipes/categories
router.get('/categories', (req, res) => {
  res.json(Recipe.CATEGORIES || require('../models/Recipe').CATEGORIES);
});

// @route GET /api/recipes/mine
router.get('/mine', protect, async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/recipes/:id
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'username avatar');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/recipes
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, ingredients, steps, cookTime, servings, image } = req.body;

    if (!title || !ingredients || !steps) {
      return res.status(400).json({ message: 'Title, ingredients and steps are required' });
    }

    const recipe = await Recipe.create({
      title,
      description,
      category,
      ingredients,
      steps,
      cookTime,
      servings,
      image,
      author: req.user._id
    });

    const populated = await recipe.populate('author', 'username avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/recipes/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this recipe' });
    }

    const fields = ['title', 'description', 'category', 'ingredients', 'steps', 'cookTime', 'servings', 'image'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) recipe[field] = req.body[field];
    });

    const updated = await recipe.save();
    const populated = await updated.populate('author', 'username avatar');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/recipes/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/recipes/:id/like  -> toggle like
router.put('/:id/like', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const userId = req.user._id.toString();
    const hasLiked = recipe.likes.some((id) => id.toString() === userId);

    if (hasLiked) {
      recipe.likes = recipe.likes.filter((id) => id.toString() !== userId);
    } else {
      recipe.likes.push(req.user._id);
    }

    await recipe.save();
    res.json({ likes: recipe.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
