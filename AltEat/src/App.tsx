// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import FavoritePage from "./pages/FavoritePage";
import ChatbotPage from "./pages/ChatbotPage";
import RecipeSearchPage from "./pages/RecipeSearchPage";
import IngredientSearchpage from "./pages/IngredientSearchPage";
import AboutUspage from "./pages/AboutUsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />
        <Route path="/favorite" element={<FavoritePage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/recipesearch" element={<RecipeSearchPage />} />
        <Route path="/ingredientsearch" element={<IngredientSearchpage />} />
        <Route path="/aboutus" element={<AboutUspage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
