const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');
const Substitution = require('./models/Substitution');
require('dotenv').config();

const recipes = [
  {
    title: 'Saffron Risotto with Truffle Oil',
    description: 'A luxurious Italian risotto with golden saffron, Parmesan, and a drizzle of black truffle oil. Creamy, rich, and absolutely unforgettable.',
    category: 'Dinner', cuisine: 'Italian', difficulty: 'Medium',
    prepTime: 15, cookTime: 30, servings: 4, isFeatured: true, rating: 4.8,
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop',
    tags: ['Italian', 'Rice', 'Vegetarian', 'Gourmet'], author: 'Chef Marco',
    nutrition: { calories: 420, protein: 12, carbohydrates: 58, fat: 16, fiber: 2, sugar: 3 },
    ingredients: [
      { name: 'Arborio rice', quantity: '300', unit: 'g' },
      { name: 'Saffron threads', quantity: '1', unit: 'pinch' },
      { name: 'Vegetable stock', quantity: '1', unit: 'litre', notes: 'warm' },
      { name: 'White wine', quantity: '150', unit: 'ml' },
      { name: 'Parmesan', quantity: '80', unit: 'g', notes: 'freshly grated' },
      { name: 'Butter', quantity: '30', unit: 'g' },
      { name: 'Onion', quantity: '1', unit: 'large', notes: 'finely diced' },
      { name: 'Garlic', quantity: '2', unit: 'cloves', notes: 'minced' },
      { name: 'Black truffle oil', quantity: '2', unit: 'tbsp' },
      { name: 'Olive oil', quantity: '2', unit: 'tbsp' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Heat stock in a separate pan, keep warm. Dissolve saffron in 2 tbsp warm stock.', duration: '5 min' },
      { stepNumber: 2, instruction: 'In a large pan heat olive oil, sauté onion until translucent (5 min). Add garlic 1 min more.', duration: '6 min' },
      { stepNumber: 3, instruction: 'Add Arborio rice and toast 2 minutes stirring constantly until edges are translucent.', duration: '2 min' },
      { stepNumber: 4, instruction: 'Pour in white wine and stir until fully absorbed.', duration: '3 min' },
      { stepNumber: 5, instruction: 'Add saffron mixture then begin adding warm stock one ladle at a time, stirring constantly.', duration: '18 min' },
      { stepNumber: 6, instruction: 'Remove from heat. Stir in butter and Parmesan until creamy. Season with salt and pepper.', duration: '2 min' },
      { stepNumber: 7, instruction: 'Serve immediately in warm bowls, drizzled with truffle oil and extra Parmesan shavings.', duration: '1 min' }
    ]
  },
  {
    title: 'Moroccan Lamb Tagine',
    description: 'Slow-cooked tender lamb with warming spices, preserved lemons, and green olives. A fragrant North African masterpiece that fills your home with incredible aromas.',
    category: 'Dinner', cuisine: 'Moroccan', difficulty: 'Hard',
    prepTime: 30, cookTime: 180, servings: 6, isFeatured: true, rating: 4.9,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop',
    tags: ['Moroccan', 'Lamb', 'Slow Cook', 'Spiced'], author: 'Chef Amina',
    nutrition: { calories: 580, protein: 42, carbohydrates: 28, fat: 32, fiber: 6, sugar: 8 },
    ingredients: [
      { name: 'Lamb shoulder', quantity: '1.2', unit: 'kg', notes: 'cut into chunks' },
      { name: 'Onions', quantity: '2', unit: 'large', notes: 'sliced' },
      { name: 'Garlic', quantity: '4', unit: 'cloves' },
      { name: 'Preserved lemon', quantity: '1', unit: 'whole', notes: 'rinsed, flesh removed, skin sliced' },
      { name: 'Green olives', quantity: '150', unit: 'g' },
      { name: 'Ground cumin', quantity: '2', unit: 'tsp' },
      { name: 'Ground coriander', quantity: '2', unit: 'tsp' },
      { name: 'Turmeric', quantity: '1', unit: 'tsp' },
      { name: 'Cinnamon stick', quantity: '1', unit: 'whole' },
      { name: 'Saffron', quantity: '1', unit: 'pinch', notes: 'soaked in warm water' },
      { name: 'Fresh coriander', quantity: '1', unit: 'bunch' },
      { name: 'Olive oil', quantity: '3', unit: 'tbsp' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Combine all spices. Coat lamb in half the mix. Marinate at least 1 hour.', duration: '60 min' },
      { stepNumber: 2, instruction: 'Heat oil in tagine or heavy casserole. Brown lamb in batches on all sides.', duration: '15 min' },
      { stepNumber: 3, instruction: 'Sauté onions until soft. Add garlic and remaining spices. Cook 2 minutes.', duration: '8 min' },
      { stepNumber: 4, instruction: 'Add tomatoes and cook until breaking down. Return lamb, add saffron water.', duration: '5 min' },
      { stepNumber: 5, instruction: 'Bring to boil then reduce heat. Cover and simmer gently 2 to 2.5 hours.', duration: '150 min' },
      { stepNumber: 6, instruction: 'Add preserved lemon and olives in last 20 minutes.', duration: '20 min' },
      { stepNumber: 7, instruction: 'Scatter fresh coriander and serve with couscous or crusty bread.', duration: '5 min' }
    ]
  },
  {
    title: 'Japanese Matcha Tiramisu',
    description: 'A stunning East-meets-West dessert combining Italian tiramisu technique with the earthy depth of ceremonial grade matcha. Elegant, creamy, and beautifully layered.',
    category: 'Dessert', cuisine: 'Fusion', difficulty: 'Medium',
    prepTime: 30, cookTime: 0, servings: 8, isFeatured: true, rating: 4.7,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop',
    tags: ['Dessert', 'Japanese', 'Matcha', 'No-Bake'], author: 'Chef Yuki',
    nutrition: { calories: 310, protein: 8, carbohydrates: 38, fat: 14, fiber: 1, sugar: 24 },
    ingredients: [
      { name: 'Ladyfinger biscuits', quantity: '200', unit: 'g' },
      { name: 'Matcha powder', quantity: '3', unit: 'tbsp', notes: 'ceremonial grade' },
      { name: 'Mascarpone', quantity: '500', unit: 'g' },
      { name: 'Eggs', quantity: '4', unit: 'large', notes: 'separated' },
      { name: 'Caster sugar', quantity: '80', unit: 'g' },
      { name: 'Heavy cream', quantity: '200', unit: 'ml' },
      { name: 'Hot water', quantity: '300', unit: 'ml' },
      { name: 'White chocolate', quantity: '50', unit: 'g', notes: 'grated, for garnish' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Whisk 2 tbsp matcha into 300ml hot water until smooth. Cool completely.', duration: '5 min' },
      { stepNumber: 2, instruction: 'Beat egg yolks with sugar until pale. Fold in mascarpone and vanilla.', duration: '8 min' },
      { stepNumber: 3, instruction: 'Whip egg whites to stiff peaks. Whip cream to soft peaks. Fold both into mascarpone.', duration: '10 min' },
      { stepNumber: 4, instruction: 'Stir remaining 1 tbsp matcha into cream mixture.', duration: '2 min' },
      { stepNumber: 5, instruction: 'Dip ladyfingers in matcha liquid (2 seconds per side). Arrange in single layer.', duration: '5 min' },
      { stepNumber: 6, instruction: 'Spread half the matcha cream. Add another biscuit layer then remaining cream.', duration: '5 min' },
      { stepNumber: 7, instruction: 'Refrigerate at least 4 hours. Dust with matcha and scatter white chocolate.', duration: '240 min' }
    ]
  },
  {
    title: 'Avocado & Poached Egg Toast',
    description: 'The ultimate brunch elevated with sourdough, smashed avocado, perfectly poached eggs, chilli flakes, and microgreens. Quick, nutritious, and stunning.',
    category: 'Breakfast', cuisine: 'Modern', difficulty: 'Easy',
    prepTime: 10, cookTime: 10, servings: 2, isFeatured: false, rating: 4.6,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop',
    tags: ['Breakfast', 'Vegetarian', 'Quick', 'Healthy'], author: 'Chef Sara',
    nutrition: { calories: 380, protein: 14, carbohydrates: 32, fat: 22, fiber: 8, sugar: 2 },
    ingredients: [
      { name: 'Sourdough bread', quantity: '2', unit: 'thick slices' },
      { name: 'Ripe avocados', quantity: '2', unit: 'whole' },
      { name: 'Eggs', quantity: '2', unit: 'large', notes: 'very fresh' },
      { name: 'Lemon juice', quantity: '1', unit: 'tbsp' },
      { name: 'White wine vinegar', quantity: '1', unit: 'tbsp' },
      { name: 'Chilli flakes', quantity: '1', unit: 'pinch' },
      { name: 'Microgreens', quantity: '30', unit: 'g' },
      { name: 'Extra virgin olive oil', quantity: '1', unit: 'tbsp' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Toast sourdough until golden and crisp.', duration: '4 min' },
      { stepNumber: 2, instruction: 'Scoop avocado into bowl. Add lemon juice, salt and pepper. Smash to preferred texture.', duration: '3 min' },
      { stepNumber: 3, instruction: 'Simmer water with vinegar. Slide eggs in gently. Poach 3 minutes for runny yolks.', duration: '5 min' },
      { stepNumber: 4, instruction: 'Spread avocado on toast. Top with poached egg, chilli flakes, microgreens and olive oil.', duration: '2 min' }
    ]
  },
  {
    title: 'Thai Green Curry',
    description: 'Vibrant aromatic Thai green curry with coconut milk, fresh vegetables, and chicken. Bold, fragrant, and ready in under 30 minutes.',
    category: 'Dinner', cuisine: 'Thai', difficulty: 'Easy',
    prepTime: 15, cookTime: 20, servings: 4, isFeatured: true, rating: 4.7,
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop',
    tags: ['Thai', 'Curry', 'Coconut', 'Spicy'], author: 'Chef Ploy',
    nutrition: { calories: 460, protein: 28, carbohydrates: 22, fat: 30, fiber: 4, sugar: 6 },
    ingredients: [
      { name: 'Green curry paste', quantity: '3', unit: 'tbsp' },
      { name: 'Coconut milk', quantity: '400', unit: 'ml', notes: 'full-fat' },
      { name: 'Chicken breast', quantity: '500', unit: 'g', notes: 'sliced thin' },
      { name: 'Thai eggplant', quantity: '150', unit: 'g', notes: 'quartered' },
      { name: 'Baby spinach', quantity: '100', unit: 'g' },
      { name: 'Fish sauce', quantity: '2', unit: 'tbsp' },
      { name: 'Palm sugar', quantity: '1', unit: 'tbsp' },
      { name: 'Kaffir lime leaves', quantity: '4', unit: 'whole', notes: 'torn' },
      { name: 'Thai basil', quantity: '1', unit: 'handful' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Heat oil in wok. Fry curry paste 1-2 minutes until fragrant.', duration: '2 min' },
      { stepNumber: 2, instruction: 'Pour in half the coconut milk. Stir with paste and bring to simmer.', duration: '3 min' },
      { stepNumber: 3, instruction: 'Add chicken and cook 5 minutes stirring occasionally.', duration: '5 min' },
      { stepNumber: 4, instruction: 'Add remaining coconut milk, fish sauce, palm sugar, lime leaves. Simmer 5 minutes.', duration: '5 min' },
      { stepNumber: 5, instruction: 'Add eggplant and spinach. Cook 3-4 minutes until eggplant is tender.', duration: '4 min' },
      { stepNumber: 6, instruction: 'Serve with jasmine rice, topped with Thai basil and sliced chilli.', duration: '1 min' }
    ]
  },
  {
    title: 'Homemade Sourdough Bread',
    description: 'A beautifully crusty, tangy sourdough with an open crumb. This classic recipe rewards patience with bakery-quality results from your own oven.',
    category: 'Other', cuisine: 'European', difficulty: 'Hard',
    prepTime: 60, cookTime: 45, servings: 10, isFeatured: true, rating: 4.9,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop',
    tags: ['Bread', 'Sourdough', 'Baking', 'Fermented'], author: 'Chef Henri',
    nutrition: { calories: 180, protein: 6, carbohydrates: 36, fat: 1, fiber: 2, sugar: 0 },
    ingredients: [
      { name: 'Bread flour', quantity: '500', unit: 'g' },
      { name: 'Active sourdough starter', quantity: '100', unit: 'g' },
      { name: 'Water', quantity: '375', unit: 'ml', notes: 'lukewarm' },
      { name: 'Salt', quantity: '10', unit: 'g' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Mix flour and 350ml water. Rest 1 hour (autolyse).', duration: '60 min' },
      { stepNumber: 2, instruction: 'Add starter and salt with remaining water. Mix thoroughly.', duration: '10 min' },
      { stepNumber: 3, instruction: 'Perform 4 sets of stretch and folds every 30 minutes over 2 hours.', duration: '120 min' },
      { stepNumber: 4, instruction: 'Shape gently and place in floured banneton. Refrigerate overnight 8-12 hours.', duration: '480 min' },
      { stepNumber: 5, instruction: 'Preheat oven to 250°C with Dutch oven inside for 45 minutes.', duration: '45 min' },
      { stepNumber: 6, instruction: 'Score dough. Bake covered 20 minutes then uncovered 25 minutes until deep golden.', duration: '45 min' },
      { stepNumber: 7, instruction: 'Cool on wire rack at least 1 hour before slicing.', duration: '60 min' }
    ]
  },
  {
    title: 'French Onion Soup',
    description: 'The definitive French bistro classic — deeply caramelised onions, rich beef broth, and a golden Gruyère crust. Pure soul-warming comfort in a bowl.',
    category: 'Appetizer', cuisine: 'French', difficulty: 'Medium',
    prepTime: 20, cookTime: 75, servings: 4, isFeatured: false, rating: 4.8,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop',
    tags: ['French', 'Soup', 'Comfort', 'Cheese'], author: 'Chef Pierre',
    nutrition: { calories: 390, protein: 18, carbohydrates: 42, fat: 16, fiber: 3, sugar: 12 },
    ingredients: [
      { name: 'Onions', quantity: '1.2', unit: 'kg', notes: 'thinly sliced' },
      { name: 'Butter', quantity: '50', unit: 'g' },
      { name: 'Olive oil', quantity: '2', unit: 'tbsp' },
      { name: 'Beef stock', quantity: '1.2', unit: 'litre' },
      { name: 'Dry white wine', quantity: '200', unit: 'ml' },
      { name: 'Fresh thyme', quantity: '4', unit: 'sprigs' },
      { name: 'Bay leaves', quantity: '2', unit: 'whole' },
      { name: 'Baguette', quantity: '8', unit: 'slices', notes: 'toasted' },
      { name: 'Gruyère cheese', quantity: '200', unit: 'g', notes: 'grated' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Melt butter with oil in a wide heavy pot. Add onions and cook on medium-low, stirring every 10 minutes for 45-55 minutes until deeply caramelised.', duration: '55 min' },
      { stepNumber: 2, instruction: 'Add wine to deglaze. Scrape up all the brown bits. Cook 5 minutes.', duration: '5 min' },
      { stepNumber: 3, instruction: 'Add stock, thyme, and bay leaves. Simmer 20 minutes. Season.', duration: '20 min' },
      { stepNumber: 4, instruction: 'Ladle into oven-proof bowls. Top with toasted baguette slices.', duration: '3 min' },
      { stepNumber: 5, instruction: 'Pile Gruyère over baguette. Grill until bubbling and golden. Serve immediately.', duration: '5 min' }
    ]
  },
  {
    title: 'Shakshuka with Feta',
    description: 'Eggs poached in a spiced tomato and pepper sauce, crowned with creamy feta. A Middle Eastern breakfast that wows every time with minimal effort.',
    category: 'Breakfast', cuisine: 'Mediterranean', difficulty: 'Easy',
    prepTime: 10, cookTime: 25, servings: 3, isFeatured: false, rating: 4.7,
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&auto=format&fit=crop',
    tags: ['Breakfast', 'Eggs', 'Vegetarian', 'Spiced'], author: 'Chef Laila',
    nutrition: { calories: 290, protein: 16, carbohydrates: 22, fat: 15, fiber: 5, sugar: 10 },
    ingredients: [
      { name: 'Eggs', quantity: '6', unit: 'large' },
      { name: 'Canned tomatoes', quantity: '800', unit: 'g', notes: 'crushed' },
      { name: 'Red peppers', quantity: '2', unit: 'large', notes: 'diced' },
      { name: 'Onion', quantity: '1', unit: 'large', notes: 'diced' },
      { name: 'Garlic', quantity: '4', unit: 'cloves', notes: 'minced' },
      { name: 'Cumin', quantity: '2', unit: 'tsp' },
      { name: 'Smoked paprika', quantity: '1', unit: 'tsp' },
      { name: 'Chilli flakes', quantity: '1/2', unit: 'tsp' },
      { name: 'Feta cheese', quantity: '120', unit: 'g', notes: 'crumbled' },
      { name: 'Fresh parsley', quantity: '1', unit: 'handful' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Heat oil in a wide skillet. Sauté onion until soft, 5 minutes. Add peppers and cook 5 more minutes.', duration: '10 min' },
      { stepNumber: 2, instruction: 'Add garlic, cumin, paprika, and chilli. Cook 1 minute until fragrant.', duration: '1 min' },
      { stepNumber: 3, instruction: 'Add crushed tomatoes. Season generously. Simmer 10 minutes until thickened.', duration: '10 min' },
      { stepNumber: 4, instruction: 'Make 6 wells in the sauce. Crack an egg into each well.', duration: '2 min' },
      { stepNumber: 5, instruction: 'Cover and cook on medium-low until whites are set but yolks still runny, 5-7 minutes.', duration: '7 min' },
      { stepNumber: 6, instruction: 'Scatter feta and parsley. Serve directly from pan with crusty bread.', duration: '1 min' }
    ]
  },
  {
    title: 'Beef Bourguignon',
    description: 'Julia Child\'s iconic French braised beef stew with pearl onions, mushrooms, and rich Burgundy wine. The ultimate weekend cooking project that feeds the soul.',
    category: 'Dinner', cuisine: 'French', difficulty: 'Hard',
    prepTime: 45, cookTime: 180, servings: 6, isFeatured: false, rating: 5.0,
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&auto=format&fit=crop',
    tags: ['French', 'Beef', 'Wine', 'Classic'], author: 'Chef Pierre',
    nutrition: { calories: 620, protein: 48, carbohydrates: 18, fat: 34, fiber: 3, sugar: 5 },
    ingredients: [
      { name: 'Beef chuck', quantity: '1.5', unit: 'kg', notes: 'cut into large cubes' },
      { name: 'Burgundy wine', quantity: '750', unit: 'ml' },
      { name: 'Beef stock', quantity: '500', unit: 'ml' },
      { name: 'Lardons (bacon lardons)', quantity: '200', unit: 'g' },
      { name: 'Pearl onions', quantity: '300', unit: 'g' },
      { name: 'Button mushrooms', quantity: '300', unit: 'g' },
      { name: 'Carrots', quantity: '3', unit: 'medium', notes: 'roughly chopped' },
      { name: 'Garlic', quantity: '4', unit: 'cloves' },
      { name: 'Tomato paste', quantity: '2', unit: 'tbsp' },
      { name: 'Fresh thyme and bay leaves', quantity: '1', unit: 'bouquet garni' },
      { name: 'Plain flour', quantity: '2', unit: 'tbsp' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Marinate beef overnight in wine with carrots, garlic, and herbs. Pat dry before cooking.', duration: '480 min' },
      { stepNumber: 2, instruction: 'Render lardons in Dutch oven. Remove and sear beef in batches until deep brown. Set aside.', duration: '20 min' },
      { stepNumber: 3, instruction: 'Sauté vegetables in the fat. Add tomato paste and flour. Stir 2 minutes.', duration: '8 min' },
      { stepNumber: 4, instruction: 'Return beef and lardons. Pour in wine and stock. Bring to boil, cover, and transfer to 160°C oven.', duration: '5 min' },
      { stepNumber: 5, instruction: 'Braise in oven 2.5-3 hours until beef is fork-tender.', duration: '180 min' },
      { stepNumber: 6, instruction: 'In last 30 minutes, sauté pearl onions and mushrooms separately until golden. Add to stew.', duration: '30 min' },
      { stepNumber: 7, instruction: 'Adjust seasoning. Serve with buttered egg noodles or mashed potato.', duration: '5 min' }
    ]
  },
  {
    title: 'Mango Coconut Chia Pudding',
    description: 'A vibrant, creamy overnight chia pudding with layers of coconut milk and fresh mango. Light, healthy, and beautiful — perfect for meal prep.',
    category: 'Breakfast', cuisine: 'Modern', difficulty: 'Easy',
    prepTime: 10, cookTime: 0, servings: 4, isFeatured: false, rating: 4.5,
    image: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=800&auto=format&fit=crop',
    tags: ['Breakfast', 'Healthy', 'Vegan', 'Meal Prep'], author: 'Chef Sara',
    nutrition: { calories: 220, protein: 5, carbohydrates: 28, fat: 10, fiber: 9, sugar: 16 },
    ingredients: [
      { name: 'Chia seeds', quantity: '80', unit: 'g' },
      { name: 'Coconut milk', quantity: '400', unit: 'ml' },
      { name: 'Almond milk', quantity: '200', unit: 'ml' },
      { name: 'Maple syrup', quantity: '3', unit: 'tbsp' },
      { name: 'Vanilla extract', quantity: '1', unit: 'tsp' },
      { name: 'Ripe mangoes', quantity: '2', unit: 'large', notes: 'diced' },
      { name: 'Toasted coconut flakes', quantity: '30', unit: 'g' },
      { name: 'Lime', quantity: '1', unit: 'whole', notes: 'zested' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Whisk together coconut milk, almond milk, maple syrup, and vanilla.', duration: '2 min' },
      { stepNumber: 2, instruction: 'Add chia seeds and whisk again. Let sit 5 minutes then whisk again to prevent clumping.', duration: '5 min' },
      { stepNumber: 3, instruction: 'Cover and refrigerate overnight or at least 4 hours until thick and creamy.', duration: '240 min' },
      { stepNumber: 4, instruction: 'Blend half the mango with a squeeze of lime until smooth for the sauce.', duration: '3 min' },
      { stepNumber: 5, instruction: 'Layer chia pudding with mango sauce and diced fresh mango. Top with coconut flakes.', duration: '3 min' }
    ]
  },
  {
    title: 'Crispy Korean Fried Chicken',
    description: 'Double-fried ultra-crispy chicken glazed in a sticky, spicy-sweet gochujang sauce. The Korean fried chicken that every recipe has been trying to replicate.',
    category: 'Dinner', cuisine: 'Korean', difficulty: 'Medium',
    prepTime: 30, cookTime: 30, servings: 4, isFeatured: false, rating: 4.8,
    image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&auto=format&fit=crop',
    tags: ['Korean', 'Chicken', 'Fried', 'Spicy'], author: 'Chef Jisoo',
    nutrition: { calories: 520, protein: 36, carbohydrates: 42, fat: 22, fiber: 2, sugar: 14 },
    ingredients: [
      { name: 'Chicken wings', quantity: '1', unit: 'kg' },
      { name: 'Potato starch', quantity: '150', unit: 'g' },
      { name: 'Gochujang paste', quantity: '3', unit: 'tbsp' },
      { name: 'Soy sauce', quantity: '2', unit: 'tbsp' },
      { name: 'Honey', quantity: '3', unit: 'tbsp' },
      { name: 'Rice vinegar', quantity: '1', unit: 'tbsp' },
      { name: 'Garlic', quantity: '4', unit: 'cloves', notes: 'minced' },
      { name: 'Sesame oil', quantity: '1', unit: 'tsp' },
      { name: 'Vegetable oil', quantity: '1', unit: 'litre', notes: 'for deep frying' },
      { name: 'Sesame seeds and spring onions', quantity: '1', unit: 'tbsp', notes: 'to garnish' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Pat chicken completely dry. Season with salt, garlic powder and pepper. Rest 15 minutes.', duration: '15 min' },
      { stepNumber: 2, instruction: 'Toss chicken in potato starch until evenly coated. Shake off excess.', duration: '3 min' },
      { stepNumber: 3, instruction: 'Heat oil to 160°C. First fry chicken 8-10 minutes until cooked through but pale. Drain on rack.', duration: '12 min' },
      { stepNumber: 4, instruction: 'Increase oil to 190°C. Second fry 3-4 minutes until shatteringly crisp and golden.', duration: '5 min' },
      { stepNumber: 5, instruction: 'Mix gochujang, soy sauce, honey, vinegar, garlic, and sesame oil in a pan. Simmer 2 minutes.', duration: '2 min' },
      { stepNumber: 6, instruction: 'Toss hot chicken in sauce until each piece is gloriously coated. Garnish and serve immediately.', duration: '2 min' }
    ]
  },
  {
    title: 'Lemon Ricotta Pancakes',
    description: 'Cloud-like, pillowy pancakes enriched with ricotta and brightened with lemon zest. The fluffiest pancakes you will ever make — weekend brunch perfected.',
    category: 'Breakfast', cuisine: 'American', difficulty: 'Easy',
    prepTime: 15, cookTime: 20, servings: 4, isFeatured: false, rating: 4.6,
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&auto=format&fit=crop',
    tags: ['Breakfast', 'Pancakes', 'Brunch', 'Lemon'], author: 'Chef Sara',
    nutrition: { calories: 340, protein: 14, carbohydrates: 44, fat: 12, fiber: 1, sugar: 12 },
    ingredients: [
      { name: 'Ricotta cheese', quantity: '250', unit: 'g' },
      { name: 'Eggs', quantity: '3', unit: 'large', notes: 'separated' },
      { name: 'Plain flour', quantity: '120', unit: 'g' },
      { name: 'Baking powder', quantity: '1.5', unit: 'tsp' },
      { name: 'Caster sugar', quantity: '2', unit: 'tbsp' },
      { name: 'Lemons', quantity: '2', unit: 'whole', notes: 'zested and juiced' },
      { name: 'Milk', quantity: '60', unit: 'ml' },
      { name: 'Butter', quantity: '20', unit: 'g', notes: 'for cooking' },
      { name: 'Maple syrup and berries', quantity: '1', unit: 'serving', notes: 'to serve' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Whisk together ricotta, egg yolks, lemon zest, lemon juice, and milk until smooth.', duration: '3 min' },
      { stepNumber: 2, instruction: 'Fold in sifted flour, baking powder, and sugar. Do not overmix.', duration: '2 min' },
      { stepNumber: 3, instruction: 'Beat egg whites to stiff peaks. Fold gently into batter in three additions — this is the secret to fluffiness.', duration: '5 min' },
      { stepNumber: 4, instruction: 'Heat butter in non-stick pan on medium-low. Pour 1/4 cup batter per pancake.', duration: '2 min' },
      { stepNumber: 5, instruction: 'Cook until bubbles form and edges look set (3-4 min). Flip once and cook 2 more minutes.', duration: '5 min' },
      { stepNumber: 6, instruction: 'Serve stacked with fresh berries, maple syrup, and an extra dusting of icing sugar.', duration: '2 min' }
    ]
  },
  {
    title: 'Roasted Butternut Squash Soup',
    description: 'Velvety, golden soup made from caramelised roasted butternut squash with warming spices and a swirl of crème fraîche. Pure autumnal luxury in a bowl.',
    category: 'Appetizer', cuisine: 'Modern', difficulty: 'Easy',
    prepTime: 15, cookTime: 45, servings: 6, isFeatured: false, rating: 4.7,
    image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800&auto=format&fit=crop',
    tags: ['Soup', 'Vegetarian', 'Autumn', 'Healthy'], author: 'Chef Henri',
    nutrition: { calories: 180, protein: 4, carbohydrates: 28, fat: 7, fiber: 4, sugar: 8 },
    ingredients: [
      { name: 'Butternut squash', quantity: '1.2', unit: 'kg', notes: 'peeled and cubed' },
      { name: 'Onions', quantity: '2', unit: 'large', notes: 'quartered' },
      { name: 'Garlic', quantity: '6', unit: 'cloves', notes: 'unpeeled' },
      { name: 'Vegetable stock', quantity: '1', unit: 'litre' },
      { name: 'Coconut milk', quantity: '200', unit: 'ml' },
      { name: 'Ground cumin', quantity: '1', unit: 'tsp' },
      { name: 'Smoked paprika', quantity: '1', unit: 'tsp' },
      { name: 'Nutmeg', quantity: '1/4', unit: 'tsp' },
      { name: 'Olive oil', quantity: '3', unit: 'tbsp' },
      { name: 'Crème fraîche', quantity: '4', unit: 'tbsp', notes: 'to serve' },
      { name: 'Pumpkin seeds', quantity: '30', unit: 'g', notes: 'toasted, to serve' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Preheat oven to 200°C. Toss squash, onions, and garlic cloves with oil and spices. Roast 35-40 minutes until caramelised.', duration: '40 min' },
      { stepNumber: 2, instruction: 'Squeeze roasted garlic cloves from skins. Add all roasted vegetables to a blender.', duration: '3 min' },
      { stepNumber: 3, instruction: 'Add stock and coconut milk. Blend in batches until completely smooth and silky.', duration: '5 min' },
      { stepNumber: 4, instruction: 'Return to pot. Heat through and adjust seasoning with salt, pepper, and a pinch of nutmeg.', duration: '5 min' },
      { stepNumber: 5, instruction: 'Serve in warm bowls with a swirl of crème fraîche, toasted pumpkin seeds, and a drizzle of good olive oil.', duration: '2 min' }
    ]
  },
  {
    title: 'Chocolate Fondant with Salted Caramel',
    description: 'A perfectly molten chocolate fondant with a flowing dark chocolate centre, served with homemade salted caramel and vanilla ice cream. Restaurant dessert made at home.',
    category: 'Dessert', cuisine: 'French', difficulty: 'Medium',
    prepTime: 25, cookTime: 12, servings: 4, isFeatured: true, rating: 4.9,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop',
    tags: ['Dessert', 'Chocolate', 'French', 'Dinner Party'], author: 'Chef Pierre',
    nutrition: { calories: 480, protein: 8, carbohydrates: 52, fat: 28, fiber: 3, sugar: 42 },
    ingredients: [
      { name: 'Dark chocolate (70%)', quantity: '200', unit: 'g', notes: 'chopped' },
      { name: 'Butter', quantity: '150', unit: 'g', notes: 'plus extra for greasing' },
      { name: 'Eggs', quantity: '4', unit: 'large' },
      { name: 'Egg yolks', quantity: '2', unit: 'extra' },
      { name: 'Caster sugar', quantity: '100', unit: 'g' },
      { name: 'Plain flour', quantity: '50', unit: 'g' },
      { name: 'Cocoa powder', quantity: '2', unit: 'tbsp', notes: 'for dusting' },
      { name: 'Double cream', quantity: '150', unit: 'ml', notes: 'for caramel' },
      { name: 'Caster sugar', quantity: '150', unit: 'g', notes: 'for caramel' },
      { name: 'Sea salt flakes', quantity: '1', unit: 'tsp' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Butter 4 ramekins and dust with cocoa. Chill in freezer. This is non-negotiable for clean unmoulding.', duration: '5 min' },
      { stepNumber: 2, instruction: 'Melt chocolate and butter together over a bain-marie or in microwave in 30-second bursts. Cool slightly.', duration: '8 min' },
      { stepNumber: 3, instruction: 'Whisk eggs, yolks, and sugar until pale and thick (ribbon stage). Fold into chocolate mixture.', duration: '5 min' },
      { stepNumber: 4, instruction: 'Sift flour into mixture and fold gently until just combined. Fill ramekins to 3/4 full.', duration: '3 min' },
      { stepNumber: 5, instruction: 'Can be refrigerated at this point up to 24 hours. Preheat oven to 200°C.', duration: '0 min' },
      { stepNumber: 6, instruction: 'Bake exactly 10-12 minutes. Edges set, centre still wobbles. Timing is everything.', duration: '12 min' },
      { stepNumber: 7, instruction: 'Make caramel: melt sugar until amber, add warm cream carefully, stir in salt and butter. Rest 1 minute then turn out fondants.', duration: '5 min' }
    ]
  },
  {
    title: 'Classic Margherita Pizza',
    description: 'Neapolitan-style pizza with a blistered, chewy crust, San Marzano tomatoes, fresh buffalo mozzarella and basil. Simple, authentic, and better than any delivery.',
    category: 'Dinner', cuisine: 'Italian', difficulty: 'Medium',
    prepTime: 30, cookTime: 15, servings: 2, isFeatured: false, rating: 4.8,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop',
    tags: ['Italian', 'Pizza', 'Vegetarian', 'Classic'], author: 'Chef Marco',
    nutrition: { calories: 480, protein: 22, carbohydrates: 62, fat: 16, fiber: 3, sugar: 5 },
    ingredients: [
      { name: 'Strong bread flour', quantity: '300', unit: 'g' },
      { name: 'Instant yeast', quantity: '7', unit: 'g' },
      { name: 'Fine salt', quantity: '8', unit: 'g' },
      { name: 'Warm water', quantity: '200', unit: 'ml' },
      { name: 'Olive oil', quantity: '1', unit: 'tbsp' },
      { name: 'San Marzano tomatoes', quantity: '400', unit: 'g', notes: 'crushed by hand' },
      { name: 'Buffalo mozzarella', quantity: '150', unit: 'g', notes: 'torn' },
      { name: 'Fresh basil', quantity: '1', unit: 'handful' },
      { name: 'Extra virgin olive oil', quantity: '2', unit: 'tbsp', notes: 'to finish' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Mix flour, yeast, and salt. Add water and olive oil. Knead 10 minutes until smooth and elastic.', duration: '15 min' },
      { stepNumber: 2, instruction: 'Cover and prove at room temperature 1-2 hours until doubled in size.', duration: '90 min' },
      { stepNumber: 3, instruction: 'Divide into 2 balls. Rest 15 minutes covered. Preheat oven with pizza stone to maximum (250°C+).', duration: '15 min' },
      { stepNumber: 4, instruction: 'Stretch dough by hand — do not use a rolling pin. Season tomatoes with salt only.', duration: '5 min' },
      { stepNumber: 5, instruction: 'Spread a thin layer of tomato on dough. No mozzarella yet. Bake 7 minutes.', duration: '7 min' },
      { stepNumber: 6, instruction: 'Add torn mozzarella. Return to oven 5-6 more minutes until cheese bubbles and crust blisters.', duration: '6 min' },
      { stepNumber: 7, instruction: 'Remove. Scatter fresh basil and drizzle with best olive oil. Serve immediately.', duration: '2 min' }
    ]
  }
];

const substitutions = [
  {
    ingredient: 'butter',
    tasteBased: [
      { name: 'Ghee', ratio: '1:1', notes: 'Richer, nuttier flavour. Great for high heat cooking and Indian-inspired dishes.' },
      { name: 'Coconut oil', ratio: '1:1', notes: 'Adds a mild coconut flavour. Best for baking at medium temperatures.' },
      { name: 'Olive oil', ratio: '3/4:1', notes: 'Use 75% the amount. Best for savoury dishes, not baking.' },
      { name: 'Vegetable shortening', ratio: '1:1', notes: 'Neutral flavour, same fat content. Ideal for flaky pastry.' }
    ],
    nutritionBased: [
      { name: 'Avocado', ratio: '1:1', calories: 160, protein: 2, notes: 'Adds healthy monounsaturated fats. Works well in brownies and chocolate cakes.' },
      { name: 'Greek yogurt', ratio: '1:1', calories: 60, protein: 10, notes: 'Reduces fat significantly. Adds protein and tang to baked goods.' },
      { name: 'Applesauce', ratio: '1:1', calories: 25, protein: 0, notes: 'Reduces fat and calories. Adds moisture and sweetness. Great in muffins.' },
      { name: 'Nut butter', ratio: '7/8:1', calories: 190, protein: 8, notes: 'High protein and healthy fats. Adds nutty depth to sweet bakes.' }
    ]
  },
  {
    ingredient: 'eggs',
    tasteBased: [
      { name: 'Flax egg (1 tbsp ground flax + 3 tbsp water)', ratio: '1:1', notes: 'Neutral flavour. Best for binding in cookies, muffins, and dense cakes.' },
      { name: 'Chia egg (1 tbsp chia seeds + 3 tbsp water)', ratio: '1:1', notes: 'Slight crunch. Great for muffins and pancakes.' },
      { name: 'Mashed banana (60g)', ratio: '1:1', notes: 'Adds sweetness and banana flavour. Best in naturally sweet recipes.' },
      { name: 'Commercial egg replacer', ratio: '1:1', notes: 'Most neutral option. Follow packet instructions for precise results.' }
    ],
    nutritionBased: [
      { name: 'Aquafaba (3 tbsp)', ratio: '1:1', calories: 5, protein: 1, notes: 'Liquid from canned chickpeas. Low calorie, can be whipped like egg whites.' },
      { name: 'Silken tofu (60g, blended)', ratio: '1:1', calories: 35, protein: 4, notes: 'High protein, neutral taste. Great for dense baked goods and quiches.' },
      { name: 'Plain yogurt (60g)', ratio: '1:1', calories: 40, protein: 4, notes: 'Adds moisture and protein. Works in cakes and quick breads.' }
    ]
  },
  {
    ingredient: 'all-purpose flour',
    tasteBased: [
      { name: 'Bread flour', ratio: '1:1', notes: 'Higher protein for better structure and chew. Ideal for pizza and bread.' },
      { name: 'Cake flour', ratio: '1:1', notes: 'Lower protein. Lighter, more tender results. Perfect for sponge cakes.' },
      { name: 'Spelt flour', ratio: '1:1', notes: 'Nutty flavour. Slightly denser texture but wonderfully wholesome.' },
      { name: 'Self-raising flour', ratio: '1:1', notes: 'Use only in recipes without separate baking powder. Contains raising agents.' }
    ],
    nutritionBased: [
      { name: 'Almond flour', ratio: '1:1', calories: 160, protein: 6, notes: 'Gluten-free, high fat. Adds moisture and nuttiness. Dense texture.' },
      { name: 'Oat flour', ratio: '1:1', calories: 110, protein: 4, notes: 'Gluten-free option. Slightly sweet, hearty texture. Blend rolled oats yourself.' },
      { name: 'Chickpea flour', ratio: '1:1', calories: 100, protein: 6, notes: 'High protein and fibre. Slightly earthy flavour. Great for savoury dishes.' },
      { name: 'Coconut flour', ratio: '1/4:1', calories: 120, protein: 4, notes: 'Use just 25% — it absorbs much more liquid. Increase eggs or liquid.' }
    ]
  },
  {
    ingredient: 'milk',
    tasteBased: [
      { name: 'Oat milk', ratio: '1:1', notes: 'Creamy texture, slightly sweet. The most versatile dairy-free milk for cooking and baking.' },
      { name: 'Almond milk', ratio: '1:1', notes: 'Light, nutty flavour. Lower calorie. Thinner than dairy milk.' },
      { name: 'Soy milk', ratio: '1:1', notes: 'Closest protein content to dairy milk. Neutral flavour. Curdles well for buttermilk substitute.' },
      { name: 'Full-fat coconut milk (diluted)', ratio: '1:1', notes: 'Mix 50/50 with water. Adds richness and coconut flavour.' }
    ],
    nutritionBased: [
      { name: 'Light coconut milk', ratio: '1:1', calories: 45, protein: 0, notes: 'Rich and creamy. Adds coconut flavour. Higher fat than other alternatives.' },
      { name: 'Rice milk', ratio: '1:1', calories: 47, protein: 0, notes: 'Very light, mildly sweet. Thinnest consistency — best in sauces and soups.' },
      { name: 'Evaporated skim milk', ratio: '1:1', calories: 60, protein: 8, notes: 'Concentrated dairy with higher protein. Rich texture without extra fat.' }
    ]
  },
  {
    ingredient: 'sugar',
    tasteBased: [
      { name: 'Honey', ratio: '3/4:1', notes: 'Use 75% the amount. Adds floral notes. Reduce liquid in recipe by 3 tbsp per cup.' },
      { name: 'Maple syrup', ratio: '3/4:1', notes: 'Use 75%. Adds caramel, woodsy flavour. Reduce liquid slightly. Excellent in baking.' },
      { name: 'Coconut sugar', ratio: '1:1', notes: 'Similar sweetness with caramel undertones. Lower GI. Works 1:1 in almost any recipe.' },
      { name: 'Date paste', ratio: '1:1', notes: 'Blend dates with water to a paste. Adds caramel-fruit notes and extra fibre.' }
    ],
    nutritionBased: [
      { name: 'Stevia', ratio: '1 tsp:1 cup', calories: 0, protein: 0, notes: 'Zero calorie. Very sweet — use sparingly. Can have slight aftertaste.' },
      { name: 'Monk fruit sweetener', ratio: '1:1', calories: 0, protein: 0, notes: 'Zero calorie, zero glycaemic impact. Best natural sugar-free substitute for baking.' },
      { name: 'Erythritol', ratio: '1:1', calories: 0, protein: 0, notes: 'Zero net carbs. Closest to sugar texture. Good for keto baking.' }
    ]
  },
  {
    ingredient: 'heavy cream',
    tasteBased: [
      { name: 'Coconut cream', ratio: '1:1', notes: 'Rich, tropical flavour. Whips beautifully when refrigerated overnight. Best in desserts.' },
      { name: 'Half-and-half + butter', ratio: '7/8 + 1/8 cup butter per cup', notes: 'Closest fat content to heavy cream. Use for sauces and soups.' },
      { name: 'Cashew cream', ratio: '1:1', notes: 'Soak 200g cashews overnight, blend smooth. Neutral, incredibly creamy vegan option.' }
    ],
    nutritionBased: [
      { name: 'Evaporated skim milk', ratio: '1:1', calories: 60, protein: 6, notes: 'Much lower fat. Will not whip. Great for creamy pasta sauces.' },
      { name: 'Greek yogurt', ratio: '1:1', calories: 60, protein: 10, notes: 'High protein. Adds tanginess. Do not boil — use off heat or it will split.' },
      { name: 'Silken tofu (blended)', ratio: '1:1', calories: 50, protein: 5, notes: 'Blend until perfectly smooth. Great for soups and creamy sauces.' }
    ]
  },
  {
    ingredient: 'olive oil',
    tasteBased: [
      { name: 'Avocado oil', ratio: '1:1', notes: 'Neutral flavour, even higher smoke point. Ideal for high-heat cooking.' },
      { name: 'Vegetable oil', ratio: '1:1', notes: 'Neutral, budget-friendly. No flavour contribution — perfect when you want clean taste.' },
      { name: 'Sunflower oil', ratio: '1:1', notes: 'Light neutral flavour. Good all-rounder for cooking and baking.' }
    ],
    nutritionBased: [
      { name: 'Chicken or vegetable stock', ratio: '1:1', calories: 5, protein: 1, notes: 'Near zero calories. Great for sautéing vegetables. Use on medium-low heat only.' },
      { name: 'Coconut aminos', ratio: '1:2', calories: 10, protein: 0, notes: 'Use half the amount. Adds umami. Good for Asian-inspired dishes.' }
    ]
  },
  {
    ingredient: 'sour cream',
    tasteBased: [
      { name: 'Greek yogurt', ratio: '1:1', notes: 'Thicker and tangier. Closest substitute. Use full-fat for best results.' },
      { name: 'Crème fraîche', ratio: '1:1', notes: 'Richer and slightly less tart. Stable when heated, unlike sour cream.' },
      { name: 'Cream cheese (thinned)', ratio: '1:1', notes: 'Mix with a little milk to loosen. Richer flavour, works in dips and sauces.' }
    ],
    nutritionBased: [
      { name: 'Low-fat Greek yogurt', ratio: '1:1', calories: 35, protein: 8, notes: 'Half the calories, double the protein. Slight thinner texture.' },
      { name: 'Cottage cheese (blended)', ratio: '1:1', calories: 45, protein: 11, notes: 'Blend until smooth. High protein, low fat. Mild flavour.' }
    ]
  }
];

async function seed() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-recipe-finder';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Recipe.deleteMany({});
    await Substitution.deleteMany({});

    const createdRecipes = await Recipe.insertMany(recipes);
    const createdSubs = await Substitution.insertMany(substitutions);

    console.log(`✅ Seeded ${createdRecipes.length} recipes`);
    console.log(`✅ Seeded ${createdSubs.length} substitutions`);
    console.log('\nRecipes added:');
    createdRecipes.forEach(r => console.log(`  - ${r.title} (${r.category}, ${r.difficulty})`));

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
