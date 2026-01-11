import Navbar from "../component/Navbar.tsx";
import send from "../assets/send.png";
import circle from "../assets/circle.png";
import recipe from "../assets/recipe.png";
import context from "../assets/context.png";
import subs from "../assets/subs.png";
import RecipeCard from "../component/RecipeCard.tsx";
import { recommendedRecipes } from "../data/recipe.tsx";

function HomePage() {
  const options = [
    {
      tool: "Recipe Suggestion & Lookup",
      img: recipe,
    },
    {
      tool: "Ingredient with Context",
      img: context,
    },
    {
      tool: "Ingredient Substitution",
      img: subs,
    },
  ];

  return (
    <>
      {/* Background */}
      <div className="-z-10">
        <img
          src={circle}
          className="w-[750px] h-[750px] absolute -left-70 top-18"
        />
        <img
          src={circle}
          className="w-[350px] h-[350px] absolute -right-30 top-135"
        />
      </div>

      <div className="min-h-screen z-10 bg-linear-to-b from-[#FACE9B] via-[#FFBD9E] via-60% to-[#E6896D]">
        <div className="relative">
          {/* Navbar */}
          <Navbar />

          <div className=" w-[60%] flex flex-col m-auto max-w-7xl">
            <div className="flex flex-col items-center my-18 gap-8">
              {/* Home Title */}
              <h1 className="text-[64px]">Welcome to AltEat</h1>
              <p className="text-[20px]">
                Get started by choosing what you’d like to do today.
              </p>
              {/* Text Input */}
              <form className="flex flex-col items-center gap-1">
                <input
                  type="text"
                  name="query"
                  placeholder="How can I help you?"
                  className="px-8 py-5 h-[50px] w-[820px] bg-white rounded-[20px] text-[16px] outline-[1.5px] shadow-[0_8px_4px_rgba(0,0,0,0.25)]"
                />{" "}
                <br />
                <button type="submit" className="cursor-pointer">
                  <div className="flex justify-center items-center h-[50px] w-[130px] gap-3 bg-[#FFE6DD] rounded-[30px] outline-[1.5px]">
                    <p className="text-[20px]">Send</p>
                    <img src={send} className="w-[26px]" />
                  </div>
                </button>
              </form>
            </div>

            {/* Other Tools */}
            <div className="flex flex-col items-center ">
              {/* Tools Title */}
              <h2 className="text-[32px] mb-14">Need something else?</h2>
              <div className="w-full flex flex-col">
                {/* Options */}
                <div className="grid grid-cols-3 gap-8">
                  {options.map((option) => (
                    // Option Card
                    <div
                      key={option.tool}
                      className="bg-[#FFE6DD] rounded-2xl cursor-pointer flex flex-col"
                    >
                      {/* Options Header */}
                      <div className="mx-3.75 mt-3.75 text-center bg-white h-20 text-[20px] outline-[1.5px] outline-[#AA8484] rounded-[15px] flex justify-center items-center ">
                        <p >{option.tool}</p>
                      </div>
                      {/* Options Image */}
                      <div className="flex items-center justify-center">
                        <img
                          src={option.img}
                          alt={option.tool}
                          className="max-h-full max-w-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-[#EDAE9B] border-t-4 mt-20 mb-16" />

            {/* Recipe */}
            <div className="flex flex-col items-start">
              <h2 className="text-3xl mb-12">Recommend Recipes</h2>
              <RecipeCard recipes={recommendedRecipes} />
            </div>
            {/* Divider */}
            <hr className="border-[#EDAE9B] border-t-4 mt-20 mb-20" />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
