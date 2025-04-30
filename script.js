/* 
  JavaScript logic developed with support from ChatGPT. 
  Assistance included fetch requests from PokéAPI, localStorage handling for favorites, 
  rendering evolution chains, and managing interactive DOM updates.
*/

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  // Load favorites from localStorage
  document.addEventListener("DOMContentLoaded", () => {
    displayFavorites();
  });
  
  // MAIN FETCH FUNCTION
  function fetchPokemon(name = null) {
    const input = document.getElementById("search").value.toLowerCase();
    const query = name || input;
  
    fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
      .then(res => {
        if (!res.ok) throw new Error("Pokémon not found");
        return res.json();
      })
      .then(data => {
        displayPokemon(data);
        fetchEvolutionChain(data.species.url);
      })
      .catch(err => {
        document.getElementById("result").innerHTML = `<p>${err.message}</p>`;
        document.getElementById("evolution").innerHTML = "";
      });
  }
  
  // DISPLAY POKÉMON DATA
  function displayPokemon(data) {
    const result = document.getElementById("result");
    const name = capitalize(data.name);
    const id = data.id;
    const image = data.sprites.other["official-artwork"].front_default;
    const types = data.types.map(t => t.type.name).join(", ");
    const height = data.height;
    const weight = data.weight;
  
    result.innerHTML = `
      <h2>${name} (#${id})</h2>
      <img src="${image}" alt="${name}">
      <p><strong>Type:</strong> ${types}</p>
      <p><strong>Height:</strong> ${height}</p>
      <p><strong>Weight:</strong> ${weight}</p>
      <button onclick="addToFavorites('${name}', '${image}')">❤️ Favorite</button>
    `;
  }
  
  // FETCH EVOLUTION CHAIN
  function fetchEvolutionChain(speciesUrl) {
    fetch(speciesUrl)
      .then(res => res.json())
      .then(speciesData => fetch(speciesData.evolution_chain.url))
      .then(res => res.json())
      .then(chainData => {
        const evoChain = [];
        let evo = chainData.chain;
  
        while (evo) {
          evoChain.push(evo.species.name);
          evo = evo.evolves_to[0];
        }
  
        displayEvolutionChain(evoChain);
      })
      .catch(() => {
        document.getElementById("evolution").innerHTML = "";
      });
  }
  
  // DISPLAY EVOLUTION CHAIN
  function displayEvolutionChain(names) {
    const evoSection = document.getElementById("evolution");
    evoSection.innerHTML = "<h3>Evolution Chain:</h3>";
  
    const list = document.createElement("ul");
    list.classList.add("evo-list");
  
    names.forEach(name => {
      fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then(res => res.json())
        .then(data => {
          const li = document.createElement("li");
          li.innerHTML = `
            <img src="${data.sprites.front_default}" alt="${name}">
            <p>${capitalize(name)}</p>
          `;
          list.appendChild(li);
        });
    });
  
    evoSection.appendChild(list);
  }
  
  // RANDOM POKÉMON
  function fetchRandomPokemon() {
    const max = 1010; // As of Gen 9, change if needed
    const randomId = Math.floor(Math.random() * max) + 1;
    fetchPokemon(randomId);
  }
  
  // ADD TO FAVORITES
  function addToFavorites(name, img) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.some(p => p.name === name)) {
      favorites.push({ name, img });
      localStorage.setItem("favorites", JSON.stringify(favorites));
      displayFavorites();
    }
  }
  
  // DISPLAY FAVORITES
  function displayFavorites() {
    const list = document.getElementById("favoriteList");
    list.innerHTML = "";
  
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.forEach((p, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="favorite-entry">
          <img src="${p.img}" alt="${p.name}" title="${p.name}" width="60">
          <button class="remove-btn" onclick="removeFavorite(${index})">❌</button>
        </div>
      `;
      list.appendChild(li);
    });
  }
  
  // New function to remove by index
  function removeFavorite(index) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
  }
  