const token = '7fR6bW9aUM4jKerXc2sy';
const headers = {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}
let characters = [];
let quotes = [];

let searchInput = document.getElementById("searchInput");
let suggestionList = document.getElementById("suggestions");
let movieFilter = document.getElementById("movieFilter");

loadMode()
function switchMode() {
    let currentMode = localStorage.getItem("mode")
    if (currentMode == "light") {
        document.getElementById("theme").href = "lordOfTheRings_DarkTheme.css"
        localStorage.setItem("mode", "dark")
    }
    if (currentMode == "dark" || !currentMode) {
        document.getElementById("theme").href = "lordOfTheRings_LightTheme.css"
        localStorage.setItem("mode", "light")
    }
}
function loadMode() {
    let currentMode = localStorage.getItem("mode")
    if (currentMode == "dark") {
        document.getElementById("theme").href = "lordOfTheRings_DarkTheme.css"
    }
    if (currentMode == "light") {
        document.getElementById("theme").href = "lordOfTheRings_LightTheme.css"
    }
}

async function cachedFetch(key, url) {
    try {
        const cached = localStorage.getItem(key);
        if (cached) return JSON.parse(cached);
    } catch (e) { }

    const response = await fetch(url, headers);
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
    const data = await response.json();
    if (!data.docs) throw new Error("No docs in response");

    try {
        localStorage.setItem(key, JSON.stringify(data.docs));
    } catch (e) { }
    return data.docs;
}

cachedFetch("characters", "https://the-one-api.dev/v2/character?limit=1000")
    .then((docs) => {
        characters = docs;
        showCharacters(characters);
    })
    .catch((err) => console.error(err));

cachedFetch("movies", "https://the-one-api.dev/v2/movie")
    .then(fillMovies)
    .catch((err) => console.error(err));

cachedFetch("quotes", "https://the-one-api.dev/v2/quote?limit=3000")
    .then((docs) => { quotes = docs; })
    .catch((err) => console.error(err));

function fillMovies(list) {
    list.forEach(movie => {
        movieFilter.innerHTML += `<option value="${movie._id}">${movie.name}</option>`;
    });
}

function showCharacters(list, onlyTop = true) {
    const container = document.getElementById("cards");
    container.classList.remove("single");
    container.innerHTML = "";

    const shown = new Set();   // names already drawn

    list.forEach(c => {
        if (onlyTop && !topCharacters.includes(c.name)) return;
        if (shown.has(c.name)) return;   // skip duplicates like the second Gothmog
        shown.add(c.name);

        container.innerHTML += `
      <div class="card">
        <div class="card-image" data-id="${c._id}">
          ${characterImages[c.name]
                    ? `<img src="${characterImages[c.name]}" alt="${c.name}" referrerpolicy="no-referrer">`
                    : `<div class="noimg">No picture</div>`}
        </div>
        <h3>${c.name}</h3>
      </div>`;
    });
}

function isInMovie(characterId, movieId) {
    for (let i = 0; i < quotes.length; i++) {
        if (quotes[i].character === characterId && quotes[i].movie === movieId) {
            return true;
        }
    }
    return false;
}

function showSuggestions() {
    let text = searchInput.value.toLowerCase();
    let movie = movieFilter.value;

    suggestionList.innerHTML = "";

    if (text === "") {
        suggestionList.style.display = "none";
        return;
    }

    let matches = [];

    characters.forEach(c => {
        let nameMatches = c.name.toLowerCase().includes(text);

        if (nameMatches) {
            if (movie === "all") {
                matches.push(c);
            } else if (isInMovie(c._id, movie)) {
                matches.push(c);
            }
        }
    });

    matches.slice(0, 8).forEach(c => {
        let li = document.createElement("li");
        li.textContent = c.name;
        li.addEventListener("click", () => chooseCharacter(c));
        suggestionList.appendChild(li);
    });

    if (matches.length > 0) {
        suggestionList.style.display = "block";
    } else {
        suggestionList.style.display = "none";
    }
}

function chooseCharacter(character) {
    searchInput.value = character.name;
    suggestionList.style.display = "none";
    showCharacterDetail(character);
}
function getAnyRandomQuote(characterId) {
    const list = quotes.filter(q => q.character === characterId);
    if (list.length === 0) return null;
    return list[Math.floor(Math.random() * list.length)];
}

