import Navbar from "../Component/Navbar"
import { Heart } from "lucide-react"
import { recommendedRecipes } from "../data/recipe"

const recipeData = {
  title: "Creamy Garlic Shrimp Pasta",
  tags: ["shrimp", "mushroom", "boil"],
  image: "/creamy-garlic-shrimp-pasta-dish.jpg",
  ingredients: [
    "Shrimp",
    "Olive oil, butter, and garlic",
    "Pasta",
    "Cream",
    "Parmesan",
    "Optional seasoning",
    "Salt, pepper, and parsley",
  ],
  steps: [
    "In a medium-sized saucepan, boil water and salt it. Add your pasta, and cook according to the package instructions until al dente. When the pasta is cooked, reserve 1 cup of the pasta water and drain the pasta.",
    "In a skillet over medium heat, melt the butter, and add olive oil. Cook the shrimp for a minute, then season with salt, pepper, and Old Bay Seasoning or paprika if using.",
    "Continue to cook the shrimp until it's pink. Do this in batches if you're worried that you may overcook the shrimp. Remove the shrimp onto a plate and set aside.",
    "In the same pan, melt butter and add garlic, cook for 30 seconds or until it's fragrant. Add the heavy cream, and with the spatula deglaze the pan.",
    "Add parmesan, let it melt then loosen the sauce with reserved pasta water and allow to simmer for a minute. Taste the sauce and see if more salt and pepper is needed.",
    "Toss the pasta with the sauce until it's well coated. Add the shrimp back in to reheat it gently, garnish with freshly chopped parsley and serve.",
  ],
  nutrition: {
    calories: "334kcal",
    carbohydrates: "4g",
    protein: "29g",
    fat: "22g",
    saturatedFat: "11g",
    cholesterol: "343mg",
    sodium: "1411mg",
    potassium: "145mg",
    fiber: "1g",
    sugar: "1g",
    vitaminA: "965IU",
    vitaminC: "10mg",
    calcium: "347mg",
    iron: "3mg",
  },
}

export default function RecipeDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex relative">
        <main className="flex-1 p-8 max-w-3xl mx-auto overflow-y-auto">
          {/* Title */}
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">{recipeData.title}</h1>

          {/* Tags */}
          <div className="flex gap-3 mb-8 justify-center">
            {recipeData.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 bg-[#F5C55A] rounded-full text-sm text-gray-800 border border-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Image and Ingredients */}
          <div className="flex gap-6 mb-10">
            <div className="w-72 h-64 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={recipeData.image || "/placeholder.svg"}
                alt={recipeData.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 border-2 border-gray-400 rounded-lg p-6 bg-[#FFE8B1]">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Ingredients</h2>
              <ul className="text-center space-y-1">
                {recipeData.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700 text-sm">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">How to Make Creamy Shrimp Pasta</h2>
            <ol className="space-y-4">
              {recipeData.steps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#FBB496] flex items-center justify-center text-sm font-semibold text-gray-800">
                    {index + 1}.
                  </span>
                  <p className="text-gray-700 text-sm leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Nutrition Information */}
          <div className="bg-[#FFE6DD] border-2 border-gray-400 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Nutrition Information</h2>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                Calories: {recipeData.nutrition.calories}, Carbohydrates: {recipeData.nutrition.carbohydrates}, Protein:{" "}
                {recipeData.nutrition.protein}, Fat: {recipeData.nutrition.fat}, Saturated Fat:{" "}
                {recipeData.nutrition.saturatedFat}, Cholesterol: {recipeData.nutrition.cholesterol}, Sodium:{" "}
                {recipeData.nutrition.sodium}, Potassium: {recipeData.nutrition.potassium}, Fiber:{" "}
                {recipeData.nutrition.fiber}, Sugar: {recipeData.nutrition.sugar},
              </p>
              <p>
                Vitamin A: {recipeData.nutrition.vitaminA}, Vitamin C: {recipeData.nutrition.vitaminC}, Calcium:{" "}
                {recipeData.nutrition.calcium}, Iron: {recipeData.nutrition.iron}
              </p>
            </div>
          </div>
        </main>

        {/* Right Sidebar*/}
        <aside className="w-80 p-6 border-l border-gray-200 sticky top-0 h-screen overflow-y-auto flex-shrink-0 bg-[#F5F5F5]">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recommend recipes</h2>
          <div className="space-y-6">
            {recommendedRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={recipe.image || "/placeholder.svg"}
                    alt={recipe.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button className="absolute top-2 right-2">
                    <Heart className={`w-6 h-6 ${recipe.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 fill-white"}`} />
                  </button>
                </div>
                <div className="py-3">
                  <h3 className="font-semibold text-gray-800 text-center mb-2">{recipe.title}</h3>
                  <div className="flex justify-center gap-2">
                    {recipe.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-[#FFCB69] rounded-full text-xs text-gray-700 border border-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
