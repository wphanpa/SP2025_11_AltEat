import Navbar from "../component/Navbar";
import SearchSideBar from "../component/SearchSideBar";
import { ingredientFilter } from "../data/ingredientFilter";
import IngredientCard from "../component/IngredientCard";
import { ingredient } from "../data/ingredient";
import search from "../assets/search.png";
import context from "../assets/context.png";

function IngredientSearchpage() {
  const filterSection = [
    {
      title: "Taste",
      items: ingredientFilter[0].taste,
    },
    {
      title: "Texture",
      items: ingredientFilter[0].texture,
    },
    {
      title: "Color",
      items: ingredientFilter[0].color,
    },
  ];
  return (
    <>
      <div className="min-h-screen bg-[#FFEDDD]">
        <div>
          <Navbar />
        </div>

        <div className="flex">
          <SearchSideBar filter={filterSection} />
          <div className="flex-1 flex justify-center">
            {/* Main Content */}
            <div className="flex flex-col items-center mb-20 max-w-7xl w-[85%]">
              <div className="flex items-center mb-5">
                {/* Title */}
                <div>
                  <h1 className="text-5xl mb-4">Ingredient with Context</h1>
                  <p className="text-[16px]">
                    Discover ingredient combinations that make every meal
                    delicious.
                  </p>
                </div>
                <img src={context} />
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
                <div className="flex flex-col items-start mt-14">
                  <IngredientCard ingredients={ingredient} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default IngredientSearchpage;
