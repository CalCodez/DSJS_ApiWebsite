const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=30';

async function fetchPokemonData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const pokemonList = data.results;

    // Display up to 30 items
    displayPokemon(pokemonList);
  } catch (error) {
    console.error('Error fetching data from API:', error);
  }
}


function displayPokemon(pokemonList) {
  const cardSection = document.querySelector('.card-section');
  cardSection.innerHTML = '';

  pokemonList.forEach(async (pokemon) => {
    const response = await fetch(pokemon.url);
    const pokemonData = await response.json();

    // Create a card element for each Pokémon
    const card = document.createElement('div');
    card.classList.add('card-container');
    card.setAttribute('id', pokemonData.id);


    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');
    const img = document.createElement('img');
    img.src = pokemonData.sprites.front_default; // Pokémon image
    img.alt = pokemonData.name;
    imgContainer.appendChild(img);

    // Add Pokémon name
    const nameTag = document.createElement('h3');
    nameTag.classList.add('name-tag');
    nameTag.textContent = pokemonData.name;

    // Add stats container
    const statsContainer = document.createElement('div');
    statsContainer.classList.add('card-stats-container');
    const innerStatContainer = document.createElement('div');
    innerStatContainer.classList.add('inner-stat-container');

    // Add stats (e.g., HP, attack, defense)

    const pokemonID = document.createElement('p');
    pokemonID.textContent = ` Card ID: ${pokemonData.id} `;

    const hp = document.createElement('p');
    hp.textContent = `HP: ${pokemonData.stats[0].base_stat} `;

    const ability = document.createElement('p');
    ability.textContent = `Ability: ${pokemonData.abilities[0].ability.name} `;


    const attack = document.createElement('p');
    attack.textContent = `Attack: ${pokemonData.stats[1].base_stat} `;

    const defense = document.createElement('p');
    defense.textContent = `Defense: ${pokemonData.stats[2].base_stat} `;

    innerStatContainer.appendChild(pokemonID);

    innerStatContainer.appendChild(hp);
    innerStatContainer.appendChild(ability);
    innerStatContainer.appendChild(attack);
    innerStatContainer.appendChild(defense);
    statsContainer.appendChild(innerStatContainer);

    // Create button container for view and add to favorites
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');


    const addFavBtn = document.createElement('button');
    addFavBtn.classList.add('add-fav-btn', 'btn');
    addFavBtn.innerHTML = '<img src="./images/pokeball_closed.png" alt="pokeball-closed"> Add To Favorites';
    addFavBtn.addEventListener('click', () => {
      toggleFavorite(card);
      totalFav();      // Assuming `card` is accessible in this scope
      // Update button text based on card's current location
      if (card.parentElement === document.getElementById('fav-section')) {
        addFavBtn.innerHTML = '<img src="./images/pokeball_open.png" alt="pokeball-closed"> Remove From Favorites';
      } else {
        addFavBtn.innerHTML = '<img src="./images/pokeball_closed.png" alt="pokeball-open"> Add';
      }
    });
    buttonContainer.appendChild(addFavBtn);
    // Append elements to the card
    card.appendChild(imgContainer);
    card.appendChild(nameTag);
    card.appendChild(statsContainer);
    card.appendChild(buttonContainer);
    // Append card to the card section
    cardSection.appendChild(card);
  });
}

// Fetch Pokémon data when the document is ready
document.addEventListener('DOMContentLoaded', fetchPokemonData);

let favsection = document.getElementById('fav-section');
let favorites = [favsection];

function toggleFavorite(card) {
  const favSection = document.getElementById('fav-section');
  if (card.parentElement === favSection) {
    // If the card is in favorites, move it back to the card section
    card.remove();
    document.querySelector('.card-section').appendChild(card);
  } else {
    // If the card is in the card section, move it to favorites
    card.remove();
    favSection.appendChild(card);
  }
}




//**Modal  */

//!!Modal Variables */
const modalOpen = '[data-open]';
const modalClose = '[data-close]';
const isVisible = 'is-visible';


//**Modal Selectors */
const openModal = document.querySelectorAll(modalOpen);
const closeModal = document.querySelectorAll(modalClose);

//FUll Site Modal "open buttons"
for (const elm of openModal) {
  elm.addEventListener('click', function () {
    const modalId = this.dataset.open;
    document.getElementById(modalId).classList.add(isVisible)
  })
}
//FUll Site Modal "close buttons"
for (const elm of closeModal) {
  elm.addEventListener('click', function () {
    this.parentElement.parentElement.parentElement.classList.remove(isVisible);
  })
}

//Modal popup modal

document.addEventListener('click', (e) => {
  if (e.target === document.querySelector('.modal.is-visible')) {
    document.querySelector('.modal.is-visible').classList.remove(isVisible)
  }
});

//Function to close popup modal using the escape key
document.addEventListener('keyup', (e) => {
  if (e.key === 'Escape') {
    document.querySelector('.modal.is-visible').classList.remove(isVisible)
  }
})


//Fav Section Sorting function
function sortData(direction) {
  let container = document.getElementById('fav-section');
  let allItems = container.children;
  let itemsArray = Array.from(allItems);

  itemsArray.sort(function (a, b) {
    if (direction === 'asc') {
      return parseInt(a.id) - parseInt(b.id);
    } else if (direction === 'desc') {
      return parseInt(b.id) - parseInt(a.id);
    }
  });

  itemsArray.forEach(function (item) {
    container.appendChild(item);
  })
}

const sortButtonAsc = document.getElementById('sortBTN-asc');
const sortButtonDesc = document.getElementById('sortBTN-desc');

sortButtonAsc.addEventListener('click', function () {
  let direction = sortButtonAsc.dataset.sortdir;
  sortData(direction);
});
sortButtonDesc.addEventListener('click', function () {
  let direction = sortButtonDesc.dataset.sortdir;
  sortData(direction);
});

//function to display total number of favorites in .conter-text
function totalFav() {
  let favSection = document.getElementById('fav-section');
  let favCounter = document.querySelector('.counter-text');
  let favTotal = favSection.childElementCount;
  favCounter.textContent = `Total Favorites: ${favTotal}`;
}

totalFav();
