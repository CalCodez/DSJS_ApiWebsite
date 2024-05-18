const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=30';

const fetchPokemonData = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const pokemonList = data.results;

    // Display up to 30 items
    displayPokemon(pokemonList);
  } catch (error) {
    console.error('Error fetching data from API:', error);
  }
};

const displayPokemon = async (pokemonList) => {
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

    // Add CardID, and Stats
    const createStatElement = (label, value) => {
      const statElement = document.createElement('p');
      statElement.textContent = `${label}: ${value} `;
      return statElement;
    };

    innerStatContainer.appendChild(createStatElement('Card ID#', pokemonData.id));
    innerStatContainer.appendChild(createStatElement('HP', pokemonData.stats[0].base_stat));
    innerStatContainer.appendChild(createStatElement('Ability', pokemonData.abilities[0].ability.name));
    innerStatContainer.appendChild(createStatElement('Attack', pokemonData.stats[1].base_stat));
    innerStatContainer.appendChild(createStatElement('Defense', pokemonData.stats[2].base_stat));
    statsContainer.appendChild(innerStatContainer);

    // Create button container for view and add to favorites
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const addFavBtn = document.createElement('button');
    addFavBtn.classList.add('add-fav-btn', 'btn');
    addFavBtn.innerHTML = '<img src="./images/pokeball_closed.png" alt="pokeball-closed"> Add To Favorites';
    addFavBtn.addEventListener('click', () => {
      toggleFavorite(card);
      totalFav(); // Update button text based on card's current location
      if (card.parentElement === document.getElementById('fav-section')) {
        addFavBtn.innerHTML = '<img src="./images/pokeball_open.png" alt="pokeball-closed"> Remove From Favorites';
      } else {
        addFavBtn.innerHTML = '<img src="./images/pokeball_closed.png" alt="pokeball-open"> Add To Favorites';
      }
    });
    buttonContainer.appendChild(addFavBtn);

    // Append elements to the card
    card.appendChild(imgContainer);
    card.appendChild(nameTag);
    card.appendChild(statsContainer);
    card.appendChild(buttonContainer);


    cardSection.appendChild(card);
  });
};

// Fetch Pokémon data when the document is ready
document.addEventListener('DOMContentLoaded', fetchPokemonData);

let favsection = document.getElementById('fav-section');
let favorites = [favsection];

const toggleFavorite = (card) => {
  const favSection = document.getElementById('fav-section');
  if (card.parentElement === favSection) {

    card.remove();
    document.querySelector('.card-section').appendChild(card);
  } else {

    card.remove();
    favSection.appendChild(card);
  }
};

// Create a function to save favorites to local storage
const saveFavorites = () => localStorage.setItem('favorites', JSON.stringify(favsection.innerHTML));

// **Modal**

const modalOpen = '[data-open]';
const modalClose = '[data-close]';
const isVisible = 'is-visible';

const openModal = document.querySelectorAll(modalOpen);
const closeModal = document.querySelectorAll(modalClose);

// Function to Open Modal
openModal.forEach(elm => elm.addEventListener('click', () => {
  const modalId = elm.dataset.open;
  document.getElementById(modalId).classList.add(isVisible);
}));

// Function to Close Modal
closeModal.forEach(elm => elm.addEventListener('click', () => {
  elm.parentElement.parentElement.classList.remove(isVisible);
}));

// Function to Close Modal on click outside or escape key
document.addEventListener('click', e => {
  if (e.target === document.querySelector('.modal.is-visible')) {
    document.querySelector('.modal.is-visible').classList.remove(isVisible);
  }
});

document.addEventListener('keyup', e => {
  if (e.key === 'Escape') {
    document.querySelector('.modal.is-visible').classList.remove(isVisible);
  }
});

// Fav Section Sorting function
const sortData = (direction) => {
  let container = document.getElementById('fav-section');
  let itemsArray = Array.from(container.children);

  itemsArray.sort((a, b) => direction === 'asc' ? parseInt(a.id) - parseInt(b.id) : parseInt(b.id) - parseInt(a.id));

  itemsArray.forEach(item => container.appendChild(item));
};

const sortButtonAsc = document.getElementById('sortBTN-asc');
const sortButtonDesc = document.getElementById('sortBTN-desc');

sortButtonAsc.addEventListener('click', () => sortData(sortButtonAsc.dataset.sortdir));
sortButtonDesc.addEventListener('click', () => sortData(sortButtonDesc.dataset.sortdir));

// Function to display total number of favorites
const totalFav = () => {
  let favSection = document.getElementById('fav-section');
  let favCounter = document.querySelector('.counter-text');
  let favTotal = favSection.childElementCount;
  favCounter.textContent = ` Favorites: ${favTotal}`;
};

totalFav();
