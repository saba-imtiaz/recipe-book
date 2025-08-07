// Represents a recipe from the API or a custom user-created one
export interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string | null;
  strYoutube?: string | null;
  isCustom?: boolean; // True if it's a custom (user-added) recipe
}

// Represents a custom recipe with ingredients added by the user
export interface CustomRecipe {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions: string;
  strMealThumb?: string; // Optional because user may not upload an image
  ingredients: string[];
  isCustom?: boolean; // True if it's a custom recipe
}

// Represents a meal category (used for browsing or filtering)
export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

// Represents a user of the app
export interface User {
  email: string;
  password: string;
  name?: string;
  likedRecipes: string[]; // Array of recipe IDs the user liked
  customRecipes: CustomRecipe[]; // User-added custom recipes
}

// Defines the shape of the authentication context
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (user: Omit<User, 'likedRecipes' | 'customRecipes'>) => void;
  logout: () => void;
}
