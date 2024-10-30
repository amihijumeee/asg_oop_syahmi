const mealList = document.getElementById('meal');
const mealrandom = document.getElementById('random-meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const categoryselect = document.getElementById('category-btn')


// Event listener
mealList.addEventListener('click', getMealRecipe);
mealrandom.addEventListener('click', getMealRecipe);
categoryselect.addEventListener('click',getCategoryList);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Category dropdown
async function loadCategory(){
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/categories.php?c=`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    const select = document.getElementById('category-input');

        if(data.categories) {
            data.categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.strCategory.toLowerCase();
                option.textContent = category.strCategory;
                select.appendChild(option);
            });
        } else {
            console.log("No Categories  found.");   
        }
}

//Meals Display Function
function getCategoryList() {
    let categoryinput = document.getElementById('category-input').value.trim();

    mealrandom.style.display = 'none';

    if (categoryinput === "all") {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`) 
            .then(response => response.json())
            .then(data => {
                let html = "";
                if (data.meals) {
                    data.meals.forEach(meal => {
                        // display all
                        html += `
                            <div class="meal-item" data-id="${meal.idMeal}">
                                <div class="meal-img">
                                    <img src="${meal.strMealThumb}" alt="food">
                                </div>
                                <div class="meal-name">
                                    <h3>${meal.strMeal}</h3>
                                    <a href="#" class="recipe-btn">Get Recipe</a>
                                </div>
                            </div>
                        `;
                    });
                    mealList.classList.remove('notFound');
                } else {
                    html = "Sorry, we didn't find any meal!";
                    mealList.classList.add('notFound');
                }
                mealList.innerHTML = html;
            });
    } else {
        // Display category Search
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryinput}`)
            .then(response => response.json())
            .then(data => {
                let html = "";
                if (data.meals) {
                    data.meals.forEach(meal => {
                        html += `
                            <div class="meal-item" data-id="${meal.idMeal}">
                                <div class="meal-img">
                                    <img src="${meal.strMealThumb}" alt="food">
                                </div>
                                <div class="meal-name">
                                    <h3>${meal.strMeal}</h3>
                                    <a href="#" class="recipe-btn">Get Recipe</a>
                                </div>
                            </div>
                        `;
                    });
                    mealList.classList.remove('notFound');
                } else {
                    html = "Sorry, we didn't find any meal!";
                    mealList.classList.add('notFound');
                }
                mealList.innerHTML = html;
            });
    }
}

//Random Meal
function getRandomMeal() {
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(response => response.json())
        .then(data => {
            let meal = data.meals[0];
            displayRandomMeal(meal);
        })
}

//Display Random Meal
function displayRandomMeal(meal) {
    let html = `
        <div class="meal-randomitem" data-id="${meal.idMeal}">
            <div class="meal-randomimg">
                <img src="${meal.strMealThumb}" alt="food">
            </div>
            <div class="meal-randomname">
                <h3>${meal.strMeal}</h3>
                <a href="#" class="recipe-btn" data-id="${meal.idMeal}">Get Recipe</a>
            </div>
        </div>
    `;

    mealrandom.innerHTML = html;
}

//Recipe display
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals));
    }
}

//Measures meal
function getMealMeasures(meal) {
    let measures = '';
    for (let i = 1; i <= 20; i++) {
        if (meal[`strMeasure${i}`] && meal[`strIngredient${i}`]) {
            measures += `<li>${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
        }
    }
    return measures;
}

//Ingredients meal
function getMealIngredients(meal) {
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== '') {
            ingredients += `<li>${meal[`strIngredient${i}`]}</li>`;
        }
    }
    return ingredients;
}

//Recipe Display
function mealRecipeModal(meal) {
    meal = meal[0]; 
    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">Category: ${meal.strCategory}</p><br><br>
        <p class="recipe-category">Area: ${meal.strArea}</p>
        <div class="recipe-instruct">
            <h3>Ingredients:</h3>
            <p>${getMealIngredients(meal)}</p>
        </div>
        <div class="recipe-instruct">
            <h3>Measure:</h3>
            <p>${getMealMeasures(meal)}</p>
        </div>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
        <button id="saveRecipeBtn" class="save-button">Save Recipe</button>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');

    const saveButton = document.getElementById("saveRecipeBtn");
    saveButton.addEventListener('click', function() {
        saveRecipe(meal);
    })

}

// Fetch and display a random meal when the page loads
document.addEventListener('DOMContentLoaded', () => {
    getRandomMeal();
    loadCategory();
});

// Save recipe
function saveRecipe(meal) {
    let savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];

    if (!savedRecipes.find(r => r.idMeal === meal.idMeal )) {
        savedRecipes.push(meal);
        localStorage.setItem('recipes',JSON.stringify(savedRecipes));
        alert('Recipe Saved!');
    } else {
        alert("Recipe is already saved.")
    }
}


