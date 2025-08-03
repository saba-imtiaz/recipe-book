// App.tsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AddRecipe from './pages/AddRecipe';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const location = useLocation();
  const hideNavbarOn = ['/login', '/register'];
  const shouldShowNavbar = !hideNavbarOn.includes(location.pathname.toLowerCase());

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {shouldShowNavbar && <Navbar />}

      {/* Add padding only if navbar is shown */}
      <main className={`${shouldShowNavbar ? 'pt-20' : ''} container mx-auto px-4 py-4`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
