import Navbar from "../component/Navbar.tsx";
import send from "../assets/send.png";
import circle from "../assets/circle.png";
import recipe from "../assets/recipe.png";
import context from "../assets/context.png";
import subs from "../assets/subs.png";
import RecipeCard from "../component/RecipeCard.tsx";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.tsx";
import { useState, useEffect } from "react";

function HomePage() {
  const navigate = useNavigate();
  const options = [
    {
      tool: "Recipe Suggestion & Lookup",
      img: recipe,
      url: "/recipesearch",
    },
    {
      tool: "Ingredient with Context",
      img: context,
      url: "/ingredientsearch",
    },
    {
      tool: "Ingredient Substitution",
      img: subs,
      url: "/chatbot",
    },
  ];

  const [recommendedRecipes, setRecommendedRecipes] = useState<any[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchRandomRecipes = async () => {
      setLoadingRecipes(true);

      const { data, error } = await supabase
        .from("recipe_staging")
        .select("*")
        .limit(30);

      if (error || !data) {
        console.error("Failed to fetch recipes:", error);
        setLoadingRecipes(false);
        return;
      }

      const shuffled = [...data].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 6);

      const normalized = selected.map((r) => ({
        id: r.id,
        title: r.recipe_name,
        image: r.img_src || "/placeholder.svg",
        tags: r.cuisine_path
          ? r.cuisine_path.split("/").filter(Boolean).slice(0, 3)
          : [],
      }));

      setRecommendedRecipes(normalized);
      setLoadingRecipes(false);
    };

    fetchRandomRecipes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // User is logged in, redirect to chatbot with message
      navigate(`/chatbot?message=${encodeURIComponent(query.trim())}`);
    } else {
      // User is not logged in, redirect to login with return URL and message
      navigate(`/login?redirect=/chatbot&message=${encodeURIComponent(query.trim())}`);
    }
  };

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
              <form onSubmit={handleSubmit} className="flex flex-col items-center gap-1">
                <input
                  type="text"
                  name="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
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
                    <Link to={option.url}>
                      <div
                        key={option.tool}
                        className="bg-[#FFE6DD] rounded-2xl cursor-pointer flex flex-col"
                      >
                        {/* Options Header */}
                        <div className="mx-3.75 mt-3.75 text-center bg-white h-20 text-[20px] outline-[1.5px] outline-[#AA8484] rounded-[15px] flex justify-center items-center ">
                          <p>{option.tool}</p>
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
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-[#EDAE9B] border-t-4 mt-20 mb-16" />

            {/* Recipe */}
            <div className="flex flex-col items-start">
              <h2 className="text-3xl mb-12">Recommend Recipes</h2>
              {loadingRecipes ? (
                <p className="text-center text-gray-600">Loading recipes...</p>
              ) : (
                <RecipeCard recipes={recommendedRecipes} />
              )}
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
