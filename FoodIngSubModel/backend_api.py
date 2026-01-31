# backend_api.py
from fastapi import FastAPI
from pydantic import BaseModel
from config import Config
from services.ingredient_service import IngredientService
from services.recipe_service import RecipeService
from services.openai_service import OpenAIService

app = FastAPI(title="Recipe Chatbot API")

config = Config()
ingredient_service = IngredientService(config)
recipe_service = RecipeService(config)
openai_service = OpenAIService(config)

class SubstitutionRequest(BaseModel):
    ingredient: str
    recipe: str

class SuggestionRequest(BaseModel):
    ingredients: list[str]

class LookupRequest(BaseModel):
    recipe: str

class ContextRequest(BaseModel):
    taste: str
    texture: str
    color: str
    cooking_method: str

class SimilarRequest(BaseModel):
    recipe: str

class SpecificSuggestionRequest(BaseModel):
    required_ingredients: list[str]
    context: str = ""

class RecipeWithSubsRequest(BaseModel):
    recipe: str
    substitutes: list[str]

class RewriteRequest(BaseModel):
    recipe: str
    original_ingredients: str = ""
    old_ingredient: str
    new_ingredient: str

class NaturalContextRequest(BaseModel):
    description: str

@app.post("/substitute")
def substitute(req: SubstitutionRequest):
    result = ingredient_service.get_substitutes(req.ingredient, req.recipe)
    return {"substitutes": result.items, "source": result.source}

@app.post("/suggest")
def suggest(req: SuggestionRequest):
    recipes = recipe_service.get_suggestions(req.ingredients)
    return {"recipes": [{"name": r.name, "ingredients": r.ingredients, "id": r.id, "image": r.image} for r in recipes]}

@app.post("/lookup")
def lookup(req: LookupRequest):
    result = openai_service.get_recipe_details(req.recipe)
    return {"ingredient": result["ingredients"], "cooking_method": result["cooking_method"],}

@app.post("/context")
def context(req: ContextRequest):
    result = ingredient_service.get_context_suggestions(
        taste= req.taste,
        texture= req.texture,
        color= req.color,
        cooking_method= req.cooking_method,
    )

    return {"ingredient": result.items, "source": result.source}

@app.post("/context_natural")
def context_natural(req: NaturalContextRequest):
    result = ingredient_service.get_context_suggestions(natural_description=req.description)
    return {"ingredient": result.items, "source": result.source}

@app.post("/similar")
def similar(req: SimilarRequest):
    recipes = recipe_service.get_similar_recipes(req.recipe)
    return {"recipes": [{"name": r.name, "ingredients": r.ingredients} for r in recipes]}

@app.post("/suggest_specific")
def suggest_specific(req: SpecificSuggestionRequest):
    recipes = recipe_service.get_recipes_with_specific_ingredients(req.required_ingredients, req.context)
    return {"recipes": [{"name": r.name, "ingredients": r.ingredients} for r in recipes]}

@app.post("/recipe_custom")
def recipe_custom(req: RecipeWithSubsRequest):
    result = recipe_service.get_recipe_with_ingredients(req.recipe, req.substitutes)
    if not result:
        return {"error": "Could not generate recipe"}
    return {"name": result.name, "ingredients": result.ingredients}

@app.post("/rewrite")
def rewrite(req: RewriteRequest):
    # 1. Fetch the original ingredients internally
    recipe_details = openai_service.get_recipe_details(req.recipe)
    
    # Check if lookup failed
    if not recipe_details or "ingredients" not in recipe_details:
        return {"error": f"Could not find ingredients for {req.recipe}"}

    # Convert list to string if your service expects a string
    original_ingredients_str = ", ".join(recipe_details["ingredients"])

    # 2. Call the substitution service using the fetched ingredients
    result = openai_service.get_updated_recipe_with_substitution(
        req.recipe, 
        original_ingredients_str, 
        req.old_ingredient, 
        req.new_ingredient
    )
    
    if not result:
        return {"error": "Could not rewrite recipe"}
    return result