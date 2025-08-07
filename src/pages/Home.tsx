import React, { useEffect, useState } from 'react';
import { fetchRecipesByName, fetchCategories, fetchRecipesByCategory } from '../services/recipeAPI';
import { Recipe, Category } from '../types/types';
import RecipeCard from '../components/RecipeCard';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';

const Home: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  useEffect(() => {
    const loadCategories = async () => {
      const loadedCategories = await fetchCategories();
      setCategories(loadedCategories);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadRecipes = async () => {
      let loadedRecipes: Recipe[] = [];
      if (searchQuery.trim()) {
        loadedRecipes = await fetchRecipesByName(searchQuery.trim());
      } else if (selectedCategory) {
        loadedRecipes = await fetchRecipesByCategory(selectedCategory);
      } else {
        loadedRecipes = await fetchRecipesByName('');
      }
      setRecipes(loadedRecipes || []);
    };

    const timer = setTimeout(() => {
      loadRecipes();
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    setFilteredRecipes(recipes);
    setCurrentPage(1);
  }, [recipes]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen px-4 sm:px-8">
   
      <div className="text-center mt-0 mb-4">
        <h1 className="text-4xl sm:text-5xl font-bold">
          <span className="text-gray-900">Discover Amazing </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
            Recipes
          </span>
        </h1>
        <p className="mt-4 mb-8 text-gray-500 text-lg">
          Explore our collection of delicious recipes from around the world
        </p>
      </div>

      <div className="flex justify-center mb-4">
        <SearchBar onSearch={setSearchQuery} />
      </div>

   
      <div className="flex flex-col md:flex-row gap-6">
    
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

     
        <div className="flex-1">
          {currentRecipes.length === 0 ? (
            <p className="text-center text-gray-500">
              No recipes found. Try a different search or category.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentRecipes.map((recipe) => (
                <RecipeCard key={recipe.idMeal} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
