import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Navbar from "../component/Navbar";
import SearchSideBar from "../component/SearchSideBar";
import { recipeFilter } from "../data/recipeFilter";
import recipe_img from "../assets/recipe.png";
import search from "../assets/search.png";
import RecipeCard from "../component/RecipeCard";
import type { Recipe } from "../component/RecipeCard"
import { supabase } from "../lib/supabase"


interface Filters {
  ingredient: string[]
  method: string[]
  cuisine: string[]
}

function RecipeSearchPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<Filters>({
    ingredient: [],
    method: [],
    cuisine: [],
  })
  const [hasSearched, setHasSearched] = useState(false)

  const PAGE_SIZE = 20

  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  const normalizeRecipes = (data: any[]): Recipe[] => {
    console.log(data)
    return data.map((r) => ({
      id: r.id,
      title: r.recipe_name,
      image: r.img_src || ".",
      tags: [
        ...(r.cuisine_path ? r.cuisine_path.split("/").filter((tag: string) => tag.trim()).slice(1, 3) : []),
      ],
      isFavorite: false,
    }))
  }


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
  ]

  const hasActiveFilters = filters.ingredient.length > 0 || filters.method.length > 0 || filters.cuisine.length > 0

  const fetchRecipes = useCallback(async (pageNum: number) => {
    if (!hasActiveFilters && !searchQuery.trim()) {
      setRecipes([])
      setHasMore(false)
      setHasSearched(false)
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      let query = supabase
        .from("recipe_staging")
        .select("*", { count: "exact" })

      // Apply search query
      const allConditions: string[] = []

      // Apply search query
      if (searchQuery.trim()) {
        const searchTerm = searchQuery.trim()
        allConditions.push(
          `recipe_name.ilike.%${searchTerm}%`,
          `ingredients.ilike.%${searchTerm}%`,
          `cuisine_path.ilike.%${searchTerm}%`
        )
      }

      // Apply cuisine filter
      if (filters.cuisine.length > 0) {
        filters.cuisine.forEach(c => {
          allConditions.push(`cuisine_path.ilike.%${c}%`)
        })
      }

      // Apply ingredient filter
      if (filters.ingredient.length > 0) {
        filters.ingredient.forEach(i => {
          allConditions.push(`ingredients.ilike.%${i}%`)
        })
      }

      // Apply method filter
      if (filters.method.length > 0) {
        filters.method.forEach(m => {
          allConditions.push(`directions.ilike.%${m}%`)
          allConditions.push(`recipe_name.ilike.%${m}%`)
        })
      }

      // Apply all conditions as a single OR query
      if (allConditions.length > 0) {
        query = query.or(allConditions.join(","))
      }

      // Apply method filter
      if (filters.method.length > 0) {
        const methodConditions = filters.method
          .map((m) => `directions.ilike.%${m}%,recipe_name.ilike.%${m}%`)
          .join(",")
        query = query.or(methodConditions)
        console.log(methodConditions)
      }

      // Pagination
      const from = pageNum * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const { data, error, count } = await query.range(from, to)

      if (error) {
        console.error("Error fetching recipes:", error)
        setRecipes([])
        setHasMore(false)
        return
      }

      setRecipes(prev => pageNum === 0 ? (data || []) : [...prev, ...(data || [])])
      
      const totalFetched = (pageNum + 1) * PAGE_SIZE
      setHasMore(totalFetched < (count || 0))

    } catch (err) {
      console.error(err)
      setRecipes([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }

  }, [filters, hasActiveFilters, searchQuery])

  // Reset page when filters or search change
  useEffect(() => {
    setPage(0)
    setHasMore(false)
  }, [filters, searchQuery])

  // Fetch when page, filters, or search changes
  useEffect(() => {
    fetchRecipes(page)
  }, [page, fetchRecipes])

  // Handle filter changes from sidebar
  const handleFilterChange = (filterType: string, selectedItems: string[]) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: selectedItems,
    }))
  }

  // Handle search submission
  const handleSearch = () => {
    setPage(0)
    fetchRecipes(0)
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <>
      <div className="min-h-screen bg-[#FFEDDD]">
        <div className="relative">
          <Navbar />
          <div className="flex">
            {/* Side Bar */}
            <SearchSideBar filter={filterSection} onFilterChange={handleFilterChange} />

            <div className="flex-1 flex justify-center">
              {/* Main Content */}
              <div className="flex flex-col items-center mb-20 max-w-7xl w-[85%]">
                <div className="flex items-center mb-5">
                  {/* Title */}
                  <div>
                    <h1 className="text-5xl mb-4">Recipe Suggestion and Look Up</h1>
                    <p className="text-[16px]">
                      Not sure what to cook? Get recipe ideas based on the ingredients you have!
                    </p>
                  </div>
                  <img src={recipe_img} alt="Recipe" />
                </div>

                {/* Text Input */}
                <div className="w-full relative">
                  <img
                    src={search || "/placeholder.svg"}
                    className="absolute right-4 top-3 cursor-pointer"
                    onClick={handleSearch}
                    alt="Search"
                  />
                  <input
                    type="text"
                    placeholder="Search recipes or ingredients..."
                    className="px-6 py-3 bg-white w-full rounded-[20px] outline-[1.5px] shadow-[0_8px_4px_rgba(0,0,0,0.25)]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>

                {/* Card Item */}
                <div className="w-full">
                  <h3 className="my-7 text-2xl">
                    {hasSearched
                      ? `You can make ${recipes.length} recipe${recipes.length !== 1 ? 's' : ''}`
                      : ""}
                  </h3>
                  <div className="flex flex-col items-start">
                    {loading && page === 0 ? (
                      <div className="w-full flex justify-center py-12">
                        <div className="text-xl text-[#562C0C]">Loading recipes...</div>
                      </div>
                    ) : !hasSearched ? (
                      <div className="w-full flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-2xl text-[#562C0C] mb-2">Select filters or search to find recipes</div>
                        <p className="text-gray-500">Use the sidebar filters or search bar to discover recipes</p>
                      </div>
                    ) : recipes.length === 0 ? (
                      <div className="w-full flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-2xl text-[#562C0C] mb-2">No recipes found</div>
                        <p className="text-gray-500">Try adjusting your filters or search terms</p>
                      </div>
                    ) : (
                      <RecipeCard recipes={normalizeRecipes(recipes)} />
                    )}
                  </div>
                </div>

                {/* View More */}
                {hasMore && !loading && recipes.length > 0 && (
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="mt-4 px-6 py-2 bg-[#562C0C] text-white rounded-full hover:bg-[#6d3810] transition-colors"
                  >
                    View More
                  </button>
                )}

                {/* Loading more indicator */}
                {loading && page > 0 && (
                  <div className="mt-4 text-[#562C0C]">Loading more...</div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecipeSearchPage;