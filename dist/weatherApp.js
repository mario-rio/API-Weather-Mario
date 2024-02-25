const API_KEY = 'ddc6308e292b45028c0215125242502';
let ciutats = [];

document.getElementById('city-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const ciutat = document.getElementById('city-input').value;
    if (ciutat && !ciutats.includes(ciutat)) {
        ciutats.push(ciutat);
        obtenirTemps(ciutat);
    }
    document.getElementById('city-input').value = '';
});

function obtenirTemps(ciutat) {
    netejarErrors();
    fetch(`https://api.weatherapi.com/v1/current.json?q=${ciutat}&key=${API_KEY}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No s\'ha pogut obtenir la informació del temps per a aquesta ciutat.');
            }
            return response.json();
        })
        .then(data => mostrarTemps(data, ciutat))
        .catch(error => mostrarError(ciutat, error.message));
}


function mostrarTemps(data, ciutat) {
    netejarErrors(); 
    const divCiutat = document.createElement('div');
    divCiutat.innerHTML = `
        <h3 class="text-xl cursor-pointer" onclick="mostrarDetalls('${ciutat}')">${data.location.name}, ${data.location.country}</h3>
        <p>${data.current.condition.text}</p>
        <p>${data.current.temp_c}°C</p>
        <input id="${ciutat}-input" class="w-full p-2 mb-2 border rounded" type="text" placeholder="Nou nom de la ciutat">
        <button class="w-full p-2 bg-green-500 text-white rounded mb-2" onclick="canviarCiutat('${ciutat}')">Canviar Ciutat</button>
        <button class="w-full p-2 bg-red-500 text-white rounded" onclick="eliminarCiutat('${ciutat}')">Eliminar</button>
    `;
    document.getElementById('city-list').appendChild(divCiutat);
}

function mostrarError(ciutat, missatge) {
    netejarErrors(); 
    const divError = document.createElement('div');
    divError.classList.add('text-red-500', 'text-sm', 'mb-2', 'error-message');
    divError.textContent = `Error en obtenir les dades per a ${ciutat}: ${missatge}`;
    document.getElementById('city-list').appendChild(divError);
}

function canviarCiutat(antigaCiutat) {
    const novaCiutat = document.getElementById(`${antigaCiutat}-input`).value;
    if (novaCiutat && !ciutats.includes(novaCiutat)) {
        ciutats = ciutats.map(ciutat => ciutat === antigaCiutat ? novaCiutat : ciutat);
        refrescarCiutats();
    }
}

function eliminarCiutat(ciutat) {
    netejarErrors();
    ciutats = ciutats.filter(c => c !== ciutat);
    refrescarCiutats();
}


function refrescarCiutats() {
    netejarErrors(); 
    const llistaCiutats = document.getElementById('city-list');
    while (llistaCiutats.firstChild) {
        llistaCiutats.removeChild(llistaCiutats.firstChild);
    }
    ciutats.forEach(ciutat => obtenirTemps(ciutat));
}

function netejarErrors() {
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.remove());
}
