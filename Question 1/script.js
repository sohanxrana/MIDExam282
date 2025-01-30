// DOM Elements
const cocktailContainer = document.getElementById("cocktail-container");
const searchBar = document.getElementById("search-bar");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const modalImage = document.getElementById("modal-image");
const modalInstructions = document.getElementById("modal-instructions");
const modalIngredients = document.getElementById("modal-ingredients");

// Fetch cocktails from API
async function fetchCocktails(searchTerm = "") {
  const url = searchTerm
    ? `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`
    : "https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail"; // Default to fetching cocktails

  console.log("Fetching data from:", url); // Debugging: Log the URL

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("API Response:", data); // Debugging: Log the API response
    return data.drinks || [];
  } catch (error) {
    console.error("Error fetching data:", error); // Debugging: Log any errors
    return [];
  }
}

// Display cocktails on the homepage
async function displayCocktails(searchTerm = "") {
  const cocktails = await fetchCocktails(searchTerm);
  console.log("Fetched Cocktails:", cocktails); // Debugging: Log fetched cocktails

  cocktailContainer.innerHTML = ""; // Clear previous results

  if (cocktails.length === 0) {
    cocktailContainer.innerHTML =
      "<p>No cocktails found. Try a different search term.</p>";
    return;
  }

  cocktails.slice(0, 12).forEach((cocktail) => {
    const card = document.createElement("div");
    card.classList.add("cocktail-card");
    card.innerHTML = `
      <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
      <h3>${cocktail.strDrink}</h3>
    `;
    card.addEventListener("click", () => openModal(cocktail));
    cocktailContainer.appendChild(card);
  });
}

// Open modal with detailed information
async function openModal(cocktail) {
  // Fetch detailed information using the cocktail ID
  const detailedResponse = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktail.idDrink}`
  );
  const detailedData = await detailedResponse.json();
  const detailedCocktail = detailedData.drinks[0];

  console.log("Detailed Cocktail Data:", detailedCocktail); // Debugging: Log detailed data

  // Populate modal with detailed information
  modalTitle.textContent = detailedCocktail.strDrink;
  modalImage.src = detailedCocktail.strDrinkThumb;
  modalInstructions.textContent = detailedCocktail.strInstructions;

  // Display ingredients
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = detailedCocktail[`strIngredient${i}`];
    if (ingredient) {
      ingredients.push(ingredient);
    }
  }
  modalIngredients.textContent = `Ingredients: ${ingredients.join(", ")}`;

  modal.style.display = "flex";
}

// Close modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Search functionality
searchBar.addEventListener("input", (e) => {
  console.log("Search Term:", e.target.value); // Debugging: Log the search term
  displayCocktails(e.target.value);
});

// Initial load
displayCocktails();
