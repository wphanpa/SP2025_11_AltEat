import Navbar from "../component/Navbar";
import SearchSideBar from "../component/SearchSideBar";
import { ingredientFilter } from "../data/ingredientFilter";

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

        <div>
          <SearchSideBar filter={filterSection} />
        </div>
      </div>
    </>
  );
}

export default IngredientSearchpage;
