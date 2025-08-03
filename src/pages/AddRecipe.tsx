import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Recipe } from '../types/types';

const AddRecipe: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<Recipe, 'idMeal'>>({
    strMeal: '',
    strCategory: '',
    strArea: '',
    strInstructions: '',
    strMealThumb: '',
    strTags: '',
    strYoutube: '',
 
 
  });
  const [ingredients, setIngredients] = useState<{ ingredient: string; measure: string }[]>([
    { ingredient: '', measure: '' }
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index: number, field: 'ingredient' | 'measure', value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { ingredient: '', measure: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Create the recipe object
    const recipe: Recipe = {
      idMeal: uuidv4(),
      ...formData,
    };

    // Add ingredients and measures
    ingredients.forEach((item, index) => {
      recipe[`strIngredient${index + 1}` as keyof Recipe] = item.ingredient;
      recipe[`strMeasure${index + 1}` as keyof Recipe] = item.measure;
    });

    // Update user's custom recipes in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => {
      if (u.email === user.email) {
        return {
          ...u,
          customRecipes: [...u.customRecipes, recipe]
        };
      }
      return u;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Update current user in context
    const currentUser = {
      ...user,
      customRecipes: [...user.customRecipes, recipe]
    };
    localStorage.setItem('user', JSON.stringify(currentUser));
    
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Add New Recipe</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Recipe Name</label>
          <input
            type="text"
            name="strMeal"
            value={formData.strMeal}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Category</label>
            <input
              type="text"
              name="strCategory"
              value={formData.strCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Cuisine</label>
            <input
              type="text"
              name="strArea"
              value={formData.strArea}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Image URL</label>
          <input
            type="url"
            name="strMealThumb"
            value={formData.strMealThumb}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Ingredients</label>
          {ingredients.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                value={item.ingredient}
                onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)}
                className="col-span-2 px-3 py-2 border rounded"
                placeholder="Ingredient"
                required
              />
              <div className="flex">
                <input
                  type="text"
                  value={item.measure}
                  onChange={(e) => handleIngredientChange(index, 'measure', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="Measure"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="ml-2 px-2 bg-red-500 text-white rounded"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Add Ingredient
          </button>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Instructions</label>
          <textarea
            name="strInstructions"
            value={formData.strInstructions}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded h-40"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Save Recipe
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;