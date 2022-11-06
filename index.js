const search = document.getElementById("guess");
const searchMatches = document.getElementById("matches");
const clearSearch = document.getElementById("clearGuess");

// hide/show about section
function toggleAbout() {
    switch (document.getElementById("aboutText").style.display) {
        case "none":
            document.getElementById("aboutText").style.display = "block";
            document.getElementById("aboutToggle").innerText = "CLOSE";
            document.getElementById("aboutToggle").style.color = "#ff531a";
            document.getElementById("aboutTextHeader").style.display = "block";
            document.getElementById("closeAbout").style.display = "block";
            break;
        case "block":
            document.getElementById("aboutText").style.display = "none";
            document.getElementById("aboutToggle").innerText = "ABOUT";
            document.getElementById("aboutToggle").style.color = "#DFD4C7";
            document.getElementById("aboutTextHeader").style.display = "none";
            document.getElementById("closeAbout").style.display = "none";
            break;
    }
}

// search characters.json and filter
const searchCharacters = async (searchText) => {
    const res = await fetch("../assets/characters.json");
    const characters = await res.json();

    // Get matches to current text input
    let matches = characters.filter(character => {
        const regex = new RegExp(`${searchText}`, "gi");
        return character.name.match(regex);
    });

    if (searchText.length === 0) {
        matches = [];
        searchMatches.innerHTML = "";
    }
    outputHTML(matches);
};

// take matches array, split it and add code to html variable, then add variable to matches
const outputHTML = matches => {
    if (matches.length > 0) {
        const html = matches.map(match => `
            <div class="guessAutofill" onclick="fillInput('${match.name}')">
                <h4 style="font-family: BleachTYBW; padding: 15px 10px 10px 10px; margin: 0px 0px 0px 0px; color: #0f0f0f">
                    ${match.name}
                </h4>
            </div>
        `).join("");
        searchMatches.innerHTML = html;
        searchMatches.style.display = "block";
    }
}

// fills input on click
function fillInput(name) {
    document.getElementById("guess").value = name.toString();
}

// listener to change dropdown on input change
search.addEventListener("input", () => searchCharacters(search.value));

// listener to clear search on click
clearSearch.addEventListener("click", () => {
    search.value = "";
    searchMatches.innerHTML = "";
});

// close/open dropdown listener
document.onclick = function(e){
    if (e.target.id === "guess" || e.target.id === "matches") {
        document.getElementById("matches").style.display = "block";
    }
    else if (e.target.id !== "guess" || e.target.id !== "matches") {
        //element clicked wasn't the div; hide the div
        document.getElementById("matches").style.display = "none";
    }
}

// on click guess function
guess = () => {
    const guess = search.value;
    search.value = "";
    searchMatches.innerHTML = "";
    // parse through characters.json for guess, and return if found

        // if guess is a valid answer

            // take guess value and place it into a dictionary

            // compare today.json (today's answer) to dictionary answers

                // if correct, display correct

                // if not, compare what is and isn't correct, and output it

        // if guess is an invalid answer

            // display hidden h4 that says invalid guess

}