import { Link } from 'react-router-dom';
import { Clock, ChefHat, Star, Trash2, Edit } from 'lucide-react';
import './RecipeCard.css';

const difficultyColor = { Easy: '#5C6645', Medium: '#B85C38', Hard: '#2A2620' };

export default function RecipeCard({ recipe, onDelete, showActions }) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const imageUrl = recipe.image || `https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&auto=format&fit=crop`;

  return (
    <article className="recipe-card">
      <Link to={`/recipe/${recipe._id}`} className="recipe-card__image-wrap">
        <img src={imageUrl} alt={recipe.title} loading="lazy" className="recipe-card__image" />
        <div className="recipe-card__overlay">
          <span className="recipe-card__view">View Recipe</span>
        </div>
        {recipe.isFeatured && <span className="recipe-card__badge">Featured</span>}
      </Link>

      <div className="recipe-card__body">
        <div className="recipe-card__meta">
          <span className="recipe-card__cuisine">{recipe.cuisine}</span>
          <span className="recipe-card__category tag">{recipe.category}</span>
        </div>

        <Link to={`/recipe/${recipe._id}`}>
          <h3 className="recipe-card__title">{recipe.title}</h3>
        </Link>

        <p className="recipe-card__desc">{recipe.description?.slice(0, 100)}...</p>

        <div className="recipe-card__footer">
          <div className="recipe-card__stats">
            <span className="recipe-card__stat">
              <Clock size={13} />
              {totalTime} min
            </span>
            <span className="recipe-card__stat">
              <ChefHat size={13} />
              <span style={{ color: difficultyColor[recipe.difficulty] }}>{recipe.difficulty}</span>
            </span>
            {recipe.rating > 0 && (
              <span className="recipe-card__stat">
                <Star size={13} fill="currentColor" />
                {Number(recipe.rating).toFixed(1)}
              </span>
            )}
          </div>

          {showActions && (
            <div className="recipe-card__actions">
              <Link to={`/edit-recipe/${recipe._id}`} className="recipe-card__action-btn edit">
                <Edit size={14} />
              </Link>
              <button className="recipe-card__action-btn delete" onClick={() => onDelete(recipe._id)}>
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
