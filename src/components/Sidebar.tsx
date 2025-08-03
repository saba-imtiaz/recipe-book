import React from 'react';
import { Category } from '../types/types';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
<div className="w-64 p-4 bg-white text-gray-800 shadow-md rounded-lg mr-9 mt-0 h-fit">

      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <ul>
        <li
          className={`mb-2 px-3 py-2 rounded cursor-pointer ${
            !selectedCategory ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-medium' : 'hover:bg-gray-100'
          }`}
          onClick={() => onSelectCategory(null)}
        >
          All
        </li>
        {categories.map((category) => (
          <li
            key={category.idCategory}
            className={`mb-2 px-3 py-2 rounded cursor-pointer ${
              selectedCategory === category.strCategory
                ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-medium'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onSelectCategory(category.strCategory)}
          >
            {category.strCategory}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
