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
    const meals = data.meals;

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

