//Load Header & Footer
$(function(){
    $("#navbar").load("./navbar.html"); 
    $("#footer").load("./footer.html"); 
});

//sliding meals suggestion on home page ramdomized
function getRandomMeal() {
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((response) => response.json())
    .then((data) => {
      var meal = data.meals[0];
      document.querySelector("#header .carousel-item.active h2").textContent = meal.strCategory;
      document.querySelector("#header .carousel-item.active h1").textContent = meal.strMeal;
      document.querySelector("#header .carousel-item.active a").setAttribute("data-meal-name", meal.strMeal);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  getRandomMeal();
});

var prevButton = document.querySelector("#header .carousel-control-prev");
prevButton.addEventListener("click", function(){
  document.querySelector("#header .carousel-item.active").classList.add("fade");
  setTimeout(getRandomMeal, 400);
  setTimeout(function() {
    document.querySelector("#header .carousel-item.active").classList.remove("fade");
  }, 700);
});

var nextButton = document.querySelector("#header .carousel-control-next");
nextButton.addEventListener("click", function(){
  document.querySelector("#header .carousel-item.active").classList.add("fade");
 setTimeout(getRandomMeal, 400);


  setTimeout(function() {
    document.querySelector("#header .carousel-item.active").classList.remove("fade");
  }, 700);
});



//Api load in the 6 cards
async function fillCard(cardElement) {
  const API_URL = 'https://www.themealdb.com/api/json/v1/1/random.php';
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const meal = data.meals[0];

    const cardImg = cardElement.querySelector('.collection-img img');
    cardImg.src = meal.strMealThumb;

    const mealName = cardElement.querySelector('.my-');
    mealName.textContent = meal.strMeal;

    // Set the value of data-meal-name in the "Cook Now" button
    const cookNowButton = cardElement.querySelector('#Cook-Now');
    cookNowButton.setAttribute('data-meal-name', meal.strMeal);
  } catch (error) {
    console.error(error);
  }
}


const template = document.querySelector('.collection-list .best');
for (let i = 0; i < 6; i++) {
  const cardElement = template.cloneNode(true);
  template.parentNode.appendChild(cardElement);
  fillCard(cardElement);
}

template.remove();

//Api Search and output

async function searchMeals(query) {
    const API_URL2 = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  try {
    const response = await fetch(`${API_URL2}${query}`);
    const data = await response.json();
    const meals = data.meals || [];


    const cardElements = document.querySelectorAll('.collection-list .best');
    for (let i = 0; i < cardElements.length; i++) {
      const meal = meals[i];
      if (!meal) {
        cardElements[i].style.display = 'none';
        continue;
      }

      cardElements[i].style.display = 'block';

      const cardImg = cardElements[i].querySelector('.collection-img img');
      cardImg.src = meal.strMealThumb;

      const mealName = cardElements[i].querySelector('.my-');
      mealName.textContent = meal.strMeal;
      // Set the value of data-meal-name in the "Cook Now" button

      const cookNowButton = cardElements[i].querySelector('#Cook-Now');
      cookNowButton.setAttribute('data-meal-name', meal.strMeal);
    }
  } catch (error) {
    console.error(error);
  }

}

const searchInput = document.getElementById('search-bar');
searchInput.addEventListener('keyup', event => {
  searchMeals(event.target.value);
});

//Meals Details

const API_URL3 = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

async function getMealDetails(mealName) {
  try {
    const response = await fetch(`${API_URL3}${mealName}`);
    const data = await response.json();
    const meals = data.meals;
    const meal = meals ? meals[0] : null;

    if (!meal) {
      return { instructions: '', ingredients: [] };
    }
  
    const instructions = meal.strInstructions;
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (!ingredient || !measure) {
        continue;
      }
      ingredients.push(`${ingredient}: ${measure}`);
    }

    return { instructions, ingredients };
  } catch (error) {
    console.error(error);
  }
}

async function showMealDetails(mealName) {
  const { instructions, ingredients} = await getMealDetails(mealName);

  const modalBody = document.querySelector('.modal-body');
  modalBody.innerHTML = '';  // Clear the contents of the modal body
  // Create and append the meal name element
  console.log(mealName);
  const mealNameElement = document.getElementById('exampleModalLabel');
  mealNameElement.textContent = mealName;

  // Create and append the instructions element
  const instructionsHeading = document.createElement('h5');
  instructionsHeading.textContent = 'Instructions:';
  modalBody.appendChild(instructionsHeading);

  const instructionsParagraph = document.createElement('p');
  instructionsParagraph.innerHTML = instructions.replace(/\n/g, '<br>');
  modalBody.appendChild(instructionsParagraph);

  // Create and append the ingredients element
  const ingredientsHeading = document.createElement('h5');
  ingredientsHeading.textContent = 'Ingredients:';
  modalBody.appendChild(ingredientsHeading);

  const ingredientsList = document.createElement('ul');
  ingredients.forEach(ingredient => {
    const listItem = document.createElement('li');
    listItem.textContent = ingredient;
    ingredientsList.appendChild(listItem);
  });
  modalBody.appendChild(ingredientsList);

  const modal = document.querySelector('.modal');
  $(modal).modal('show');
}

window.addEventListener('load', () => {
  const modal = document.querySelector('.modal');
  modal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const mealName = button.getAttribute('data-meal-name');
    showMealDetails(mealName);
  });
});

