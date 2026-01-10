import Navbar from "../component/Navbar";
import RecipeCard from "../component/RecipeCard";
import { recommendedRecipes } from "../data/recipe";

function FavoritePage() {
  const favoriteRecipe = recommendedRecipes.filter(
    (recipe) => recipe.isFavorite
  );
  return (
    <>
      <div className="min-h-screen bg-[#FFEDDD]">
        <Navbar />
        <div className="mt-2 flex flex-col relative max-w-7xl m-auto w-[60%]">
          {/* Title */}
          <h1 className="p-8 text-5xl">Favorite</h1>
          <div className="mt-3 mb-20">
            <RecipeCard recipes={favoriteRecipe} />
          </div>
        </div>
      </div>
    </>
  );
}

export default FavoritePage;
