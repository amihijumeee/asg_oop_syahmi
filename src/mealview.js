//read
function savedMeals() {
    const savedMealsList = document.getElementById('saved-meals-list');
    savedMealsList.innerHTML = "";

    const savedMeals = JSON.parse(localStorage.getItem('recipes')) || [];

    savedMeals.forEach(meal => {

        const mealItem = document.createElement('li');
        mealItem.textContent = meal.strMeal;

        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () =>  {
            if (confirm(`Are you sure you want to delete "${meal.strMeal}"?`)) {
                deleteMeal(meal.idMeal);
            }
        }

        mealItem.appendChild(deleteBtn)
        savedMealsList.appendChild(mealItem);
    })
}

//delete
function deleteMeal(mealId) {
    let meals = JSON.parse(localStorage.getItem('recipes')) || [];
    meals = meals.filter(meal => meal.idMeal !== mealId);
    localStorage.setItem('recipes', JSON.stringify(meals)); 
    savedMeals(); 
}


document.addEventListener('DOMContentLoaded', function() {
    savedMeals(); 
});

//Create 
function saveRecipe(meal) {
    let savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];

    if (!savedRecipes.find(r => r.idMeal === meal.idMeal)) {
        savedRecipes.push(meal);
        localStorage.setItem('recipes', JSON.stringify(savedRecipes));
        alert('Recipe Saved!');
    } else {
        alert("Recipe is already saved.");
    }
}


let savedRecipes = [];
let editIndex = -1

// Create
document.addEventListener('DOMContentLoaded', function() {
    const mealSelection = document.getElementById('meal-selection');

    mealSelection.innerHTML = '<option value="" disabled selected>Select a meal</option>';

    savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];

    savedRecipes.forEach(meal => {
        const option = document.createElement('option');
        option.value = meal.idMeal;
        option.textContent = meal.strMeal;
        mealSelection.appendChild(option);
    });

    loadMealPlanner();
});


//  Retrieve meal from local storage / Read
function loadMealPlanner() {
    const mealPlannerResult = document.getElementById('meal-planner-table');
    mealPlannerResult.innerHTML = "";

    
    const mealPlanner = JSON.parse(localStorage.getItem('mealPlanner')) || [];
    
    mealPlanner.forEach((plan, index) => {
        const mealItem = document.createElement('tr');
        mealItem.innerHTML = `
            <td>${plan.day}</td>
            <td>${plan.mealTime}</td>
            <td>${plan.strMeal}</td>
            <td>
                <button id="edit" onclick="editMeal(${index})">Edit</button>
                <button id="delete" onclick="deleteMealPlanner(${index})">Delete</button>
            </td>
        `;
        mealPlannerResult.appendChild(mealItem);
    });
}

// Create
document.getElementById('meal-planner-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const day = document.getElementById('day').value;
    const mealTime = document.getElementById('meal-time').value;
    const selectedMealId = document.getElementById('meal-selection').value;

    const selectedMeal = savedRecipes.find(meal => meal.idMeal === selectedMealId);

    if (selectedMeal) {
        const mealPlanner = JSON.parse(localStorage.getItem('mealPlanner')) || [];
        
        if (editIndex === -1) {
            // Add new meal 
            mealPlanner.push({ day, mealTime, ...selectedMeal });
        } else {
            // Update existing meal 
            mealPlanner[editIndex] = { day, mealTime, ...selectedMeal};
            editIndex = -1; 
        }

        localStorage.setItem('mealPlanner', JSON.stringify(mealPlanner));
        loadMealPlanner();


        document.getElementById('meal-planner-form').reset();
        alert("Meal Planner Save")
    } else {
        alert("No meal found. Please select a valid meal.");
    }
});

// Update
function editMeal(index) {
    const mealPlanner = JSON.parse(localStorage.getItem('mealPlanner'));
    const meal = mealPlanner[index];

    document.getElementById('day').value = meal.day;
    document.getElementById('meal-time').value = meal.mealTime;
    document.getElementById('meal-selection').value = meal.idMeal;

    editIndex = index 
}

// Delete
function deleteMealPlanner(index) {
    const mealPlanner = JSON.parse(localStorage.getItem('mealPlanner'));
    mealPlanner.splice(index, 1);
    localStorage.setItem('mealPlanner', JSON.stringify(mealPlanner));
    (confirm(`Are you sure you want to delete this Meal Planner`))

    loadMealPlanner();
}

document.addEventListener('DOMContentLoaded', function() {
    savedMeals();
});