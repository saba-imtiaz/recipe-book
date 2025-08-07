import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchRecipeById } from '../services/recipeAPI';
import { Recipe } from '../types/types';
import RecipeCard from '../components/RecipeCard';
import { Link } from 'react-router-dom';
import { HeartIcon, TrashIcon } from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const loadLikedRecipes = async () => {
      if (user?.likedRecipes?.length) {
        const recipes = await Promise.all(
          user.likedRecipes.map(id => fetchRecipeById(id))
        );
        setLikedRecipes(recipes.filter(Boolean) as Recipe[]);
      }
    };

    const loadCustomRecipes = () => {
      if (user?.customRecipes?.length) {
        const normalized = user.customRecipes.map(r => ({
          ...r,
          strMealThumb: r.strMealThumb || 'https://via.placeholder.com/400x300',
          strCategory: r.strCategory || 'Unknown',
          strArea: r.strArea || 'Unknown',
          strInstructions: r.strInstructions || 'No instructions provided.',
        }));
        setCustomRecipes(normalized);
      }
    };

    loadLikedRecipes();
    loadCustomRecipes();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p className="text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
          Please login to view your dashboard
        </p>
        <Link to="/login" className="text-black underline mt-2 inline-block">
          Go to Login
        </Link>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    const updatedCustoms = customRecipes.filter(r => r.idMeal !== id);
    setCustomRecipes(updatedCustoms);

    const updatedUser = { ...user, customRecipes: updatedCustoms };
    window.dispatchEvent(new CustomEvent('userUpdate', { detail: updatedUser }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
          Welcome, {user.name}
        </h1>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Liked Recipes</h2>
        {likedRecipes.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {likedRecipes.map(recipe => (
              <div key={recipe.idMeal} className="relative w-full max-w-xs mx-auto">
                <RecipeCard recipe={recipe} />
                <div className="absolute top-2 right-2 flex gap-2">
                  <HeartIcon className="w-5 h-5 text-red-500" title="Liked" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't liked any recipes yet.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Custom Recipes</h2>
        {customRecipes.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {customRecipes.map(recipe => (
              <div key={recipe.idMeal} className="relative w-full max-w-xs mx-auto">
                <RecipeCard recipe={recipe} />
                <div className="absolute top-2 right-2 flex gap-2">
                  <TrashIcon
                    className="w-5 h-5 text-gray-500 cursor-pointer hover:text-red-600"
                    title="Delete Recipe"
                    onClick={() => handleDelete(recipe.idMeal)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't added any custom recipes yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
