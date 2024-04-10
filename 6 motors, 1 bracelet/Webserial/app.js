console.log("hi");
'use strict';

let port;
let reader;
let inputDone;
let outputDone;
let inputStream;
let outputStream;

let mode = "learn"


const alphabet =  {
      "a": [1, 0, 0, 0, 0, 0],
      "b": [1, 0, 1, 0, 0, 0],
      "c": [1, 1, 0, 0, 0, 0],
      "d": [1, 1, 0, 1, 0, 0],
      "e": [1, 0, 0, 1, 0, 0],
      "f": [1, 1, 1, 0, 0, 0],
      "g": [1, 1, 1, 1, 0, 0],
      "h": [1, 0, 1, 1, 0, 0],
      "i": [0, 1, 1, 0, 0, 0],
      "j": [0, 1, 1, 1, 0, 0],
      "k": [1, 0, 0, 0, 1, 0],
      "l": [1, 0, 1, 0, 1, 0],
      "m": [1, 1, 0, 0, 1, 0],
      "n": [1, 1, 0, 1, 1, 0],
      "o": [1, 0, 0, 1, 1, 0],
      "p": [1, 1, 1, 0, 1, 0],
      "q": [1, 1, 1, 1, 1, 0],
      "r": [1, 0, 1, 1, 1, 0],
      "s": [0, 1, 1, 0, 1, 0],
      "t": [0, 1, 1, 1, 1, 0],
      "u": [1, 0, 0, 0, 1, 1],
      "v": [1, 0, 1, 0, 1, 1],
      "w": [0, 1, 1, 1, 0, 1],
      "x": [1, 1, 0, 0, 1, 1],
      "y": [1, 1, 0, 1, 1, 1],
      "z": [1, 0, 0, 1, 1, 1],
      "motor1": [1, 0, 0, 0, 0, 0],
      "motor2": [0, 1, 0, 0, 0, 0],
      "motor3": [0, 0, 1, 0, 0, 0],
      "motor4": [0, 0, 0, 1, 0, 0],
      "motor5": [0, 0, 0, 0, 1, 0],
      "motor6": [0, 0, 0, 0, 0, 1]
    }


const currentSymbol = document.getElementById("current-symbol");

let quizModel = {
    "question": 1,
    "score": 0,
    "allQuizSymbols": ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    "includeSymbols": ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    "answer": 'a',
    "options": ['a', 'b', 'c', 'd'],  
    "history":[],
    "optionsPerGuess": 4,
    "guessButtons": document.getElementsByClassName("guess-button"),
    "correctGuesses": [],
    "incorrectGuesses": []
}

const quizToggleButtonsContainer = document.getElementById("quiz-select-symbols-container");

for(let i = 0; i < quizModel.allQuizSymbols.length; i++){
    const btn = document.createElement("button");
    const symbol = quizModel.allQuizSymbols[i];
    if (quizModel.includeSymbols.includes(symbol)){
        btn.classList.add("include")
    }
    btn.textContent = symbol
    btn.onclick = function(e){

        let clickSymbol = e.target.textContent;
        console.log("CLICK", clickSymbol, quizModel.includeSymbols);
        let newIncludeSymbols = [];
        if (quizModel.includeSymbols.includes(clickSymbol)){
            if(quizModel.includeSymbols.length <= quizModel.optionsPerGuess){
                window.alert(`Please keep at least ${quizModel.optionsPerGuess} letters enabled`);
                return;
            }
            console.log("REMOVE");
            e.target.classList.remove("include");
            newIncludeSymbols = quizModel.includeSymbols.filter(s => s!=clickSymbol);
        }
        else{
            console.log("ADD");
            e.target.classList.add("include");
            newIncludeSymbols = JSON.parse(JSON.stringify(quizModel.includeSymbols));
            newIncludeSymbols.push(clickSymbol);

        }
        quizModel.includeSymbols = newIncludeSymbols;
    }
    quizToggleButtonsContainer.appendChild(btn)
}

updateQuizGui(quizModel, alphabet)

document.addEventListener("DOMContentLoaded", async function(){
    console.log('serial' in navigator); 
    if(! ('serial' in navigator)){
        window.alert("browser not compatible; try a recent verison of chrome, edge, or opera...");
    }
})

document.addEventListener('keydown', function(event){
    let key = event.key;
    handleCharacterSend(key);
})


async function handleMotorPress(motorid){
    //send the character to the arduino if it's connected
    if(port!=null) writeToStream([motorid]);

    for(let i = 1; i<=6; i++){
        document.getElementById("motor" + (i).toString()).classList.remove("active")
    }
    document.getElementById("motor" + (motorid).toString()).classList.add("active")
}

//sends a given character to serial and updates visual indicator of which motors are activated
async function handleCharacterSend(char){
    //send the character to the arduino if it's connected
    if(port!=null) writeToStream([char]);

    if(["learn"].includes(mode)){
        //demonstrate which buttons need highlighting
        let motorConfig = alphabet[char] || [];
        console.log("key, config:", char, motorConfig)
        for(let i = 0; i<motorConfig.length; i++){
            if(motorConfig[i] == 1){
                document.getElementById("motor" + (i+1).toString()).classList.add("active")
            }
            else{
                document.getElementById("motor" + (i+1).toString()).classList.remove("active")
            }
        }

        //update current symbol indicator

        if(char >= '1' && char <= '6'){
            currentSymbol.textContent = "motor "+ char;
        }
        else if (char >= 'a' && char <= 'z'){
            currentSymbol.textContent = char;
        }
        else{
            currentSymbol.textContent = char + " (not in alphabet)"
        }
    }

}

