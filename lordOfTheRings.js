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

fetch("https://the-one-api.dev/v2/character?", headers)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data.docs);
        characters = data.docs;
        showCharacters(characters);
    });

fetch("https://the-one-api.dev/v2/movie", headers)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data.docs);
        fillMovies(data.docs);
    });

fetch("https://the-one-api.dev/v2/quote?limit=3000", headers)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        quotes = data.docs;
    });

function fillMovies(list) {
    list.forEach(movie => {
        movieFilter.innerHTML += `<option value="${movie._id}">${movie.name}</option>`;
    });
}

function showCharacters(list) {
    const container = document.getElementById("cards");
    container.innerHTML = "";
    list.forEach(c => {
        if (topCharacters.includes(c.name)) {
            container.innerHTML += `
      <div class="card">
        ${characterImages[c.name]
                    ? `<img src="${characterImages[c.name]}" alt="${c.name}" referrerpolicy="no-referrer">`
                    : `<div class="noimg">No picture</div>`}
        <h3>${c.name}</h3>
      </div>`;
        }
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
    showCharacters([character]);
}

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
    "Aragorn II Elessar": "Photos/Aragorn.jpg",
    "Arwen": "Photos/Arwen.jpg",
    "Azog": "Photos/Azog.jpg",
    "Balin": "Photos/Balin.jpg",
    "Balrog": "Photos/Balrog.jpg",
    "Bard": "Photos/Bard.jpg",
    "Beorn": "Photos/Beorn.jpg",
    "Bilbo Baggins": "Photos/Bilbo_Baggins.jpg",
    "Bofur": "Photos/Bofur.jpg",
    "Bolg": "Photos/Bolg.jpg",
    "Bombur": "Photos/Bombur.jpg",
    "Boromir": "Photos/Boromir.jpg",
    "Celeborn": "Photos/Celeborn.jpg",
    "Denethor II": "Photos/Denethor_II.jpg",
    "Dwalin": "Photos/Dwalin.jpg",
    "Elendil": "Photos/Elendil.jpg",
    "Elrond": "Photos/Elrond.jpg",
    "Éomer": "Photos/Éomer.jpg",
    "Éowyn": "Photos/Éowyn.jpg",
    "Faramir": "Photos/Faramir.jpg",
    "Fíli": "Photos/Fíli.jpg",
    "Frodo Baggins": "Photos/Frodo_Baggins.jpg",
    "Galadriel": "Photos/Galadriel.jpg",
    "Gamling": "Photos/Gamling.jpg",
    "Gandalf": "Photos/Gandalf.jpg",
    "Gimli": "Photos/Gimli.jpg",
    "Gollum": "Photos/Gollum.jpg",
    "Gothmog": "Photos/Gothmog.jpg",
    "Great Goblin": "Photos/Great_Goblin.jpg",
    "Gríma Wormtongue": "Photos/Gríma_Wormtongue.jpg",
    "Haldir": "Photos/Haldir.jpg",
    "Isildur": "Photos/Isildur.jpg",
    "Kíli": "Photos/Kíli.jpg",
    "Legolas": "Photos/Legolas.jpg",
    "Lurtz": "Photos/Lurtz.jpg",
    "Meriadoc Brandybuck": "Photos/Meriadoc_Brandybuck.jpg",
    "Peregrin Took": "Photos/Peregrin_Took.jpg",
    "Radagast": "Photos/Radagast.jpg",
    "Samwise Gamgee": "Photos/Samwise_Gamgee.jpg",
    "Saruman": "Photos/Saruman.jpg",
    "Sauron": "Photos/Sauron.jpg",
    "Shelob": "Photos/Shelob.jpg",
    "Smaug": "Photos/Smaug.jpg",
    "Tauriel": "Photos/Tauriel.jpg",
    "Théoden": "Photos/Théoden.jpg",
    "Théodred": "Photos/Théodred.jpg",
    "Thorin II Oakenshield": "Photos/Thorin_II_Oakenshield.jpg",
    "Thranduil": "Photos/Thranduil.jpg",
    "Treebeard": "Photos/Treebeard.jpg",
    "Witch-king of Angmar": "Photos/Witch-king_of_Angmar.jpg"
};