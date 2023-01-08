//Load Header & Footer
$(function(){
    $("#navbar").load("navbar.html"); 
    $("#footer").load("footer.html"); 
});
//
async function getCategories() {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
      const data = await response.json();
      const meals = data.meals;
      const select = document.querySelector('#categories');
      meals.forEach(meal => {
        const option = document.createElement('option');
        option.text = meal.strCategory;
        option.value = meal.strCategory;
        if (meal.strCategory === 'Lamb') {
          option.selected = true;
        }
        select.add(option);
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  document.addEventListener('DOMContentLoaded', getCategories);

  //   
async function getRegions() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    const data = await response.json();
    const regions = data.meals;
    const select = document.querySelector('#regions');
    regions.forEach(region => {
      const option = document.createElement('option');
      option.text = region.strArea;
      option.value = region.strArea;
      if (region.strArea === 'Moroccan') {
        option.selected = true;
      }
      select.add(option);
    });
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', getRegions);
  
//save api file into json and display on page
async function getAllMeals() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s');
    const data = await response.json();
    return data.meals;
  } catch (error) {
    console.error(error);
  }
}

const container = document.querySelector('.collection-list');
const categoriesSelect = document.querySelector('#categories');
const regionsSelect = document.querySelector('#regions');

getAllMeals().then(meals => {
  // Create a card for each meal
  const templateCard = document.querySelector('.best');
const container = templateCard.parentNode;
container.removeChild(templateCard);

  meals.forEach(meal => {
    const card = document.createElement('div');
    card.classList.add('col-md-6', 'col-lg-4', 'col-xl-2', 'p-2', 'best');
    card.setAttribute('data-category', meal.strCategory);
    card.setAttribute('data-region', meal.strArea);
    card.innerHTML = `
      <div class="collection-img position-relative">
        <img src="${meal.strMealThumb}" class="w-100">
      </div>
      <div class="text-center">
        <p class="text-capitalize my-">${meal.strMeal}</p>
        <div class="d-flex flex-wrap justify-content-center filter-button-group">
          <button type="button" class="btn m-1 text-light" data-bs-toggle="modal" data-bs-target="#exampleModal" data-meal-name="${meal.strMeal}">Cook Now</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
    // Hide all the cards initially
    $('.best').hide();
  // Initialize the pagination plugin
  $('.pagination').bootpag({
    total: Math.ceil(meals.length / 6),
    page: 1,
    maxVisible: 5,
    leaps: true,
    firstLastUse: true,
    first: '←',
    last: '→',
    wrapClass: 'pagination',
    activeClass: 'active',
    disabledClass: 'disabled',
    nextClass: 'next',
    prevClass: 'prev',
    lastClass: 'last',
    firstClass: 'first',
  }).on('page', function(event, num) {
    // Show only the cards on the selected page
    $('.best').hide();
    $('.best').slice((num - 1) * 6, num * 6).show();
    
  });

  // Customize the pagination links to display as buttons
  $('.pagination').find('a').addClass('btn btn-outline-dark btn-sm');

  // Show the first page of cards
  $('.best').slice(0, 6).show();
});

///



let $filteredMeals;

// Add a click event listener to the filter button
document.querySelector('#filter').addEventListener('click', () => {
  // Get the values of the dropdown lists
  const category = document.querySelector('#categories').value;
  const region = document.querySelector('#regions').value;

  // Show only the meals that match the selected category and region
  $filteredMeals = $('.best').filter(`[data-category="${category}"][data-region="${region}"]`);
  $('.best').hide();
  $filteredMeals.show();

  // Update the pagination
  if ($filteredMeals.length > 6) {
    $('.pagination').bootpag({
      total: Math.ceil($filteredMeals.length / 6),
      page: 1
    }).on('page', function(event, num) {
      // Show only the cards on the selected page that match the selected category and region
      $filteredMeals.hide();
      $filteredMeals.slice((num - 1) * 6, num * 6).show();
    });
  } else {
    $('.pagination').empty();
  }
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
      alert(mealName);
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
  const { instructions, ingredients } = await getMealDetails(mealName);

  const modalBody = document.querySelector('.modal-body');
  modalBody.innerHTML = '';  // Clear the contents of the modal body

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

const buttons = document.querySelectorAll('.filter-button-group button');
for (const button of buttons) {
  button.addEventListener('click', async event => {
    event.preventDefault();
    const mealName = event.target.dataset.mealName;
    showMealDetails(mealName);
  });
}

