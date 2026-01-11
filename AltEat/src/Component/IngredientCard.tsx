interface Ingredient {
  id: number;
  title: string;
  image: string;
  tags: string[];
}

interface IngredientCardProps {
  ingredients: Ingredient[];
}

function IngredientCard({ ingredients }: IngredientCardProps) {
  return (
    <>
      <div className="grid grid-cols-3 gap-12 w-full items-start">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="bg-white rounded-2xl overflow-hidden shadow-[0_3px_2px_rgba(0,0,0,0.25)]"
          >
            {/* Ingredient Image */}
            <div className="relative">
              <img
                src={ingredient.image}
                alt={ingredient.title}
                className="w-full h-45"
              />
            </div>

            <div className="flex flex-col items-center mt-4">
              {/* Ingredient Name */}
              <h3 className="text-[#562C0C] font-medium text-2xl">
                {ingredient.title}
              </h3>
              {/* Tags */}
              <div className="flex flex-wrap mt-3 gap-2 mb-4 justify-center">
                {ingredient.tags.map((tag) => (
                  <p
                    key={tag}
                    className="px-5 py-2 bg-[#FFCB69] rounded-[20px] text-[#694900] text-[14px]"
                  >
                    {tag}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default IngredientCard;
