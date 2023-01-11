const search = document.getElementById("guess");
const searchMatches = document.getElementById("matches");
const clearSearch = document.getElementById("clearGuess");
const submitGuess = document.getElementById("submitGuess");
const guesses = document.getElementById("guesses");
const congratulations = document.getElementById("congratulations");
const sorry = document.getElementById("sorry");
const incorrectanswer = document.getElementById("IncorrectAnswer");
const getToday = async () => {
    // parse today.json for data of the correct answer
    const ans = await fetch("../assets/json/today.json");
    const answer = await ans.json();
    return answer;
}
const answer = getToday();
let userGuesses = [];

// hide/show about section
function toggleAbout() {
    switch (document.getElementById("aboutText").style.display) {
        case "none":
            document.getElementById("aboutText").style.display = "block";
            document.getElementById("aboutToggle").innerText = "CLOSE";
            document.getElementById("aboutToggle").style.color = "#ff531a";
            document.getElementById("aboutTextHeader").style.display = "block";
            break;
        case "block":
            document.getElementById("aboutText").style.display = "none";
            document.getElementById("aboutToggle").innerText = "ABOUT";
            document.getElementById("aboutToggle").style.color = "#DFD4C7";
            document.getElementById("aboutTextHeader").style.display = "none";
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
    // console.log(matches);

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
                <h4 style="font-family: BleachTYBW; padding: 15px 10px 10px 10px; margin: 0 0 0 0; color: #0f0f0f">
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
    if (guess === "" || matches.length === 0) {
        document.getElementById("error").style.display = "inline-block";
    }
    else if (userGuesses.includes(matches[0].name)) {
        document.getElementById("guessAlreadyUsed").style.display = "block";
    }
    else {
        document.getElementById("error").style.display = "none";
        document.getElementById("guessAlreadyUsed").style.display = "none";
        if (guesses.innerHTML === "") {
            guesses.innerHTML += `
                <div class="guessBox" style="border-bottom: 1px solid; margin-bottom: 10px;">
                    <div class="guessBoxLabel"><strong><h3 class="shrinkMobile" style="font-family: BleachTYBW">IMAGE</h3></strong></div>
                    <div class="guessBoxLabel"><strong><h3 class="shrinkMobile" style="font-family: BleachTYBW">NAME</h3></strong></div>
                    <div class="guessBoxLabel"><strong><h3 class="shrinkMobile" style="font-family: BleachTYBW">RACE</h3></strong></div>
                    <div class="guessBoxLabel"><strong><h3 class="shrinkMobile" style="font-family: BleachTYBW">LEAGUE</h3></strong></div>
                    <div class="guessBoxLabel"><strong><h3 class="shrinkMobile" style="font-family: BleachTYBW">STATUS</h3></strong></div>
                    <div class="guessBoxLabel"><strong><h3 class="shrinkMobile" style="font-family: BleachTYBW">HEIGHT</h3></strong></div>
                    <div class="guessBoxLabel"><strong><h3 class="shrinkMobile" style="font-family: BleachTYBW">WEIGHT</h3></strong></div>
                </div>
            `;
        }
        await guessFunc(matches[0]);
    }
})

// listener to detect guess submission on ENTER KEY press
document.addEventListener("keypress", async function (e) {
    if (e.key === "Enter" && search.value !== "") {
        const res = await fetch("../assets/json/characters.json");
        const characters = await res.json();
        const guess = search.value;
        let matches = characters.filter(character => {
            const regex = new RegExp(guess, "gi");
            return character.name.match(regex);
        });
        search.value = "";
        searchMatches.innerHTML = "";
        // console.log(guess);
        // console.log(matches);
        if (guess === "" || matches.length === 0) {
            document.getElementById("error").style.display = "inline-block";
        }
        else if (userGuesses.includes(matches[0].name)) {
            document.getElementById("guessAlreadyUsed").style.display = "block";
        }
        else {
            document.getElementById("error").style.display = "none";
            document.getElementById("guessAlreadyUsed").style.display = "none";
            if (guesses.innerHTML === "") {
                guesses.innerHTML += `
                <div class="guessBox" style="border-bottom: 1px solid; margin-bottom: 10px;">
                    <div class="guessBoxLabel"><strong><h3 class="shrinkMobile" style="font-family: BleachTYBW">IMAGE</h3></strong></div>
                    <div class="guessBoxLabel"><strong><h3 class="shrinkMobile" style="font-family: BleachTYBW">NAME</h3></strong></div>
                    <div class="guessBoxLabel"><strong><h3 class="shrinkMobile" style="font-family: BleachTYBW">RACE</h3></strong></div>
                    <div class="guessBoxLabel"><strong><h3 class="shrinkMobile" style="font-family: BleachTYBW">LEAGUE</h3></strong></div>
                    <div class="guessBoxLabel"><strong><h3 class="shrinkMobile" style="font-family: BleachTYBW">STATUS</h3></strong></div>
                    <div class="guessBoxLabel"><strong><h3 class="shrinkMobile" style="font-family: BleachTYBW">HEIGHT</h3></strong></div>
                    <div class="guessBoxLabel"><strong><h3 class="shrinkMobile" style="font-family: BleachTYBW">WEIGHT</h3></strong></div>
                </div>
            `;
            }
            await guessFunc(matches[0]);
        }
    }
});

