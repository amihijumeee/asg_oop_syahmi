const categorySelection = document.getElementById('category-selection');
const mealSelection = document.getElementById('meal-selection');
const addgrocery = document.getElementById('add-grocery');
const groceryList = document.getElementById('grocery-list');

// Fetch categories from TheMealDB API
fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    .then(response => response.json())
    .then(data => {
        data.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.strCategory;
            option.textContent = category.strCategory;
            categorySelection.appendChild(option);
        });
    });

// Fetch meals based on the selected category
categorySelection.addEventListener('change', function() {
    const selectedCategory = categorySelection.value;
    mealSelection.innerHTML = '<option value="">Select a meal</option>'; 
    mealSelection.disabled = true; 

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`)
        .then(response => response.json())
        .then(data => {
            data.meals.forEach(meal => {
                const option = document.createElement('option');
                option.value = meal.idMeal;
                option.textContent = meal.strMeal;
                mealSelection.appendChild(option);
            });
            mealSelection.disabled = false; 
        });
});

// Add ingredients to grocery list
addgrocery.addEventListener('click', function() {
    const selectedMealId = mealSelection.value;
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${selectedMealId}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            const ingredients = getIngredients(meal);
            addToGroceryList(ingredients);
        });
});

// Enable the add button when a meal is selected
mealSelection.addEventListener('change', function() {
    addgrocery.disabled = mealSelection.value === '';
});

// Get ingredients from the meal object
function getIngredients(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
            ingredients.push({ name: ingredient, measure: measure });
        }
    }
    return ingredients;
}

// Add / Display ingredients to grocery list
function addToGroceryList(ingredients) {
    ingredients.forEach(ingredient => {
        // Check if the ingredient already exists in the list
        const existingRow = [...groceryList.children].find(row => 
            row.cells[0].textContent.startsWith(ingredient.name));

        if (existingRow) {
            // Update the quantity 
            const existingQuantity = parseInt(existingRow.dataset.quantity);
            const newQuantity = existingQuantity + 1; // Increment quantity
            existingRow.dataset.quantity = newQuantity;
            existingRow.cells[2].textContent = newQuantity;
        } else {
            // Add new ingredient

            //Create new row
            const row = document.createElement('tr');
            row.dataset.quantity = 1; 
 
            //Push Ingredients Name
            const ingredientCell = document.createElement('td');
            ingredientCell.textContent = ingredient.name;
            row.appendChild(ingredientCell);

            //Push Measures
            const measureCell = document.createElement('td');
            measureCell.textContent = ingredient.measure;
            row.appendChild(measureCell);

            //Push Ingredients Quantity
            const quantityCell = document.createElement('td');
            quantityCell.textContent = 1; 
            row.appendChild(quantityCell);

            //Add Update / Delete Button
            const actionCell = document.createElement('td');

            // Delete
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-button')
            deleteBtn.onclick = () => {
                if (confirm("Do you want to delete the ingredient?")) {
                    groceryList.removeChild(row);
                    saveGroceryList(); 
                }
            };

            //Append update/delete btn
            actionCell.appendChild(deleteBtn);
            row.appendChild(actionCell);

            groceryList.appendChild(row);
        }
    });
    saveGroceryList();
}

//Save groceries to local storage
function saveGroceryList() {
    const groceriesItems = [];
    [...groceryList.children].forEach(row => {
        const text = row.cells[0].textContent; // Ingredient name 
        const quantity = row.dataset.quantity;
        groceriesItems.push({ name: text, quantity: quantity });
    });
    localStorage.setItem('groceryList', JSON.stringify(groceriesItems));
}

//Read
function loadGroceryList() {
    const listItems = JSON.parse(localStorage.getItem('groceryList')) || [];
    listItems.forEach(item => {

        //Create new row
        const row = document.createElement('tr');
        row.dataset.quantity = item.quantity;

        //Push Ingredients Name
        const ingredientCell = document.createElement('td');
        ingredientCell.textContent = item.name;
        row.appendChild(ingredientCell);

        //Push Measures
        const measureCell = document.createElement('td');
        measureCell.textContent = "";
        row.appendChild(measureCell);

        //Push Ingredients Quantity
        const quantityCell = document.createElement('td');
        quantityCell.textContent = item.quantity;
        row.appendChild(quantityCell);

        //Add Update / Delete Button
        const actionCell = document.createElement('td');

        //Delete
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-button')
        deleteBtn.onclick = () => {
            if (confirm("Do you want to delete the ingredient?")){
            groceryList.removeChild(row);
            saveGroceryList();
            } 
        };

        

        //Append update/delete btn
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);

        groceryList.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadGroceryList();
});
