import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchRecipeById } from '../services/recipeAPI';
import { Recipe } from '../types/types';
import RecipeCard from '../components/RecipeCard';
import { Link, useNavigate } from 'react-router-dom';
import { HeartIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLikedRecipes = async () => {
      if (user && user.likedRecipes.length > 0) {
        const recipes = await Promise.all(
          user.likedRecipes.map(id => fetchRecipeById(id))
        );
        setLikedRecipes(recipes.filter(recipe => recipe !== null) as Recipe[]);
      }
    };
    loadLikedRecipes();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p className="text-xl">Please login to view your dashboard</p>
        <Link to="/login" className="text-blue-600 underline mt-2 inline-block">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Liked Recipes</h2>
          <Link
            to="/add-recipe"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add New Recipe
          </Link>
        </div>

        {likedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {likedRecipes.map(recipe => (
              <div key={recipe.idMeal} className="relative">
                <RecipeCard recipe={recipe} />
                <div className="absolute top-2 right-2 flex gap-2">
                  <HeartIcon className="w-6 h-6 text-red-500" title="Liked" />
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
        {user.customRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.customRecipes.map(recipe => (
              <div key={recipe.idMeal} className="relative">
                <RecipeCard recipe={recipe} />
                <div className="absolute top-2 right-2 flex gap-2">
                  <XCircleIcon className="w-6 h-6 text-gray-400" title="Your Recipe" />
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