// guess function
guessFunc = async (guess) => {
    // adds name of guess to list of already guessed names
    userGuesses.push(guess.name);
    // if guess is correct
    if (guess.name === answer.name) {
        const imageURL = "assets/images/" + answer.image + ".jpg"
        // output the correct guess div w/ correct answer texts
        const html = `
        <div class="guessBox" data-default="">
            <div class="guessImage" style="background-image: url('${imageURL}')"></div>
            <div class="guessText"><strong><h4 class="shrinkMobile" style="font-family: BleachTYBW;">${answer.name}</h4></strong></div>
            <div class="guessText"><strong><h4 class="shrinkMobile" style="font-family: BleachTYBW; color: #32cd32">${answer.race}</h4></strong></div>
            <div class="guessText"><strong><h4 class="shrinkMobile" style="font-family: BleachTYBW; color: #32cd32">${answer.affiliation}</h4></strong></div>
            <div class="guessText"><strong><h4 class="shrinkMobile" style="font-family: BleachTYBW; color: #32cd32">${answer.status}</h4></strong></div>
            <div class="guessText"><strong><h4 class="shrinkMobile" style="font-family: BleachTYBW; color: #32cd32">${answer.height === 0 ? "N/A" : answer.height + " cm"}</h4></strong></div>
            <div class="guessText"><strong><h4 class="shrinkMobile" style="font-family: BleachTYBW; color: #32cd32">${answer.weight === 0 ? "N/A" : answer.weight + " kg"}</h4></strong></div>
        </div>
        `;
        guesses.innerHTML += html;
        // change counter
        const counter = parseInt(document.getElementById("guessCounter").textContent)-1
        document.getElementById("guessCounter").innerHTML = counter.toString();
        // hide all buttons and inputs
        document.getElementById("guesslabel").style.display = "none";
        document.getElementById("inputfield").style.display = "none";
        // display NICE JOB! text
        guesses.style.marginTop = "-10px";
        congratulations.style.display = "block";
        const attemptNo = () => {
            const i = (10-counter) % 10,
                n = (10-counter) % 100;
            if (i == 1 && n != 11) {
                return (10-counter) + "st";
            }
            if (i == 2 && n != 12) {
                return (10-counter) + "nd";
            }
            if (i == 3 && n != 13) {
                return (10-counter) + "rd";
            }
            return (10-counter) + "th";
        };
        incorrectanswer.style.display = "none";
        congratulations.innerHTML += `
            <strong><h1 style="text-decoration: underline; color: #00ff7f">CONGRATULATIONS</h1></strong>
            <strong><h3 style="margin-top: -10px;">You guessed <span style="color: #00ff7f">${guess.name}</span> correctly on your <span style="color: #cc3300">${attemptNo()}</span> try!</h3></strong>
        `;
        if (counter === 1) {
            document.getElementById("1guess").innerHTML = "guess";
        }
        else if (counter === 0) {
            document.getElementById("1guess").innerHTML = "guesses";
        }
    }
    // if guess is incorrect
    else {
        const imageURL = "assets/images/" + guess.image + ".jpg"
        const lowHighWeight = () => {
            if (answer.weight === 0) {
                return "❌";
            }
            else {
                if (parseInt(guess.weight) < parseInt(answer.weight)) {
                    return "🔺";
                }
                else if (guess.weight === answer.weight) {
                    return "";
                }
                else {
                    return "🔻";
                }
            }
        }
        const lowHighHeight = () => {
            if (answer.height === 0) {
                return "❌";
            }
            else {
                if (guess.height < answer.height) {
                    return "🔺";
                }
                else if (guess.height === answer.height) {
                    return "";
                }
                else {
                    return "🔻";
                }
            }
        }
        const html = `
        <div class="guessBox" data-default="">
            <div class="guessImage" style="background-image: url('${imageURL}')"></div>
            <div class="guessText"><strong><h4 class="shrinkMobile" style="font-family: BleachTYBW; color: #ff4000;">${guess.name}</h4></strong></div>
            <div class="guessText"><strong><h4 class="shrinkMobile" style="font-family: BleachTYBW; color: ${guess.race === answer.race ? "#32cd32" : "#cc3300"}">${guess.race}</h4></strong></div>
            <div class="guessText"><strong><h4 class="shrinkMobile" style="font-family: BleachTYBW; color: ${guess.affiliation === answer.affiliation ? "#32cd32" : "#cc3300"}">${guess.affiliation}</h4></strong></div>
            <div class="guessText"><strong><h4 class="shrinkMobile" style="font-family: BleachTYBW; color: ${guess.status === answer.status ? "#32cd32" : "#cc3300"}">${guess.status}</h4></strong></div>
            <div class="guessText"><strong><h4 class="shrinkMobile" style="font-family: BleachTYBW; color: ${guess.height === answer.height ? "#32cd32" : "#cc3300"}">${guess.height === 0 ? (guess.height === answer.height) ? "N/A" : "N/A ❌" : guess.height + " cm"} ${guess.height !== 0 ? lowHighHeight() : ""}</h4></strong></div>
            <div class="guessText"><strong><h4 class="shrinkMobile" style="font-family: BleachTYBW; color: ${guess.weight === answer.weight ? "#32cd32" : "#cc3300"}">${guess.weight === 0 ? (guess.weight === answer.weight) ? "N/A" : "N/A ❌" : guess.weight + " kg"} ${guess.weight !== 0 ? lowHighWeight() : ""}</h3></strong></div>
        </div>
        `;
        guesses.innerHTML += html;
        // change counter
        const counter = parseInt(document.getElementById("guessCounter").textContent) - 1;
        document.getElementById("guessCounter").innerHTML = counter.toString();
        // if counter === 0
        if (counter === 0 || counter <= 0) {
            // hide all inputs and other buttons
            document.getElementById("guesslabel").style.display = "none";
            document.getElementById("inputfield").style.display = "none";
            guesses.style.marginTop = "-10px";
            sorry.style.display = "block";
            // display NICE TRY! text
            sorry.innerHTML += `
                <strong><h1 style="text-decoration: underline; color: #cc3300">GAME OVER</h1></strong>
                <strong><h3 style="margin-top: -10px;">The correct answer was <span style="color: #00ff7f">${answer.name}</span>! Come back tomorrow at 9AM EST to try again!</h3></strong>
            `;
            // adds you missed: answer text
            const imageURL = "assets/images/" + answer.image + ".jpg";
            const html = `
                <strong><h1 style="font-family: BleachTYBW; text-decoration: underline; color: #cc3300; margin-top: 0;">YOU MISSED</h1></strong>
                <div class="guessBox" data-default="">
                    <div class="guessImage" style="background-image: url('${imageURL}')"></div>
                    <div class="guessText"><strong><h4 class="shrinkMobile" style="font-family: BleachTYBW;">${answer.name}</h4></strong></div>
                    <div class="guessText"><strong><h4 class="shrinkMobile" style="font-family: BleachTYBW; color: #32cd32">${answer.race}</h4></strong></div>
                    <div class="guessText"><strong><h4 class="shrinkMobile" style="font-family: BleachTYBW; color: #32cd32">${answer.affiliation}</h4></strong></div>
                    <div class="guessText"><strong><h4 class="shrinkMobile" style="font-family: BleachTYBW; color: #32cd32">${answer.status}</h4></strong></div>
                    <div class="guessText"><strong><h4 class="shrinkMobile" style="font-family: BleachTYBW; color: #32cd32">${answer.height === 0 ? "N/A" : answer.height + " cm"}</h4></strong></div>
                    <div class="guessText"><strong><h4 class="shrinkMobile" style="font-family: BleachTYBW; color: #32cd32">${answer.weight === 0 ? "N/A" : answer.weight + " kg"}</h4></strong></div>
                </div>
                `;
            guesses.innerHTML += html;
            document.getElementById("error").style.display = "none";
            document.getElementById("guessAlreadyUsed").style.display = "none";
            incorrectanswer.style.display = "none";
            document.getElementById("1guess").innerHTML = "guesses";
        }
        else if (counter === 1) {
            document.getElementById("1guess").innerHTML = "guess";
            incorrectanswer.style.display = "block";
        }
        else {
            incorrectanswer.style.display = "block";
        }
    }
}
