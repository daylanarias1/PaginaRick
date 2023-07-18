const ul = document.querySelector('.buttons');
let allPages = Math.ceil(826 / 12);
let id = 1;

let fetchMorty = async () => {

    let promises = [];
    for (let index = 0; index < 12; index++) {
        if (id <= 826) {
            let promise = fetch(`https://rickandmortyapi.com/api/character/${id}`).then(response => response.json());
            promises.push(promise);
            id++;
        } else {
            break;
        }
    }

    try {
        let personajes = await Promise.all(promises);

        for (let i = 0; i < personajes.length; i++) {
            let personaje = cargarNuevaCarta();
            showPerson(personaje, personajes[i]);
        }
    } catch (error) {
        console.log(error);
        alert("Ha ocurrido un error al cargar los personajes");
    }
};

const limpiarAlmacenamiento = () => {
    localStorage.clear();
    sessionStorage.clear();
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
};


function cargarNuevaCarta() {
    let personaje = document.createElement("div");
    personaje.classList.add("personaje");

    let status = document.createElement("h3");
    status.id = "status";
    personaje.appendChild(status);

    let imageDiv = document.createElement("div");
    imageDiv.classList.add("image");
    personaje.appendChild(imageDiv);

    let image = document.createElement("img");
    image.id = "image";
    imageDiv.appendChild(image);

    let datos = document.createElement("div");
    datos.classList.add("datos");
    personaje.appendChild(datos);

    let name = document.createElement("h3");
    name.id = "name";
    datos.appendChild(name);

    let specie = document.createElement("h3");
    specie.id = "specie";
    datos.appendChild(specie);

    let origen = document.createElement("h3");
    origen.id = "origen";
    datos.appendChild(origen);

    let location = document.createElement("h3");
    location.id = "location";
    datos.appendChild(location);

    document.getElementById("personajes").appendChild(personaje);

    return personaje;
}

let showPerson = (personaje, data) => {
    let name = personaje.querySelector("#name");
    let image = personaje.querySelector("#image");
    let specie = personaje.querySelector("#specie");
    let status = personaje.querySelector("#status");
    let origen = personaje.querySelector("#origen");
    let location = personaje.querySelector("#location");

    name.innerHTML = data.name + data.id;
    image.src = data.image;
    specie.innerHTML = data.species;

    const img = document.createElement('img');
    img.src = data.gender === 'Male'
        ? 'https://cdn.icon-icons.com/icons2/510/PNG/512/man_icon-icons.com_50102.png'
        : 'https://cdn.icon-icons.com/icons2/510/PNG/512/woman_icon-icons.com_49954.png';
    img.style.width = '20px';
    img.style.height = '20px';
    img.style.position = 'relative';
    img.style.top = '4px';
    specie.appendChild(img);

    if (data.status === "Alive") {
        status.classList.add("alive");
    } else if (data.status === "Dead") {
        status.classList.add("dead");
    } else if (data.status === "unknown") {
        status.classList.add("unknown");
    }

    status.innerHTML = data.status;
    origen.innerHTML = data.origin.name;
    location.innerHTML = data.location.name;
};

function elem(allPages, page) {
    let btn = '';

    let beforePages = page - 2;
    let afterPages = page + 2;
    let liActive;

    if (page > 1) {
        btn += `<button class="btn" onclick="elem(allPages, ${page - 1})">Prev</button>`
    }

    for (let pageLength = beforePages; pageLength <= afterPages; pageLength++) {
        if (pageLength < 1 || pageLength > allPages) {
            continue;
        }
        if (page == pageLength) {
            liActive = 'active';
        } else {
            liActive = '';
        }
        btn += `<button class="btn ${liActive}" onclick="elem(allPages, ${pageLength})">${pageLength}</button>`
    }

    if (page < allPages) {
        btn += `<button class="btn" onclick="elem(allPages, ${page + 1})">Next</button>`
    }
    document.getElementById("personajes").innerHTML = "";

    id = page * 12 - 12 + 1;
    fetchMorty();

    ul.innerHTML = btn;
}


elem(allPages, 1);

limpiarAlmacenamiento();



const searchInput = document.getElementById('buscardor');

searchInput.addEventListener('keyup', () => {

    const searchTerm = searchInput.value.trim();
    console.log("." + searchTerm + ".")
    if (searchTerm.length === 0) {
        id = 1;
        document.getElementById('personajes').innerHTML = '';
        elem(allPages, 1);
    }

    fetch(`https://rickandmortyapi.com/api/character/?name=${searchTerm}`)
        .then(response => response.json())
        .then(data => {

            document.getElementById('personajes').innerHTML = '';

            data.results.forEach(personaje => {
                const nuevaCarta = cargarNuevaCarta();
                showPerson(nuevaCarta, personaje);
            });
        })
        .catch(error => console.log(error));
});