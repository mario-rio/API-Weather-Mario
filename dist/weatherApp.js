// Definim la clau de l'API
const API_KEY = 'ddc6308e292b45028c0215125242502';

// Creem una llista buida per emmagatzemar les ciutats
let ciutats = [];

// Afegim un esdeveniment 'submit' al formulari de la ciutat
document.getElementById('city-form').addEventListener('submit', function (event) {
    // Evitem que el formulari es refresqui
    event.preventDefault();

    // Obtenim el valor del camp d'entrada de la ciutat
    const ciutat = document.getElementById('city-input').value;

    // Si la ciutat no està a la llista, l'afegim i obtenim el temps
    if (ciutat && !ciutats.includes(ciutat)) {
        ciutats.push(ciutat);
        obtenirTemps(ciutat);
    }

    // Esborrem el valor del camp d'entrada de la ciutat
    document.getElementById('city-input').value = '';
});

// Funció per obtenir el temps d'una ciutat
function obtenirTemps(ciutat) {
    // Netejem els errors
    netejarErrors();

    // Fem una petició a l'API del temps
    fetch(`https://api.weatherapi.com/v1/current.json?q=${ciutat}&key=${API_KEY}`)
        .then(response => {
            // Si la resposta no és correcta, llancem un error
            if (!response.ok) {
                throw new Error('No s\'ha pogut obtenir la informació del temps per a aquesta ciutat.');
            }
            // Si la resposta és correcta, la convertim a JSON
            return response.json();
        })
        // Utilitzem les dades per mostrar el temps
        .then(data => mostrarTemps(data, ciutat))
        // Si hi ha un error, el mostrem
        .catch(error => mostrarError(ciutat, error.message));
}

// Funció per mostrar el temps d'una ciutat
function mostrarTemps(data, ciutat) {
    // Netejem els errors
    netejarErrors();

    // Creem un nou element div
    const divCiutat = document.createElement('div');

    // Afegim el HTML al div
    divCiutat.innerHTML = `
        <h3 class="text-xl cursor-pointer" onclick="mostrarDetalls('${ciutat}')">${data.location.name}, ${data.location.country}</h3>
        <p>${data.current.condition.text}</p>
        <p>${data.current.temp_c}°C</p>
        <input id="${ciutat}-input" class="w-full p-2 mb-2 border rounded" type="text" placeholder="Nou nom de la ciutat">
        <button class="w-full p-2 bg-green-500 text-white rounded mb-2" onclick="canviarCiutat('${ciutat}')">Canviar Ciutat</button>
        <button class="w-full p-2 bg-red-500 text-white rounded" onclick="eliminarCiutat('${ciutat}')">Eliminar</button>
    `;

    // Afegim el div a la llista de ciutats
    document.getElementById('city-list').appendChild(divCiutat);
}

// Funció per mostrar un error
function mostrarError(ciutat, missatge) {
    // Netejem els errors
    netejarErrors();

    // Creem un nou element div
    const divError = document.createElement('div');

    // Afegim classes al div
    divError.classList.add('text-red-500', 'text-sm', 'mb-2', 'error-message');

    // Afegim el missatge d'error al div
    divError.textContent = `Error en obtenir les dades per a ${ciutat}: ${missatge}`;

    // Afegim el div a la llista de ciutats
    document.getElementById('city-list').appendChild(divError);
}

// Funció per canviar el nom d'una ciutat
function canviarCiutat(antigaCiutat) {
    // Obtenim el valor del camp d'entrada de la nova ciutat
    const novaCiutat = document.getElementById(`${antigaCiutat}-input`).value;

    // Si la nova ciutat no està a la llista, la canviem i refresquem les ciutats
    if (novaCiutat && !ciutats.includes(novaCiutat)) {
        ciutats = ciutats.map(ciutat => ciutat === antigaCiutat ? novaCiutat : ciutat);
        refrescarCiutats();
    }
}

// Funció per eliminar una ciutat
function eliminarCiutat(ciutat) {
    // Netejem els errors
    netejarErrors();

    // Eliminem la ciutat de la llista
    ciutats = ciutats.filter(c => c !== ciutat);

    // Refresquem les ciutats
    refrescarCiutats();
}

// Funció per refrescar les ciutats
function refrescarCiutats() {
    // Netejem els errors
    netejarErrors();

    // Obtenim la llista de ciutats
    const llistaCiutats = document.getElementById('city-list');

    // Eliminem tots els fills de la llista de ciutats
    while (llistaCiutats.firstChild) {
        llistaCiutats.removeChild(llistaCiutats.firstChild);
    }

    // Obtenim el temps per a cada ciutat
    ciutats.forEach(ciutat => obtenirTemps(ciutat));
}

// Funció per netejar els errors
function netejarErrors() {
    // Obtenim tots els missatges d'error
    const errors = document.querySelectorAll('.error-message');

    // Eliminem cada missatge d'error
    errors.forEach(error => error.remove());
}