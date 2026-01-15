// Capitalize first letter
const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

// Sort array
const formatAndSort = (arr: string[]) =>
  [...arr] // avoid mutating original
    .map(capitalize)
    .sort((a, b) => a.localeCompare(b));

export const recipeFilter = [
  {
    ingredient: formatAndSort([
      "shrimp",
      "chicken",
      "crab",
      "pork",
      "almond",
      "cabbage",
    ]),
    method: formatAndSort([
      "boil",
      "oven",
      "fry",
      "grill",
      "steam",
      "bake",
      "roast",
    ]),
    cuisine: formatAndSort([
      "thai",
      "japanese",
      "korean",
      "american",
      "french",
      "italian",
    ]),
    // menu: formatAndSort([]),
  },
];
