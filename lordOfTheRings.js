const token = '7fR6bW9aUM4jKerXc2sy';
const headers = {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}
let characters = [];
let quotes = [];

// The HTML elements we need
let searchInput = document.getElementById("searchInput");
let suggestionList = document.getElementById("suggestions");
let movieFilter = document.getElementById("movieFilter");

fetch("https://the-one-api.dev/v2/character?limit=100", headers)
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
        container.innerHTML += `
      <div class="card">
        ${c.image
          ? `<img src="${c.image}" alt="${c.name}" referrerpolicy="no-referrer">`
          : `<div class="noimg">No picture</div>`}
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
    showCharacters([character]);
}

searchInput.addEventListener("input", showSuggestions);
movieFilter.addEventListener("change", showSuggestions);

document.addEventListener("click", (event) => {
    if (event.target !== searchInput) {
        suggestionList.style.display = "none";
    }
});


