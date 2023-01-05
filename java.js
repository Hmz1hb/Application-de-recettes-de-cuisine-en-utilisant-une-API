//Load Header & Footer
$(function(){
    $("#navbar").load("navbar.html"); 
    $("#footer").load("footer.html"); 
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

const API_URL3 = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';

async function getMealDetails(idMeal) {
  try {
    const response = await fetch(`${API_URL3}${idMeal}`);
    const data = await response.json();
    const meals = data.meals;
    const meal = meals ? meals[0] : null;

    if (!meal) {
      alert(idMeal);
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






async function showMealDetails(idMeal) {
  const { instructions, ingredients } = await getMealDetails(idMeal);

  const modalBody = document.querySelector('.modal-body');
  modalBody.innerHTML = `
    <h5>Instructions:</h5>
    <p>${instructions.replace(/\n/g, '<br>')}</p>
    <h5>Ingredients:</h5>
    <ul>
      ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
    </ul>
  `;

  const modal = document.querySelector('.modal');
  $(modal).modal('show');
}

const buttons = document.querySelectorAll('.filter-button-group button');
for (const button of buttons) {
  button.addEventListener('click', async event => {
    event.preventDefault();
    const idMeal = event.target.dataset.idMeal;
    showMealDetails(idMeal);
  });
}
