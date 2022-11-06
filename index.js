const search = document.getElementById("guess");
const searchMatches = document.getElementById("matches");
const clearSearch = document.getElementById("clearGuess");
const submitGuess = document.getElementById("submitGuess");
const guesses = document.getElementById("guesses");

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
    const res = await fetch("../assets/json/characters.json");
    const characters = await res.json();

    // Get matches to current text input
    let matches = characters.filter(character => {
        const regex = new RegExp(`${searchText}`, "gi");
        return character.name.match(regex);
    });
    console.log(matches);

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

// listener to detect guess submission on SUBMIT button click
submitGuess.addEventListener("click", async () => {
    const res = await fetch("../assets/json/characters.json");
    const characters = await res.json();
    const guess = search.value;
    let matches = characters.filter(character => {
        const regex = new RegExp(guess, "gi");
        return character.name.match(regex);
    });
    search.value = "";
    searchMatches.innerHTML = "";
    console.log(guess);
    console.log(matches);
    if (guess === "" || matches.length === 0) {
        document.getElementById("error").style.display = "block";
    }
    else {
        document.getElementById("error").style.display = "none";
        if (guesses.innerHTML === "") {
            guesses.innerHTML += `
                <div class="guessBox">
                    <div class="guessBoxLabel"><h3><strong>Image</strong></h3></div>
                    <div class="guessBoxLabel"><h3><strong>Name</strong></h3></div>
                    <div class="guessBoxLabel"><h3><strong>Race</strong></h3></div>
                    <div class="guessBoxLabel"><h3><strong>Affiliation</strong></h3></div>
                    <div class="guessBoxLabel"><h3><strong>Status</strong></h3></div>
                    <div class="guessBoxLabel"><h3><strong>Height</strong></h3></div>
                    <div class="guessBoxLabel"><h3><strong>Weight</strong></h3></div>
                </div>
            `;
        }
        await guessFunc(matches[0]);
    }
})

// listener to detect guess submission on ENTER KEY press
document.addEventListener('keypress', async function (e) {
    if (e.key === 'Enter' && search.value !== "") {
        const res = await fetch("../assets/json/characters.json");
        const characters = await res.json();
        const guess = search.value;
        let matches = characters.filter(character => {
            const regex = new RegExp(guess, "gi");
            return character.name.match(regex);
        });
        search.value = "";
        searchMatches.innerHTML = "";
        console.log(guess);
        console.log(matches);
        if (guess === "" || matches.length === 0) {
            document.getElementById("error").style.display = "block";
        }
        else {
            document.getElementById("error").style.display = "none";
            if (guesses.innerHTML === "") {
                guesses.innerHTML += `
                <div class="guessBox">
                    <div class="guessBoxLabel"><h3><strong>Image</strong></h3></div>
                    <div class="guessBoxLabel"><h3><strong>Name</strong></h3></div>
                    <div class="guessBoxLabel"><h3><strong>Race</strong></h3></div>
                    <div class="guessBoxLabel"><h3><strong>Affiliation</strong></h3></div>
                    <div class="guessBoxLabel"><h3><strong>Status</strong></h3></div>
                    <div class="guessBoxLabel"><h3><strong>Height</strong></h3></div>
                    <div class="guessBoxLabel"><h3><strong>Weight</strong></h3></div>
                </div>
            `;
            }
            await guessFunc(matches[0]);
        }
    }
});

// on click guess function
guessFunc = async (guess) => {
    // parse today.json for data of the correct answer
    const ans = await fetch("../assets/json/today.json");
    const answer = await ans.json();
    console.log(answer)
    console.log(guess)
    // if guess is correct
    if (guess.name === answer.name) {
        const imageURL = "assets/images/" + answer.image + ".jpg"
        // output the correct guess div w/ correct answer texts
        const html = `
        <div class="guessBox" data-default="">
            <div class="guessImage" style="background-image: url('${imageURL}')"></div>
            <div class="guessText"><h3><strong>${answer.name}</strong></h3></div>
            <div class="guessText"><strong><h3 style="color: #32cd32">${answer.race}</h3></strong></div>
            <div class="guessText"><strong><h3 style="color: #32cd32">${answer.affiliation}</h3></strong></div>
            <div class="guessText"><strong><h3 style="color: #32cd32">${answer.status}</h3></strong></div>
            <div class="guessText"><strong><h3 style="color: #32cd32">${answer.height}</h3></strong></div>
            <div class="guessText"><strong><h3 style="color: #32cd32">${answer.weight}</h3></strong></div>
        </div>
        `;
        guesses.innerHTML += html;
        // hide all buttons and inputs

        // display NICE JOB! text

        // change counter
        const counter = parseInt(document.getElementById("guessCounter").textContent)
        document.getElementById("guessCounter").innerHTML = (counter - 1).toString();
    }
    // if guess is incorrect
    else {
        const imageURL = "assets/images/" + guess.image + ".jpg"
        const html = `
        <div class="guessBox" data-default="">
            <div class="guessImage" style="background-image: url('${imageURL}')"></div>
            <div class="guessText"><h3><strong>${guess.name}</strong></h3></div>
            <div class="guessText"><strong><h3 style="color: ${guess.race === answer.race ? "#32cd32" : "#cc3300"}">${guess.race}</h3></strong></div>
            <div class="guessText"><strong><h3 style="color: ${guess.affiliation === answer.affiliation ? "#32cd32" : "#cc3300"}">${guess.affiliation}</h3></strong></div>
            <div class="guessText"><strong><h3 style="color: ${guess.status === answer.status ? "#32cd32" : "#cc3300"}">${guess.status}</h3></strong></div>
            <div class="guessText"><strong><h3 style="color: ${guess.height === answer.height ? "#32cd32" : "#cc3300"}">${guess.height}</h3></strong></div>
            <div class="guessText"><strong><h3 style="color: ${guess.weight === answer.weight ? "#32cd32" : "#cc3300"}">${guess.weight}</h3></strong></div>
        </div>
        `;
        guesses.innerHTML += html;
        // change counter
        const counter = parseInt(document.getElementById("guessCounter").textContent)
        document.getElementById("guessCounter").innerHTML = (counter - 1).toString();
        // if counter === 0

            // hide all inputs and other buttons

            // display NICE TRY! text

    }
}