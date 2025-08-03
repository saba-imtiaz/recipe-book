export interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string | null;
  strYoutube?: string | null;
}




export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface User {
  email: string;
  password: string;
  name?: string;
  likedRecipes: string[];     // recipe IDs
  customRecipes: Recipe[];    // full recipe objects
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (user: Omit<User, 'likedRecipes' | 'customRecipes'>) => void;
  logout: () => void;
}
