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
    isCustom: true, // ← Important for hiding like button
  });

  const [ingredients, setIngredients] = useState<{ ingredient: string; measure: string }[]>([
    { ingredient: '', measure: '' },
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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

    // Build recipe object
    const newRecipe: any = {
      idMeal: uuidv4(),
      ...formData,
      isCustom: true,
    };

    ingredients.forEach((item, index) => {
      newRecipe[`strIngredient${index + 1}`] = item.ingredient;
      newRecipe[`strMeasure${index + 1}`] = item.measure;
    });

    // Update localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => {
      if (u.email === user.email) {
        return {
          ...u,
          customRecipes: [...(u.customRecipes || []), newRecipe],
        };
      }
      return u;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));

    const currentUser = {
      ...user,
      customRecipes: [...user.customRecipes, newRecipe],
    };
    localStorage.setItem('user', JSON.stringify(currentUser));

    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl text-center font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
        Add New Recipe
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Recipe Name</label>
          <input
            type="text"
            name="strMeal"
            value={formData.strMeal}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
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
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Area</label>
            <input
              type="text"
              name="strArea"
              value={formData.strArea}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
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
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                className="col-span-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                  className="ml-2 px-2 bg-red-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 px-3 py-1 bg-gradient-to-r from-orange-400 to-yellow-400 text-white hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
            className="w-full px-3 py-2 border rounded h-40 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

       

        

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          Save Recipe
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;