async function connect(){
    // - Request a port and open a connection.
    port = await navigator.serial.requestPort();
    // - Wait for the port to open.
    await port.open({ baudRate: 9600 });

    const encoder = new TextEncoderStream();
    outputDone = encoder.readable.pipeTo(port.writable);
    outputStream = encoder.writable;

    writeToStream('c', 'echo(false);');
}

async function clickConnect(){
    await connect();
}

function writeToStream(...lines){
    const writer = outputStream.getWriter();
    lines.forEach((line) => {
        console.log('[SEND]', line);
        writer.write(line + '\n');
    });
writer.releaseLock();
}

//selects next answer and options for the quiz
function handleQuizNextSymbolPress(){
    mode = "quiz";

    //ensure player has made a guess before moving onto next stage
    if(quizModel.correctGuesses == 0){
        window.alert("please make a correct guess before moving onto the next Symbol");
        return;
    }

    //if they have already made a guess then save round to history, choose new quiz options, and update GUI

    quizModel.history.push({question: quizModel.question, answer: quizModel.answer, correctFirstTry: quizModel.incorrectGuesses.length == 0, incorrectGuesses: quizModel.incorrectGuesses, options: quizModel.options});
    quizModel.correctGuesses = [];
    quizModel.incorrectGuesses = [];
    const nextOptions = [];
    //keep adding options randomly from the pool of allowed symbols (pick without replacement)
    while(nextOptions.length < quizModel.optionsPerGuess){
        filteredAllowedSymbols = quizModel.includeSymbols.filter(s => !(nextOptions.includes(s)));
        let randomNumber = Math.round(Math.random()* (filteredAllowedSymbols.length - 1));
        console.log(randomNumber);
        nextOptions.push(filteredAllowedSymbols[randomNumber]);
    }
    quizModel.options = nextOptions.sort();
    //set new answer randomly
    quizModel.answer = nextOptions[Math.round(Math.random()*(quizModel.optionsPerGuess - 1))]
    quizModel.question += 1;
    console.log(nextOptions.sort())
    updateQuizGui(quizModel, alphabet);
}

function handleQuizPlaySymbolPress(){
    mode = "quiz";
    handleCharacterSend(quizModel.answer);
}

function makeGuess(guess){
    console.log("guess was made: ", guess)

    if(quizModel.correctGuesses.length == 0){
        if(guess == quizModel.answer){
            quizModel.correctGuesses.push(quizModel.answer)
            console.log("CORRECT");
            let beat = new Audio('/sounds/correct-correct.mp3');
            beat.play();
            let buttons = document.getElementsByClassName("guess-button");
            console.log(buttons);
            for(let i = 0; i<buttons.length; i++){
                let button = buttons[i];
                if (button.textContent == guess){
                    button.classList.add("correct");
                    button.classList.remove("incorrect");
                    if(quizModel.incorrectGuesses.length == 0) quizModel.score += 1;
                }
                else{
                    button.classList.remove("correct");
                    button.classList.remove("incorrect");
                }
            }
        }
        else{
            quizModel.incorrectGuesses.push(guess);
            let buttons = document.getElementsByClassName("guess-button");
            console.log(buttons);
            for(let i = 0; i<buttons.length; i++){
                let button = buttons[i];
                if (button.textContent == guess){
                    button.classList.add("incorrect");
                    button.classList.remove("correct");

                }
                else{
                    button.classList.remove("correct");
                    button.classList.remove("incorrect");

                }
            }
        }
    }
    updateQuizScore();

}

function resetGuessButtonStyles(){
    let buttons = document.getElementsByClassName("guess-button");
    console.log(buttons);
    for(let i = 0; i<buttons.length; i++){
        let button = buttons[i];
            button.classList.remove("incorrect");
            button.classList.remove("correct");
    }
}

function updateQuizScore(){
    document.getElementById("quiz-score").textContent = "Score: " + quizModel.score.toString() + "/" + (quizModel.question).toString();
}

function updateQuizGui(quizModel, alphabet){

    //update guess button text content and guessing behaviour for new symbol
    let guessButtons = document.getElementsByClassName("guess-button");
    for(let i = 0; i < guessButtons.length; i++){
        guessButton = quizModel.guessButtons[i]
        guessButton.textContent = quizModel.options[i];
        guessButton.onclick = function(e){
            makeGuess(e.target.textContent);
        }
    }

    //change Braille Representations
    const brailleReps = document.getElementsByClassName("braille-representation");
    console.log(brailleReps);

    for(let i = 0; i < brailleReps.length; i++){
    const brailleDots = brailleReps[i].getElementsByClassName("braille-dot");
        console.log(brailleDots);
        for(let d = 0; d < brailleDots.length; d++){
            if(alphabet[quizModel.options[i]][d] == 1) brailleDots[d].classList.add("active");
            else brailleDots[d].classList.remove("active");
        }
    }
    console.log(quizModel.history);
    resetGuessButtonStyles();
}