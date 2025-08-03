
import { Recipe, Category } from '../types/types';

const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

export const fetchRecipesByName = async (name: string): Promise<Recipe[]> => {
  const response = await fetch(`${API_BASE}/search.php?s=${name}`);
  const data = await response.json();
  return data.meals || [];
};

export const fetchRecipeById = async (id: string): Promise<Recipe | null> => {
  const response = await fetch(`${API_BASE}/lookup.php?i=${id}`);
  const data = await response.json();
  return data.meals ? data.meals[0] : null;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE}/categories.php`);
  const data = await response.json();
  return data.categories || [];
};

export const fetchRecipesByCategory = async (category: string): Promise<Recipe[]> => {
  const response = await fetch(`${API_BASE}/filter.php?c=${category}`);
  const data = await response.json();
  const meals = data.meals || [];

  // Fetch full details for each meal
  const detailedRecipes = await Promise.all(
    meals.map(async (meal: any) => {
      const res = await fetch(`${API_BASE}/lookup.php?i=${meal.idMeal}`);
      const detailData = await res.json();
      return detailData.meals ? detailData.meals[0] : null;
    })
  );

  // Filter out any null responses
  return detailedRecipes.filter((recipe) => recipe !== null);
};
