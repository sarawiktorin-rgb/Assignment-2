// Hämta data från theamealdb. Måltider på bokstaven "b"
const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=b");

// Kovertera resultatet till javascript object från json format
const result = await response.json()

// Hämta ut "meals" från resultatet
const meals = result.meals;

// Sortera "meals" i alfabetisk ordning baserat på "strMeal"
const sorted = meals.sort((a,b) => a.strMeal.localeCompare(b.strMeal))

// Definiera variable med första fem resultaten i listan
const firstFive = sorted.slice(0,5)

// Konsollogga texten: "The first 5 meals"
console.log("The first 5 meals:");

// Konsollogga alla måltider ("strMeal")
firstFive.forEach(meal => console.log(meal.strMeal))

// Filtrera på kategori, byt ut "dessert" till ex. "beef" för att få ut alla meals inom kategorin "beef"
let filterCategory = "dessert";

// Filtrera ut alla melas inom den valda kategorin
const filteredMeals = meals.filter(meal =>
  meal.strCategory.toLowerCase() === filterCategory.toLowerCase()
);

/*
Konsollogga resultatet (meal + category)
Om det inte finns några meals inom den valda kategorin - skriv "No meals were found in this category"
 */
console.log(`\nMeals in category "${filterCategory}":`);
if (filteredMeals.length > 0) {
  filteredMeals.forEach(meal =>
    console.log(`Meal: ${meal.strMeal} | Category: ${meal.strCategory}`)
  );
} else {
  console.log("No meals were found in this category.");
}

// Använd reduce för att räkna hur många gånger varje kategori förekommer
const categoryCount = meals.reduce((acc, meal) => {

  // Kolla om kategorin redan finns i acc (accumulatorn)
  if (acc[meal.strCategory]) {

    // Om den finns – öka värdet med 1
    acc[meal.strCategory]++;
  } else {
    // Om den inte finns – skapa den och sätt värdet till 1
    acc[meal.strCategory] = 1;
  }

  // Returnera uppdaterade acc-objektet varje gång
  return acc;
}, {});

// Konsollogga resultatet
console.log("\nNumber of meals per category:");

for (const category in categoryCount) {
  console.log(`${category}: ${categoryCount[category]}`);
}

// Funktion som grupperar måltider efter en viss nyckel (t.ex. strCategory eller strArea)
function groupBy(items, key) {
  const result = {}; // skapar ett tomt objekt för grupperna

  // Gå igenom alla måltider (items)
  for (const item of items) {
    const groupValue = item[key]; // hämtar värdet för den valda nyckeln

    // Om gruppen inte finns ännu, skapa en ny lista
    if (!result[groupValue]) {
      result[groupValue] = [];
    }

    // Lägg till måltiden i rätt grupp
    result[groupValue].push(item);
  }

  // Returnera det färdiga objektet
  return result;
}

// Använd funktionen för att gruppera måltider efter kategori
const groupedByCategory = groupBy(meals, "strCategory");

// Skriv ut resultatet snyggt i konsolen
console.log("\nMeals grouped by category:");
for (const category in groupedByCategory) {
  const names = groupedByCategory[category]
    .map(meal => meal.strMeal) // plockar ut bara måltidsnamnen
    .join(", "); // separerar dem med kommatecken
  console.log(`${category}: ${names}`);
}

// Skapa en ny lista med korta sammanfattningar
const mealSummaries = meals.map(meal => {
  // Samla alla ingredienser i en lista
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      ingredients.push(ingredient);
    }
  }

  // Returnera ett nytt objekt med bara det vi vill ha
  return {
    name: meal.strMeal,
    category: meal.strCategory,
    ingredients: ingredients
  };
});

// Snygg utskrift i konsollen
console.log("\nMeal summaries:");
mealSummaries.forEach(meal => {
  console.log(`Meal: ${meal.name}`);
  console.log(`Category: ${meal.category}`);
  console.log(`Ingredients: ${meal.ingredients.join(", ")}`);
  console.log("--------------------------------------------");
});

// Bygg en lista med alla ingredienser från alla måltider
const allIngredients = meals.flatMap(meal => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      ingredients.push(ingredient.trim());
    }
  }
  return ingredients;
});

// Skapa en "frequency map" som räknar hur många gånger varje ingrediens förekommer
const ingredientCount = allIngredients.reduce((acc, ingredient) => {
  if (acc[ingredient]) {
    acc[ingredient]++
  } else {
    acc[ingredient] = 1
  }

  return acc;
}, {});

// Snygg utskrift i konsollen
console.log("\nIngredient frequency list:");
for (const [ingredient, count] of Object.entries(ingredientCount).sort(
  ([a], [b]) => a.localeCompare(b)
)) {
  console.log(`${ingredient}: ${count}`);
}
