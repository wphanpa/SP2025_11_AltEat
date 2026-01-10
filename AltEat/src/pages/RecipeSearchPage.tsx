import Navbar from "../component/Navbar";
import SearchSideBar from "../component/SearchSideBar";
import { recipeFilter } from "../data/recipeFilter";
import recipe from "../assets/recipe.png";
import search from "../assets/search.png";
import { recommendedRecipes } from "../data/recipe";
import RecipeCard from "../component/RecipeCard";

function RecipeSearchPage() {
  const filterSection = [
    {
      title: "Ingredient",
      items: recipeFilter[0].ingredient,
    },
    {
      title: "Cooking Method",
      items: recipeFilter[0].method,
    },
    {
      title: "Cuisine",
      items: recipeFilter[0].cuisine,
    },
  ];
  return (
    <>
      <div className="min-h-screen bg-[#FFEDDD]">
        <div className="relative">
          <Navbar />
          <div className="flex">
            {/* Side Bar */}
            <SearchSideBar filter={filterSection} />

            <div className="flex-1 flex justify-center">
              {/* Main Content */}
              <div className="flex flex-col items-center mb-20 max-w-7xl w-[85%]">
                <div className="flex items-center mb-5">
                  {/* Title */}
                  <div>
                    <h1 className="text-5xl mb-4">
                      Recipe Suggestion and Look Up
                    </h1>
                    <p className="text-[16px]">
                      Not sure what to cook? Get recipe ideas based on the
                      ingredients you have!
                    </p>
                  </div>
                  <img src={recipe} />
                </div>

                {/* Text Input */}
                <div className="w-full relative">
                  <img src={search} className="absolute right-4 top-3" />
                  <input
                    type="text"
                    placeholder="Search recipes or ingredients…"
                    className="px-6 py-3 bg-white w-full rounded-[20px] outline-[1.5px] shadow-[0_8px_4px_rgba(0,0,0,0.25)]"
                  />
                </div>

                {/* Card Item */}
                <div className="w-full">
                  <h3 className="my-7 text-2xl">You can make X recipes</h3>
                  <div className="flex flex-col items-start">
                    <RecipeCard recipes={recommendedRecipes} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecipeSearchPage;
