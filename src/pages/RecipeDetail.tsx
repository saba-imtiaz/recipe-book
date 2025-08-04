import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRecipeById } from '../services/recipeAPI';
import { Recipe } from '../types/types';
import { useAuth } from '../context/AuthContext';
import { HeartIcon } from '@heroicons/react/24/solid';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadRecipe = async () => {
      if (id) {
        const loadedRecipe = await fetchRecipeById(id);
        setRecipe(loadedRecipe);
        setLoading(false);
      }
    };
    loadRecipe();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!recipe) return <div className="text-center mt-10">Recipe not found</div>;

  const ingredients: string[] = [];
  const recipeData = recipe as Record<string, any>;

  for (let i = 1; i <= 20; i++) {
    const ingredient = recipeData[`strIngredient${i}`];
    const measure = recipeData[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== '') {
      ingredients.push(`${ingredient}${measure ? ` - ${measure}` : ''}`);
    }
  }

  const handleLike = () => {
    if (!user) {
      alert('Please login first');
      return;
    }

    if (!user.likedRecipes.includes(recipe.idMeal)) {
      const updatedUser = {
        ...user,
        likedRecipes: [...user.likedRecipes, recipe.idMeal],
      };

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: any) =>
        u.email === user.email ? updatedUser : u
      );

      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.location.reload();
    }
  };

  const isLiked = user?.likedRecipes.includes(recipe.idMeal);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link to="/" className="text-black mb-4 inline-block">← Back to Home</Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-64 object-cover"
        />

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">{recipe.strMeal}</h1>
            <button onClick={handleLike}>
              <HeartIcon
                className={`h-6 w-6 cursor-pointer transition ${
                  isLiked ? 'text-red-500' : 'text-gray-400'
                }`}
              />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.strCategory && (
              <span className="bg-gray-200 px-2 py-1 rounded text-sm">{recipe.strCategory}</span>
            )}
            {recipe.strArea && (
              <span className="bg-gray-200 px-2 py-1 rounded text-sm">{recipe.strArea}</span>
            )}
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Ingredients</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ingredients.map((item, index) => (
                <li
                  key={index}
                  className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-3 py-2 rounded text-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Instructions</h2>
            <div className="whitespace-pre-line text-gray-700 text-sm">
              {recipe.strInstructions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
