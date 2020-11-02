const mealsEl = document.getElementById('meals');
const favouriteContainer = document.getElementById('fav-meals');
const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');
const mealPopup = document.getElementById('popup-container');
const popupCloseBtn = document.getElementById('close-popup');
const mealInfoEl = document.getElementById('meal-info');

// Gets a Random Meal
getRandomMeal();
fetchFavMeals();

async function getRandomMeal(){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const respData = await resp.json();
    const randomMeal = respData.meals[0];
    addMeal(randomMeal, true);

}

// Gets meal by id
async function getMealsById(id){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);
    const respData = await resp.json();
    const meal = respData.meals[0];
    return meal;
}

// Gets Meal by Searching for it
async function getMealBySearch(term){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);
    const respData = await resp.json();
    const meals = respData.meals;

    return meals;
};


// Will add Meal
function addMeal(mealData, random = false){
    // console.log(mealData);
    const meal = document.createElement('div');
    meal.classList.add('meal');

    meal.innerHTML = `
        <div class="meal-header">
            ${random ? `
            <span class="random">
                We Suggest!
            </span>
            ` : ''}
            <img 
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}">
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
                <i class="fas fa-heart"></i>
            </button>
        </div>  
    `;
const btn = meal.querySelector('.meal-body .fav-btn');


btn.addEventListener('click', () => {
    if(btn.classList.contains('active')){

        removeMealsLS(mealData.idMeal)
        btn.classList.remove('active');
    
    } else {

        addMealsLS(mealData.idMeal)
        btn.classList.add('active');
    
    }

    fetchFavMeals();
});

    meal.addEventListener('click', () => {
        showMealInfo(mealData);
    })
    mealsEl.appendChild(meal);
}


function addMealsLS(mealId){
    const mealIds = getMealsLS();

    localStorage.setItem('mealIds' , JSON.stringify([ ...mealIds, mealId]));
}

function removeMealsLS(mealId){
    const mealIds = getMealsLS();

    localStorage.setItem('mealIds' , JSON.stringify(mealIds.filter(id => id !== mealId)));
}

function getMealsLS(){
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));
    return mealIds === null ? [] : mealIds;
}

 async function fetchFavMeals(){
         //Clean the container
    favouriteContainer.innerHTML = "";

    const mealIds = getMealsLS();

    for(let i = 0; i < mealIds.length; i++){
        const mealId = mealIds[i];
        const meal = await getMealsById(mealId);

        addMealToFav(meal);
    }
    // Reflect them to the page
    
}
function addMealToFav(mealData){
    const favMeal = document.createElement('li');
    favMeal.innerHTML = `
    <img src="${mealData.strMealThumb}"
    alt="${mealData.strMeal}">
    <span>${mealData.strMeal}</span>
    <button class="clear"><i class="fas fa-window-close"></i></button>
    `;

    const btn = favMeal.querySelector('.clear');
    btn.addEventListener('click', () => {
        removeMealsLS(mealData.idMeal);
        fetchFavMeals();
    })
     favMeal.addEventListener('click', () => {
        showMealInfo(mealData)
    });

    favouriteContainer.appendChild(favMeal);
    
}
function showMealInfo(mealData){
    // Clean the container
    mealInfoEl.innerHTML = '';
    // update Meal info
    const mealEl = document.createElement('div');
    
    mealEl.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img src="${mealData.strMealThumb}" 
         alt="${mealData.strMeal}">
        <p>${mealData.strInstructions}</p>
    `

    mealInfoEl.appendChild(mealEl);


    // Show the popup
    mealPopup.classList.remove('hidden');
}

searchBtn.addEventListener('click',async () => {
    
    //Cleans the input
    mealsEl.innerHTML = '';
    
    const search = searchTerm.value;

    const meals = await getMealBySearch(search);

    if (meals) {
        meals.forEach(meal => {
            addMeal(meal);
        })
    }
    
});

popupCloseBtn.addEventListener('click', () => {
  mealPopup.classList.add('hidden');   
}) 