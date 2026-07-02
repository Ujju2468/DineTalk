import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Recipes from './pages/Recipes';
import MyRecipes from './pages/MyRecipes';
import RecipeDetail from './pages/RecipeDetail';
import RecipeForm from './pages/RecipeForm';
import Groups from './pages/Groups';
import Chat from './pages/Chat';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/recipes" />} />
          <Route path="/recipes" element={<PrivateRoute><Recipes /></PrivateRoute>} />
          <Route path="/recipes/new" element={<PrivateRoute><RecipeForm /></PrivateRoute>} />
          <Route path="/recipes/:id" element={<PrivateRoute><RecipeDetail /></PrivateRoute>} />
          <Route path="/recipes/:id/edit" element={<PrivateRoute><RecipeForm /></PrivateRoute>} />
          <Route path="/my-recipes" element={<PrivateRoute><MyRecipes /></PrivateRoute>} />
          <Route path="/groups" element={<PrivateRoute><Groups /></PrivateRoute>} />
          <Route path="/groups/:groupId/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/recipes" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
