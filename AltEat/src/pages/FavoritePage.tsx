import Navbar from "../component/Navbar";
import RecipeCard from "../component/RecipeCard";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function FavoritePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation('favorite');
  // Auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Fetch favorite recipes
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      // Get favorite recipe IDs
      const { data: favoriteRecipes, error: favError } = await supabase
        .from("favorite")
        .select("recipe_id")
        .eq("user_id", user.id);

      if (favError || !favoriteRecipes || favoriteRecipes.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const recipeIds = favoriteRecipes.map((row) => row.recipe_id);

      // Fetch recipes
      const { data: recipes, error: recipeError } = await supabase
        .from("recipe_staging")
        .select("*")
        .in("id", recipeIds);

      if (recipeError || !recipes) {
        console.error(recipeError);
        setFavorites([]);
        setLoading(false);
        return;
      }

      const normalizedRecipes = recipes.map((r) => ({
        id: r.id,
        title: r.recipe_name,
        image: r.img_src, 
        tags: r.cuisine_path ? r.cuisine_path.split("/").filter(Boolean) : [],
      }));

      setFavorites(normalizedRecipes);
      console.log("Favorite Reecipe: ", normalizedRecipes)
      setLoading(false);
    };

    if (isLoggedIn) {
      fetchFavorites();
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-[#FFEDDD]">
      <Navbar />

      <div className="mt-2 flex flex-col max-w-7xl m-auto w-[60%]">
        <h1 className="p-8 text-5xl">{t('title')}</h1>

        <div className="mt-3 mb-20">
          {!isLoggedIn ? (
            <p className="mt-5 text-center text-2xl">
              {t('loginRequired')}{" "}
              <Link to="/login" className="text-[#ce441a] font-medium">
                {t('login')}
              </Link>{" "}
              {t('or')}{" "}
              <Link to="/signup" className="text-[#ce441a] font-medium">
                {t('signup')}
              </Link>{" "}
              {t('first')}
            </p>
          ) : loading ? (
            <p className="mt-5 text-center text-2xl">{t('loadingFavorites')}</p>
          ) : favorites.length > 0 ? (
            <RecipeCard recipes={favorites} />
          ) : (
            <p className="mt-5 text-center text-2xl">
              {t('noFavorites')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FavoritePage;
