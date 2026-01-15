import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

export interface Recipe {
  id: number;
  title: string;
  image: string;
  tags: string[];
  isFavorite: boolean;
}

interface RecipeCardProps {
  recipes: Recipe[];
}

function RecipeCard({ recipes }: RecipeCardProps) {
  const navigate = useNavigate();
  return (
    <>
      <div className="grid grid-cols-3 gap-12 w-full items-st">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-2xl shadow-[0_3px_2px_rgba(0,0,0,0.25)]"
          >
            {/* Recipe Image */}
            <div className="relative">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full rounded-tl-2xl rounded-tr-2xl"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
              />
              {/* Favorite Button */}
              <button className="absolute top-2 right-2">
                <Heart
                  className={`w-8 h-8 ${
                    recipe.isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400 fill-white"
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-col items-center mt-4">
              {/* Recipe Name */}
              <h3 className="text-[#562C0C] text-center font-medium text-2xl">
                {recipe.title}
              </h3>
              {/* Tags */}
              <div className="flex flex-wrap mt-3 gap-2 justify-center">
                {recipe.tags.map((tag) => (
                  <p
                    key={tag}
                    className="px-5 py-2 bg-[#FFCB69] rounded-[20px] text-[#694900] text-[14px]"
                  >
                    {tag}
                  </p>
                ))}
              </div>
              {/* More Button */}
              <button
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                className="my-4 px-6 py-2 bg-[#562C0C] text-white rounded-full text-sm hover:bg-[#3d1f08] transition-colors cursor-pointer"
              >
                More
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default RecipeCard;