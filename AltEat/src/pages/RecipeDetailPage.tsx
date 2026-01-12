import Navbar from "../component/Navbar";
import { useRecommendedRecipes } from "../hooks/useRecommendedRecipes";
import { Heart } from "lucide-react";
import { useSupabaseFetch } from "../hooks/useSupabaseFetch";
import { Link, useParams } from "react-router-dom";

export interface Recipe {
  idx: number;
  id: number;
  recipe_name: string;
  prep_time: string | null;
  cook_time: string | null;
  total_time: string | null;
  servings: string;
  yield: string;
  ingredients: string;
  directions: string;
  rating: number;
  url: string;
  cuisine_path: string;
  nutrition: string | null;
  timing: string | null;
  img_src: string;
}

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: recipe,
    loading,
    error,
  } = useSupabaseFetch<Recipe>("recipe_staging", id);

  const { recipes: recommendedRecipes, loading: recommendedLoading } =
    useRecommendedRecipes(recipe?.id || 0, recipe?.cuisine_path || "");

  // Parse ingredients string into array
  const parseIngredients = (ingredientsString: string) => {
    if (!ingredientsString) return [];
    return ingredientsString.split(",").map((item: string) => item.trim());
  };

  // Parse directions string into steps array
  const parseDirections = (directionsString: string) => {
    if (!directionsString) return [];
    return directionsString.split("\n").filter((step: string) => step.trim());
  };

  // Parse tags from cuisine_path
  const parseTags = (cuisinePath: string) => {
    if (!cuisinePath) return [];
    return cuisinePath
      .split("/")
      .filter((tag: string) => tag.trim())
      .slice(0, 3);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#F5C55A] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Error loading recipe</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-xl text-gray-600">Recipe not found</p>
      </div>
    );
  }

  const ingredients = parseIngredients(recipe.ingredients);
  const steps = parseDirections(recipe.directions);
  const tags = parseTags(recipe.cuisine_path);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex relative">
        <main className="flex-1 p-8 max-w-3xl mx-auto overflow-y-auto">
          {/* Title */}
          <h1 className="font-(family-name:Alexandria) text-4xl font-bold text-center text-[#040404] mb-4">
            {recipe.recipe_name}
          </h1>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex gap-6 mt-8 mb-6 justify-center flex-wrap">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-1.5 bg-[#F5C55A] rounded-full text-sm text-[#694900] border border-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Timing & Servings Info */}
          {(recipe.prep_time ||
            recipe.cook_time ||
            recipe.total_time ||
            recipe.servings) && (
            <div className="flex gap-6 mb-8 justify-center flex-wrap text-sm">
              {recipe.prep_time && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-black">Prep Time:</span>
                  <span>{recipe.prep_time}</span>
                </div>
              )}
              {recipe.cook_time && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-black">Cook Time:</span>
                  <span>{recipe.cook_time}</span>
                </div>
              )}
              {recipe.total_time && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-black">Total Time:</span>
                  <span>{recipe.total_time}</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-black">Servings:</span>
                  <span>{recipe.servings}</span>
                </div>
              )}
            </div>
          )}

          {/* Image and Ingredients */}
          <div className="flex gap-6 mb-10">
            {recipe.img_src && (
              <div className="w-full md:w-72 h-64 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={recipe.img_src}
                  alt={recipe.recipe_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
            )}

            <div className="flex-1 border-3 border-black rounded-lg p-6 bg-[#FFE8B1]">
              <h2 className="text-xl font-bold text-black text-center mb-4">
                Ingredients
              </h2>
              <ul className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="text-[#562C0C] text-sm">
                    • {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          {steps.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-black mb-6">
                How to Make {recipe.recipe_name}
              </h2>
              <ol className="space-y-4">
                {steps.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#FBB496] flex items-center justify-center text-sm font-semibold text-gray-800">
                      {index + 1}
                    </span>
                    <p className="text-[#562C0C] text-sm leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Nutrition Information - Only displayed if data exists */}
          {recipe.nutrition && (
            <div className="bg-[#FFE6DD] border-2 border-gray-400 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-black mb-4">
                Nutrition Information
              </h2>
              <div className="text-sm text-black">
                <p>{recipe.nutrition}</p>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar - Recommended Recipes */}
        <aside className="w-80 p-6 border-l border-gray-200 sticky top-0 h-screen overflow-y-auto flex-shrink-0 bg-[#F5F5F5]">
          <h2 className="text-xl font-semibold text-black mb-6">
            Recommended recipes
          </h2>

          {recommendedLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-[#F5C55A] rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading...</p>
            </div>
          ) : recommendedRecipes.length > 0 ? (
            <div className="space-y-6">
              {recommendedRecipes.map((recipeItem) => {
                const recipeTags = parseTags(recipeItem.cuisine_path);

                return (
                  <Link
                    key={recipeItem.id}
                    to={`/recipe/${recipeItem.id}`}
                    className="block bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={recipeItem.img_src}
                        alt={recipeItem.recipe_name}
                        className="w-full h-40 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                      <button
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.preventDefault();
                          // TODO: Implement favorite functionality
                        }}
                      >
                        <Heart className="w-6 h-6 text-gray-400 fill-white hover:fill-red-500 hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                    <div className="py-3">
                      <h3 className="font-semibold text-[#040404] text-center mb-2 line-clamp-2">
                        {recipeItem.recipe_name}
                      </h3>
                      <div className="flex justify-center gap-2 flex-wrap">
                        {recipeTags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#FFCB69] rounded-full text-xs text-[#694900] border border-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center">
              No recommendations available
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
