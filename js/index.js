const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=30';

const fetchPokemonData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const pokemonList = data.results;
    displayPokemons(pokemonList);
  } catch (error) {
    console.error('Error fetching data from API:', error);
  }
};

const setButton = (card) => {
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
  return buttonContainer;
};

const createStatElement = (label, value) => {
  const statElement = document.createElement('p');
  statElement.textContent = `${label}: ${value} `;
  return statElement;
};

const appendCardWithItems = (arrItems, card) => {
  arrItems.forEach((item) => card.appendChild(item));
  return card;
};

const createPokemon = async (pokemon) => {
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

  innerStatContainer.appendChild(createStatElement('Card ID#', pokemonData.id));

  const pokemonDataKeys = {
    'HP': pokemonData.stats[0].base_stat,
    'Ability': pokemonData.abilities[0].ability.name,
    'Attack': pokemonData.stats[1].base_stat,
    'Defense': pokemonData.stats[2].base_stat,
  };

  Object.entries(pokemonDataKeys).forEach(([key, value]) => {
    innerStatContainer.appendChild(createStatElement(key, value));
  });

  statsContainer.appendChild(innerStatContainer);

  // Create button container for view and add to favorites
  const button = setButton(card);

  // Append elements to the card
  const arrItems = [imgContainer, nameTag, statsContainer, button];

  return appendCardWithItems(arrItems, card);
};

const displayPokemons = async (pokemonList) => {
  const cardSection = document.querySelector('.card-section');
  cardSection.innerHTML = '';
  const cards = await Promise.all(pokemonList.map(createPokemon));
  cards.forEach(card => cardSection.append(card));
  // Use requestAnimationFrame to ensure the DOM updates are complete before running abilityDisplay
  requestAnimationFrame(abilityDisplay);
};

const abilityDisplay = () => {
  let staticCount = '0';
  let keenEyesCount = '0';
  let overGrowCount = '0';
  let shedSkinCount = '0';

  document.querySelectorAll('.card-container').forEach(card => {
    const abilityElement = card.querySelector('.inner-stat-container p:nth-child(3)');
    if (abilityElement) {
      const ability = abilityElement.textContent.split(': ')[1];
      console.log('Ability found:', ability); // Add logging to trace the ability
      if (ability.includes('static')) {
        staticCount++;
      } else if (ability.includes('keen-eye')) {
        keenEyesCount++;
      } else if (ability.includes('overgrow')) {
        overGrowCount++;
      } else if (ability.includes('shed-skin')) {
        shedSkinCount++;
      }
    } else {
      console.warn('Ability element not found for card:', card); // Warn if ability element is not found
    }
  });

  const abilityDisplayContainer = document.querySelector('.ability-display-container');
  if (abilityDisplayContainer) {
    abilityDisplayContainer.innerHTML = `
      <h5>Abilities</h5>
      <p>Static: ${staticCount}</p>
      <p>Keen-Eye: ${keenEyesCount}</p>
      <p>Overgrow: ${overGrowCount}</p>
      <p>Shed-Skin: ${shedSkinCount}</p>
    `;
  } else {
    console.error('Ability display container not found'); // Error if ability display container is not found
  }



};


// Fetch Pokémon data when the document is ready
document.addEventListener('DOMContentLoaded', () => fetchPokemonData(API_URL));

let favsection = document.getElementById('fav-section');
let mainCardSection = document.getElementById('main-card-section');
let favorites = [favsection];

const toggleFavorite = (card) => {
  const favSection = document.getElementById('fav-section');
  const appendContainer = card.parentElement === favSection ? mainCardSection : favSection;
  card.remove();
  appendContainer.appendChild(card);
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
sortButtonAsc.addEventListener('click', () => {
  sortData(sortButtonAsc.dataset.sortdir);
});
sortButtonDesc.addEventListener('click', () => {
  sortData(sortButtonDesc.dataset.sortdir);
});

const totalFav = () => {
  let favSection = document.getElementById('fav-section');
  let favCounter = document.querySelector('.counter-text');
  let favTotal = favSection.childElementCount;
  favCounter.textContent = ` Favorites: ${favTotal}`;
};

totalFav();
