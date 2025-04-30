function fetchPokemon() {
    const name = document.getElementById("search").value.toLowerCase();
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(res => {
        if (!res.ok) throw new Error("Pokémon not found");
        return res.json();
      })
      .then(data => {
        document.getElementById("result").innerHTML = `
          <h2>${capitalize(data.name)} (#${data.id})</h2>
          <img src="${data.sprites.front_default}" alt="${data.name}">
          <p><strong>Type:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
          <p><strong>Height:</strong> ${data.height}</p>
          <p><strong>Weight:</strong> ${data.weight}</p>
        `;
      })
      .catch(err => {
        document.getElementById("result").innerHTML = `<p>${err.message}</p>`;
      });
  }
  
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  