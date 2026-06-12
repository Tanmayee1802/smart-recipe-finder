# 🍽️ Saffron & Sage — Smart Recipe Finder

A full-stack MERN web application for discovering, creating, and managing recipes with intelligent ingredient substitutions.

---

## 📋 Project Overview

**Team:** Tanmayee · Renu Sri · Karthik  
**Stack:** MongoDB · Express · React · Node.js  

---

## ✨ Features

- 🔍 **Recipe Search** — by name, ingredients, cuisine, difficulty, category
- 📝 **Full CRUD** — add, edit, delete recipes with full validation
- 🧪 **Ingredient Substitutions** — taste-based AND nutrition-based alternatives
- 📊 **Nutritional Info** — calories, protein, carbs, fat, fiber, sugar per serving
- ⭐ **Reviews & Ratings** — add reviews with star ratings
- ✅ **Interactive Steps** — tick off cooking steps as you go
- 🎬 **Media Support** — images and YouTube video links
- 📱 **Fully Responsive** — mobile-first design
- 🌊 **Scroll Animations** — CasaCook-style parallax and reveal effects
- 🏷️ **Filter & Sort** — by category, difficulty, cuisine, rating, date

---

## 🗂️ Project Structure

```
smart-recipe-finder/
├── frontend/          ← React + Vite app
│   ├── src/
│   │   ├── components/   (Navbar, Footer, RecipeCard)
│   │   ├── pages/        (Home, Search, Detail, Form, Substitutions)
│   │   ├── context/      (RecipeContext)
│   │   ├── utils/        (api.js, useScrollReveal.js)
│   │   └── styles/       (globals.css)
│   └── package.json
│
├── backend/           ← Node.js + Express API
│   ├── models/        (Recipe.js, Substitution.js)
│   ├── routes/        (recipes.js, substitutions.js)
│   ├── middleware/    (errorHandler.js)
│   ├── seed.js        ← Sample data seeder
│   └── server.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

---

### 1. Clone & Setup

```bash
# No cloning needed — open the project folder
cd smart-recipe-finder
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and set your MONGO_URI

# Seed sample data (6 recipes + 6 substitutions)
npm run seed

# Start the server
npm run dev
# Server runs on http://localhost:5000
```

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
# App runs on http://localhost:5173
```

---

### 4. Open in Browser

Visit: **http://localhost:5173**

---

## 🌐 API Endpoints

### Recipes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes` | Get all recipes (with filters & pagination) |
| GET | `/api/recipes/featured` | Get featured recipes |
| GET | `/api/recipes/search-by-ingredients?ingredients=...` | Search by ingredients |
| GET | `/api/recipes/:id` | Get single recipe |
| POST | `/api/recipes` | Create recipe |
| PUT | `/api/recipes/:id` | Update recipe |
| DELETE | `/api/recipes/:id` | Delete recipe |
| POST | `/api/recipes/:id/reviews` | Add review |

### Query Params for GET /api/recipes
| Param | Example | Description |
|-------|---------|-------------|
| search | `?search=pasta` | Full-text search |
| category | `?category=Dinner` | Filter by category |
| difficulty | `?difficulty=Easy` | Filter by difficulty |
| cuisine | `?cuisine=Italian` | Filter by cuisine |
| sort | `?sort=-rating` | Sort field |
| page | `?page=2` | Pagination |
| limit | `?limit=12` | Results per page |
| featured | `?featured=true` | Featured only |

### Substitutions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/substitutions?ingredient=butter` | Find substitutes |
| GET | `/api/substitutions` | Get all substitutions |
| POST | `/api/substitutions` | Create substitution |

---

## 🎨 Design System

**Fonts:** Cormorant Garamond (serif, headings) + DM Sans (sans-serif, body)  
**Colors:**
- Sand `#F5F0E8` — background
- Terracotta `#B85C38` — accent
- Olive `#5C6645` — secondary
- Charcoal `#2A2620` — text

**Scroll Effects:**
- Parallax hero sections (CSS + JS)
- Intersection Observer reveal animations
- Staggered card animations
- Smooth hover transitions

---

## 📦 Tech Stack

### Frontend
- React 18 + Vite
- React Router v6
- Axios
- Lucide React (icons)
- Custom scroll reveal hooks

### Backend
- Node.js + Express
- Mongoose + MongoDB
- CORS, dotenv

---

## 🔧 Environment Variables

Create `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-recipe-finder
NODE_ENV=development
```

For MongoDB Atlas:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smart-recipe-finder
```

---

## 📱 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, featured recipes, categories, how it works |
| Search | `/search` | Full search with filters & pagination |
| Recipe Detail | `/recipe/:id` | Full recipe with steps, nutrition, reviews |
| Add Recipe | `/add-recipe` | Full form with validation |
| Edit Recipe | `/edit-recipe/:id` | Pre-filled edit form |
| Substitutions | `/substitutions` | Ingredient substitution finder |

---

*Built with ❤️ by Team Tanmayee, Renu Sri & Karthik*
