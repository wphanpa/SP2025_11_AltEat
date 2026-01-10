import Navbar from "../Component/Navbar";
import SearchSideBar from "../Component/SearchSideBar";
import { recipeFilter } from "../data/recipeFilter";
import recipe from "../assets/recipe.png";
import search from "../assets/search.png"

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
            <SearchSideBar filter={filterSection} />
            <div className="flex-1 flex justify-center">
              <div className="w-fit flex flex-col items-center">
                <div className="flex items-center mb-5">
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

                <div>
                  <img  />
                  <input
                    type="text"
                    placeholder="Search recipes or ingredients…"
                    className="px-6 py-3 bg-white w-full rounded-[20px] outline-[1.5px] shadow-[0_8px_4px_rgba(0,0,0,0.25)]"
                  />
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
