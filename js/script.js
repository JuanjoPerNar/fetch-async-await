const urlBase = "https://pokeapi.co/api/v2/pokemon"; // URL base de la API de Pokémon
const limit = 10; // Número de Pokémon por página
let offset = 0; // Desplazamiento inicial para la paginación

// Referencias a elementos del DOM
const app = document.getElementById('app');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const resetBtn = document.getElementById('resetBtn');

// Función para obtener y mostrar Pokémon desde la API
const fetchPokemon = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayPokemon(data.results);
    } catch (error) {
        console.error("Error al mostrar resultados", error);
    }
};

// Función para mostrar la lista de Pokémon en el contenedor principal
const displayPokemon = (pokemonList) => {
    app.innerHTML = "";

    // Recorre cada Pokémon de la lista
    pokemonList.forEach(async (pokemon) => {
        try {
            const response = await fetch(pokemon.url);
            const details = await response.json();
            // Crea una tarjeta para mostrar el Pokémon
            const pokemonCard = document.createElement('div');
            pokemonCard.classList.add('pokemon-card');
            pokemonCard.innerHTML = `
                <img src="${details.sprites.front_default}" alt="${details.name}">
                <h3>${details.name}</h3>
                <p><strong>Altura:</strong> ${details.height}</p>
                <p><strong>Peso:</strong>: ${details.weight}</p>
                <p><strong>Experiencia base:</strong>: ${details.base_experience}</p>
            `;

            app.appendChild(pokemonCard);
        } catch (error) {
            console.error("Error al mostrar resultados", error);
        }
    });
};

// Inicializa la página con los Pokémon de la primera página
fetchPokemon(`${urlBase}?limit=${limit}&offset=${offset}`);

// Botón para cargar la página anterior
prevBtn.addEventListener('click', () => {
    if (offset > 0) {
        offset -= limit; // Retroceder página
        fetchPokemon(`${urlBase}?limit=${limit}&offset=${offset}`);
    }
});

// Botón para cargar la página siguiente
nextBtn.addEventListener('click', () => {
    offset += limit; // Avanza página
    fetchPokemon(`${urlBase}?limit=${limit}&offset=${offset}`);
});

// Botón para reiniciar la vista inicial
resetBtn.addEventListener('click', () => {
    offset = 0; // Vuelve a la primera página
    fetchPokemon(`${urlBase}?limit=${limit}&offset=${offset}`);
    searchInput.value = "";
});

// Botón para buscar un Pokémon por nombre
searchBtn.addEventListener('click', async () => {
    const query = searchInput.value.trim().toLowerCase(); // Obtiene el texto ingresado, en minúsculas
    if (!query) return; // Si no hay texto, no hace nada

    try {
        const response = await fetch(`${urlBase}/${query}`);
        const details = await response.json();

        // Muestra los detalles del Pokémon encontrado
        const pokemonCard = `
            <div class="pokemon-card">
                <img src="${details.sprites.front_default}" alt="${details.name}">
                <h3>${details.name}</h3>
                <p><strong>Altura:</strong> ${details.height}</p>
                <p><strong>Peso:</strong> ${details.weight}</p>
                <p><strong>Experiencia base:</strong>c ${details.base_experience}</p>
            </div>
        `;
        app.innerHTML = pokemonCard; // Reemplaza el contenido del contenedor con la tarjeta del Pokémon
    } catch (error) {
        app.innerHTML = `<p>Pokémon no encontrado</p>`; // Muestra un mensaje si no se encuentra el Pokémon
    }
});
