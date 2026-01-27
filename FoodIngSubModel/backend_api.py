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

@app.post("/substitute")
def substitute(req: SubstitutionRequest):
    result = ingredient_service.get_substitutes(req.ingredient, req.recipe)
    return {"substitutes": result.items, "source": result.source}

@app.post("/suggest")
def suggest(req: SuggestionRequest):
    recipes = recipe_service.get_suggestions(req.ingredients)
    return {"recipes": [{"name": r.name, "ingredients": r.ingredients} for r in recipes]}

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

    return {"ingredient": result.items}