function showCharacterDetail(c) {
    const container = document.getElementById("cards");
    container.classList.add("single");

    const path = characterImages[c.name];
    const quote = getAnyRandomQuote(c._id);

    // optional facts from the API, skipping empty ones
    const facts = [["Race", c.race], ["Realm", c.realm], ["Birth", c.birth], ["Death", c.death]]
        .filter(([, value]) => value && value !== "NaN")
        .map(([label, value]) => `<li><strong>${label}:</strong> ${value}</li>`)
        .join("");

    container.innerHTML = `
      <div class="card detail">
        <a class="back-button" href="lotr_page_2.html">← Back to all characters</a>
        <div class="detail-image">
          ${path
            ? `<img src="${path}" alt="${c.name}" referrerpolicy="no-referrer">`
            : `<div class="noimg">No picture</div>`}
        </div>
        <h2>${c.name}</h2>
        ${quote ? `<blockquote>“${quote.dialog}”</blockquote>` : ""}
        ${facts ? `<ul class="facts">${facts}</ul>` : ""}
      </div>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// one listener for all the images (the cards are created with innerHTML)
document.getElementById("cards").addEventListener("click", (event) => {
    const box = event.target.closest(".card-image");
    if (!box) return;

    const character = characters.find(c => c._id === box.dataset.id);
    if (character) showCharacterDetail(character);
});

searchInput.addEventListener("input", showSuggestions);
movieFilter.addEventListener("change", showSuggestions);

document.addEventListener("click", (event) => {
    if (event.target !== searchInput) {
        suggestionList.style.display = "none";
    }
});

console.log("quotes", quotes);
function getRandomQuote(characterId, movieId) {
    let filteredQuotes = quotes.filter(q => q.character === characterId && q.movie === movieId);

    if (filteredQuotes.length > 0) {
        return filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    }
    return null;
}

const topCharacters = [
    "Aragorn II Elessar",
    "Arwen",
    "Azog",
    "Balin",
    "Balrog",
    "Bard",
    "Beorn",
    "Bilbo Baggins",
    "Bofur",
    "Bolg",
    "Bombur",
    "Boromir",
    "Celeborn",
    "Denethor II",
    "Dwalin",
    "Elendil",
    "Elrond",
    "Éomer",
    "Éowyn",
    "Faramir",
    "Fíli",
    "Frodo Baggins",
    "Galadriel",
    "Gamling",
    "Gandalf",
    "Gimli",
    "Gollum",
    "Gothmog",
    "Great Goblin",
    "Gríma Wormtongue",
    "Haldir",
    "Isildur",
    "Kíli",
    "Legolas",
    "Lurtz",
    "Meriadoc Brandybuck",
    "Peregrin Took",
    "Radagast",
    "Samwise Gamgee",
    "Saruman",
    "Sauron",
    "Shelob",
    "Smaug",
    "Tauriel",
    "Théoden",
    "Théodred",
    "Thorin II Oakenshield",
    "Thranduil",
    "Treebeard",
    "Witch-king of Angmar"
];

const characterImages = {
    "Aragorn II Elessar": "Photos/Aragorn.avif",
    "Arwen": "Photos/Arwen.jpg",
    "Azog": "Photos/Azog.webp",
    "Balin": "Photos/Balin.jpg",
    "Balrog": "Photos/Balrog.webp",
    "Bard": "Photos/Bard.webp",
    "Beorn": "Photos/Beorn.webp",
    "Bilbo Baggins": "Photos/Bilbo-Baggins.jpg",
    "Bofur": "Photos/Bofur.jpg",
    "Bolg": "Photos/Bolg.webp",
    "Bombur": "Photos/Bombur.webp",
    "Boromir": "Photos/Boromir.webp",
    "Celeborn": "Photos/Celeborn.webp",
    "Denethor II": "Photos/Denethor-II.JPG",
    "Dwalin": "Photos/Dwalin.jpg",
    "Elendil": "Photos/Elendil.avif",
    "Elrond": "Photos/Elrond.jpg",
    "Éomer": "Photos/Éomer.jpg",
    "Éowyn": "Photos/Éowyn.jpg",
    "Faramir": "Photos/Faramir.jpg",
    "Fíli": "Photos/Fíli.jpg",
    "Frodo Baggins": "Photos/Frodo-Baggins.jpg",
    "Galadriel": "Photos/Galadriel.webp",
    "Gamling": "Photos/Gamling.jpg",
    "Gandalf": "Photos/Gandalf.webp",
    "Gimli": "Photos/Gimli.webp",
    "Gollum": "Photos/Gollum.jpg",
    "Gothmog": "Photos/Gothmog.webp",
    "Great Goblin": "Photos/Great-Goblin.webp",
    "Gríma Wormtongue": "Photos/Gríma-Wormtongue.jpg",
    "Haldir": "Photos/Haldir.jpg",
    "Isildur": "Photos/Isildur.avif",
    "Kíli": "Photos/Kíli.jpg",
    "Legolas": "Photos/Legolas.webp",
    "Lurtz": "Photos/Lurtz.jpg",
    "Meriadoc Brandybuck": "Photos/Meriadoc-Brandybuck.webp",
    "Peregrin Took": "Photos/Peregrin-Took.jpg",
    "Radagast": "Photos/Radagast.webp",
    "Samwise Gamgee": "Photos/Samwise-Gamgee.jpg",
    "Saruman": "Photos/Saruman.webp",
    "Sauron": "Photos/Sauron.webp",
    "Shelob": "Photos/Shelob.jpg",
    "Smaug": "Photos/Smaug.webp",
    "Tauriel": "Photos/Tauriel.jpg",
    "Théoden": "Photos/Théoden.webp",
    "Théodred": "Photos/Théodred.webp",
    "Thorin II Oakenshield": "Photos/Thorin-II-Oakenshield.webp",
    "Thranduil": "Photos/Thranduil.webp",
    "Treebeard": "Photos/Treebeard.webp",
    "Witch-king of Angmar": "Photos/Witch-king-of-Angmar.webp"
};

