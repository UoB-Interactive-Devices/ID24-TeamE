console.log("hi");
'use strict';

//serial I/O stuff
let port;
let reader;
let inputDone;
let outputDone;
let inputStream;
let outputStream;

let mode = "learn"


//maps a symbol to a motor activation configuration
const alphabet =  {
      "a": [1, 0, 0, 0, 0, 0],
      "b": [1, 1, 0, 0, 0, 0],
      "c": [1, 0, 0, 1, 0, 0],
      "d": [1, 0, 0, 1, 1, 0],
      "e": [1, 0, 0, 0, 1, 0],
      "f": [1, 1, 0, 1, 0, 0],
      "g": [1, 1, 0, 1, 1, 0],
      "h": [1, 1, 0, 0, 1, 0],
      "i": [0, 1, 0, 1, 0, 0],
      "j": [0, 1, 0, 1, 1, 0],
      "k": [1, 0, 1, 0, 0, 0],
      "l": [1, 1, 1, 0, 0, 0],
      "m": [1, 0, 1, 1, 0, 0],
      "n": [1, 0, 1, 1, 1, 0],
      "o": [1, 0, 1, 0, 1, 0],
      "p": [1, 1, 1, 1, 0, 0],
      "q": [1, 1, 1, 1, 1, 0],
      "r": [1, 1, 1, 0, 1, 0],
      "s": [0, 1, 1, 1, 0, 0],
      "t": [0, 1, 1, 1, 1, 0],
      "u": [1, 0, 1, 0, 0, 1],
      "v": [1, 1, 1, 0, 0, 1],
      "w": [0, 1, 0, 1, 1, 1],
      "x": [1, 0, 1, 1, 0, 1],
      "y": [1, 0, 1, 1, 1, 1],
      "z": [1, 0, 1, 0, 1, 1],
      "motor1": [1, 0, 0, 0, 0, 0],
      "motor2": [0, 1, 0, 0, 0, 0],
      "motor3": [0, 0, 1, 0, 0, 0],
      "motor4": [0, 0, 0, 1, 0, 0],
      "motor5": [0, 0, 0, 0, 1, 0],
      "motor6": [0, 0, 0, 0, 0, 1]
    }

//converts from old motor grid layout to conventional Braille layout
conversion = {
    0:0,
    1:3,
    2:1,
    3:4,
    4:2,
    5:5
}

const currentSymbol = document.getElementById("current-symbol");

//Model for storing data in the quiz mode
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

//Model for the evaluation mode
let evaluationModel = {
    "previousParticipants":[],
    "currentParticipant":{
        "participantID": "participant ",
        "noQuestions": 15,
        "currentQuestionNo": 0,
        "previousAttempts": [],
        "currentIncorrect": [],
        "currentCorrect" :[],
        "questions":[],
        "formFactor": "",
        "time": Date.now()
    },
    "noReplays" : 3,
    "optionsPerGuess": 5,
    "optionsPerGuessMax": 6,
    "allSymbols": ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    guessesGUI: []
}

console.log(document.body);

function setFormFactor(ff){
    evaluationModel.currentParticipant.formFactor = ff;
}

//create new questions and store them in the model, then update GUI to start the evaluation
function startNewEvaluation(){
        if(evaluationModel.currentParticipant.formFactor == ""){
            window.alert("please select the relevant form factor of your wearable");
            return;
        }
        if(document.getElementById("participant-id-input").value == ""){
            window.alert("please enter a new participant ID");
            return;
        }
        evaluationModel.currentParticipant.participantID = document.getElementById("participant-id-input").value;
        evaluationModel.currentParticipant.time = Date.now();
        evaluationModel.currentParticipant.noQuestions = document.getElementById("eval-question-no-input").value;
        for(let i = 0; i<evaluationModel.currentParticipant.noQuestions * 10; i++){
            const nextOptions = [];
            //keep adding options randomly from the pool of allowed symbols (pick without replacement)
            while(nextOptions.length < evaluationModel.optionsPerGuess){
                filteredAllowedSymbols = evaluationModel.allSymbols.filter(s => !(nextOptions.includes(s)));
                let randomNumber = Math.round(Math.random()* (filteredAllowedSymbols.length - 1));
                // console.log("random number should be 0-25:",randomNumber);
                nextOptions.push(filteredAllowedSymbols[randomNumber]);
            }
            const newOptions = nextOptions.sort();
            //set new answer randomly
            const newAnswer = nextOptions[Math.round(Math.random()*(evaluationModel.optionsPerGuess - 1))];

            const newQuestion = {questionNo: i+1,
                                 options: newOptions,
                                 answer: newAnswer,
                                 replaysRemaining: evaluationModel.noReplays}

            evaluationModel.currentParticipant.questions.push(newQuestion);
        }

         
        const guessList = document.getElementById("eval-guess-list")
        //make the options elements.
        for(let i = 0; i < evaluationModel.optionsPerGuessMax; i++){

            const guess = document.createElement("li");
            guess.classList.add("eval-rep");
            if(i >= evaluationModel.optionsPerGuess){
                guess.classList.add("hidden")
            }
            const guessButton = document.createElement("button");
            guessButton.onclick = function(e){
                makeGuess(e.target.textContent);
            }
            guessButton.classList.add("eval-guess-button")
            const evalRepList = document.createElement("ul");
            evalRepList.classList.add("eval-rep-list")
            for(let j = 0; j < 6; j++){
                const dot = document.createElement("div");
                dot.classList.add("eval-dot");
                evalRepList.appendChild(dot);
            }
            guess.appendChild(guessButton);
            guess.appendChild(evalRepList);
            guessList.appendChild(guess);

            evaluationModel.guessesGUI.push(guess);
        }
        console.log("new evaluation:", evaluationModel);

        updateEvaluationGui();
        document.getElementById("evaluation-setup").classList.add("hidden");
        document.getElementById("eval-test-container").classList.remove("hidden");

}

function nextEvalQuestion(){
    if(evaluationModel.currentParticipant.currentQuestionNo == evaluationModel.currentParticipant.noQuestions){
        return;
    }

    let currentParticipant = evaluationModel.currentParticipant;
    if(currentParticipant.currentCorrect.length > 0){
        console.log("Ready to Move on");
        currentParticipant.previousAttempts.push({
            "answer": JSON.parse(JSON.stringify(currentParticipant.questions[evaluationModel.currentParticipant.currentQuestionNo].answer)),
            "incorrect": JSON.parse(JSON.stringify(currentParticipant.currentIncorrect)),
            "isCorrect": currentParticipant.currentIncorrect == 0
        })

        currentParticipant.currentCorrect = [];
        currentParticipant.currentIncorrect = [];

        evaluationModel.currentParticipant.currentQuestionNo = evaluationModel.currentParticipant.currentQuestionNo + 1;

        updateEvaluationGui();
    }
    else{
        console.log("not ready to move on");
    }

}

function updateEvalOption(option, index){
    const optionStr = option;
    console.log("option for eval GUI update: ", option);
    evaluationModel.guessesGUI[index].getElementsByTagName("button")[0].textContent = option;
    evaluationModel.guessesGUI[index].getElementsByTagName("button")[0].onclick = () => makeEvalGuess(optionStr);

    for(let i = 0; i < 6; i++){
        evaluationModel.guessesGUI[index].getElementsByClassName("eval-dot")[i].classList.remove("active");
        if(alphabet[option][conversion[i]] == 1){
            evaluationModel.guessesGUI[index].getElementsByClassName("eval-dot")[i].classList.add("active");
        }
    }
}

function playEvalLetter(){
    let currentQuestionNo = evaluationModel.currentParticipant.currentQuestionNo;


    if(evaluationModel.currentParticipant.questions[currentQuestionNo].replaysRemaining <= 0 ){
        window.alert("Out of replays for this question, please make a guess.");
        return;
    }
    console.log(evaluationModel.currentParticipant.questions[currentQuestionNo].answer);
    evaluationModel.currentParticipant.questions[currentQuestionNo].replaysRemaining -= 1;
    if(evaluationModel.currentParticipant.questions[currentQuestionNo].replaysRemaining <= 0){
        document.getElementById("eval-play-letter").classList.add("unpressable");
    }
    
    document.getElementById("eval-play-letter").textContent = `Replay letter - ${evaluationModel.currentParticipant.questions[currentQuestionNo].replaysRemaining}/${evaluationModel.noReplays} left`

    handleCharacterSend(evaluationModel.currentParticipant.questions[currentQuestionNo].answer)

    console.log("play Letter pressed")
    console.log(evaluationModel.currentParticipant.questions[currentQuestionNo]);

}

function makeEvalGuess(guess){
    console.log("Making guess:", guess);
    console.log("guess was made: ", guess)

    let currentParticipant = evaluationModel.currentParticipant;
    let questionNo = currentParticipant.currentQuestionNo;
    let currentQuestion = currentParticipant.questions[questionNo];
    let answer = currentQuestion.answer;

    if(currentParticipant.currentCorrect.length > 0){
        //do nothing
    }
    else{
        const buttons = document.getElementsByClassName("eval-guess-button");
        if(guess == answer){
            console.log("Correct", buttons);
            currentParticipant.currentCorrect.push(answer);
            for(let i = 0; i < 6; i++){
                if(buttons[i]){
                    if(buttons[i].textContent == answer){
                        buttons[i].classList.add("correct");
                    }
                }
            }
            document.getElementById("eval-next").classList.remove("unpressable");
        }
        else{
            console.log("incorrect");
            currentParticipant.currentIncorrect.push(guess);
            for(let i = 0; i < 6; i++){
                if(buttons[i]){
                    if(buttons[i].textContent == guess){
                        buttons[i].classList.add("incorrect");
                    }
                }
            }
        }
    }

    console.log("Current participant", currentParticipant);


}

function copyObject(obj){
    return JSON.parse(JSON.stringify(obj));
}

function handleParticipantDownload(){
    const previousParticipants = copyObject(evaluationModel.previousParticipants);

    const totalQuestions = evaluationModel.currentParticipant.previousAttempts.length;
    const totalCorrect = evaluationModel.currentParticipant.previousAttempts.filter(a => a.isCorrect).length;

    const newParticipant = {
        participantID: evaluationModel.currentParticipant.participantID,
        date: evaluationModel.currentParticipant.date,
        formFactor: evaluationModel.currentParticipant.formFactor,
        answerHistory: evaluationModel.currentParticipant.previousAttempts,
        totalQuestions: totalQuestions,
        totalCorrect: totalCorrect,
        totalIncorrect: totalQuestions - totalCorrect,
        comments: ""
    }

    previousParticipants.push(newParticipant);

    downloadObjectAsJson(previousParticipants, "User Evaluation ALL as of " + Date.UTC());
    downloadObjectAsJson(newParticipant, "User Evaluation of " + newParticipant.participantID);

}

function updateEvaluationGui(){
    //update choices
    //update play letter button
    let currentQuestionNo = evaluationModel.currentParticipant.currentQuestionNo;
    document.getElementById("eval-play-letter").textContent="Play Letter"

    if (currentQuestionNo >= evaluationModel.currentParticipant.noQuestions){
        document.getElementById("download-participant-data").classList.remove("hidden");
    }

    console.log("current Q", currentQuestionNo)
    let currentQuestion = evaluationModel.currentParticipant.questions[currentQuestionNo];
    let currentOptions = currentQuestion.options;
    console.log("current options:", currentOptions);
    for(let i = 0; i < currentOptions.length; i++){
        updateEvalOption(currentOptions[i], i);

    }

    document.getElementById("eval-next").classList.add("unpressable");
    document.getElementById("eval-play-letter").classList.remove("unpressable");



    document.getElementById("current-eval-question-label").textContent = "Question " + evaluationModel.currentParticipant.currentQuestionNo + "/" + evaluationModel.currentParticipant.noQuestions;

    const buttons = document.getElementsByClassName("eval-guess-button");

    for(let i = 0; i < evaluationModel.optionsPerGuessMax; i++){
        if(buttons[i]){
                buttons[i].classList.remove("incorrect");
                buttons[i].classList.remove("correct");
        }
    }
    

    document.getElementById("progress-bar").style.setProperty("--evaluation-progress", (evaluationModel.currentParticipant.currentQuestionNo/evaluationModel.currentParticipant.noQuestions));
}

const packRadio = document.getElementById("pack-radio");
const directRadio = document.getElementById("direct-radio");
let serialMode = "pack";
const serialRadios = [packRadio, directRadio];

for(let i = 0; i< serialRadios.length; i++){
    serialRadios[i].onclick = e => {
        console.log(serialRadios[i].checked);
        if(serialRadios[i].checked){
            serialMode = serialRadios[i].value;
        }
        console.log("serial mode changed to:", serialMode);
    }
}

const stages = {
    "currentStage": "calibration",
    "allStages":{
    "quiz": document.getElementById("quiz-stage"),
    "freeplay": document.getElementById("freeplay-stage"),
    "calibration": document.getElementById("calibration-stage"),
    "evaluation": document.getElementById("evaluation-stage")
}
}

const customAlphabetUpload = document.getElementById("file");
customAlphabetUpload.addEventListener("change", async function(e){
    console.log(e.target.files);
    if(e.target.files.length > 0){
        const alphabet = await parseJsonFile(e.target.files[0]);
        customAlphabetModel.alphabet = alphabet;

        for(let j = 0; j<alphabet.length; j++){
            const symbol = alphabet[j];
            const customRepContainer = document.createElement("li");
            customRepContainer.classList.add("custom-representation-container");
        
            const customLabel = document.createElement("label");
            customLabel.textContent = symbol.name;
        
            const customRepList = document.createElement("ul");
            customRepList.classList.add("custom-representation-list")
            
        
            for(let i =0; i<6; i++){
                const b = document.createElement("li");
                b.classList.add("custom-alphabet-braille-dot");
                if(symbol.activations[conversion[i]] == 1){
                    b.classList.add("active");
                }
                customRepList.appendChild(b);
            }
            

            const sendVibrationButton = document.createElement("button");
            sendVibrationButton.onclick = (e) => {
            //find the motor configuration from the custom alphabet
            //encode as a char and send
        
                let matches = alphabet.filter(a => a.name == symbol.name);
                if(!matches || matches.length == 0) return
                else{
                    let match = matches[0];
                    let packedConfig = packConfigToChar(match.activations);
                    if(port!=null)  writeToStream(packedConfig);
                }
            }
            sendVibrationButton.textContent = "Send to Bracelet";
        
            customRepContainer.appendChild(customLabel);
        
            customRepContainer.appendChild(customRepList);
        
            customRepContainer.appendChild(sendVibrationButton);
        
        
            document.getElementById("custom-alphabet-list").appendChild(customRepContainer)
            console.log(alphabet);
        }
    }
})


async function parseJsonFile(file){
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = event => resolve(JSON.parse(event.target.result))
        fileReader.onerror = error => reject(error)
        fileReader.readAsText(file)
    })
}

//hide all game stages except new mode choice
function changeMode(newmode){
    if(port==null){
        window.alert("please connect a device before leaving calibration mode");
        return
    }
    let allStages = stages.allStages;
    console.log("all stages", Object.keys(allStages));
    console.log(allStages["quiz"].classList)
    Object.keys(allStages).forEach( s =>{ console.log(s);
        allStages[s].classList.add("hidden")}
    )
    stages.allStages[newmode].classList.remove("hidden");
    stages["currentStage"] = newmode;
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

const customAlphabetModel = {
    "activations": [0,0,0,0,0,0],
    "alphabet": []
}

const customAlphabetInput = document.getElementById("cutstom-alphabet-input");
const addCustomAlphabetButton = document.getElementById("add-cutstom-alphabet-button");
const customAlphabetList = document.getElementById("custom-alphabet-list");

function packConfigToChar(activations){
    //Converts an array correpsonding to activated motors into
    //a single char that can be sent via serial
    if(!activations || activations.length != 6){
        console.log("Please provide a valid array of motor configurations instead of:", activations);
        return -1;
    }
    let packedInt = 0
    for (let i  = 0; i< activations.length; i++){
        packedInt += activations[i]
        if (i < 5)packedInt*=2
    }
    let packedChar = String.fromCharCode(packedInt);

    console.log("PACK -- original list: ", activations, "packed integer", packedInt, "char:", packedChar);
    return packedChar;
}

function convertActivations(activations){
    const convertedActivations = [0,0,0,0,0,0];
    for(let i = 0; i<activations.length; i++){
        convertedActivations[conversion[i]] = activations[i];
    }
    return convertedActivations
}

function handleAddNewSymbol(){
    let name = customAlphabetInput.value;
    customAlphabetModel.alphabet.push({
        "name": name,
        "activations": JSON.parse(JSON.stringify(convertActivations(customAlphabetModel.activations)))
    })


    console.log("updated alphabet:", customAlphabetModel.alphabet)
    const customRepContainer = document.createElement("li");
    customRepContainer.classList.add("custom-representation-container");

    const customLabel = document.createElement("label");
    customLabel.textContent = name;

    const customRepList = document.createElement("ul");
    customRepList.classList.add("custom-representation-list")
    

    for(let i =0; i<6; i++){
        const b = document.createElement("li");
        b.classList.add("custom-alphabet-braille-dot");
        if(customAlphabetModel.activations[i] == 1){
            b.classList.add("active");
        }
        customRepList.appendChild(b);
    }

    const sendVibrationButton = document.createElement("button");
    sendVibrationButton.onclick = (e) => {
        //find the motor configuration from the custom alphabet
        //encode as a char and send

        let matches = customAlphabetModel.alphabet.filter(a => a.name == name);
        if(!matches || matches.length == 0) return
        else{
            let match = matches[0];
            let packedConfig = packConfigToChar(match.activations);
            if(port!=null)  writeToStream(packedConfig);
        }
    }
    sendVibrationButton.textContent = "Send to Bracelet";

    customRepContainer.appendChild(customLabel);

    customRepContainer.appendChild(customRepList);

    customRepContainer.appendChild(sendVibrationButton);


    document.getElementById("custom-alphabet-list").appendChild(customRepContainer)
    console.log(customAlphabetModel.alphabet);
}

function playNewSymbol(){
    let name = customAlphabetInput.value;
    const newConfig = customAlphabetModel.activations;
    console.log("New symbol: name - ", newConfig);
    handleCustomCharacterSend(newConfig);
}

function handleCustomCharacterSend(activations){
    if (serialMode!="pack"){
        window.alert("Unable to send custom motor activations to bracelet unless it uses the bit packing software AND this application is in 'pack' serial mode");
        return;
    }
    else{
        const convertedActivations = [0,0,0,0,0,0];
        for(let i =0; i< activations.length; i++){
            convertedActivations[conversion[i]] = activations[i];
        }
        let packedChar = packConfigToChar(convertedActivations);
        // let packedChar = packConfigToChar(activations);

        if(port!=null){
            writeToStream(packedChar);
            console.log("Sending activation", convertedActivations, " to bracelet as packed char", packedChar);
        }
    }
}

function toggleCustomBrailleDot(id){
    let currentVal = customAlphabetModel.activations[id - 1];
    if (currentVal == 0){
        document.getElementById("custom-braille-dot" + id).classList.add("active");
    }
    else{
        document.getElementById("custom-braille-dot" + id).classList.remove("active");
    }
    customAlphabetModel.activations[id - 1] = 1 - currentVal;
}

document.addEventListener("DOMContentLoaded", async function(){
    console.log('serial' in navigator); 
    if(! ('serial' in navigator)){
        window.alert("browser not compatible; try a recent verison of chrome, edge, or opera...");
    }
})

document.addEventListener('keydown', function(event){
    let key = event.key;
    if(stages.currentStage == "calibration"){
        handleCharacterSend(key);
    }
})


async function handleMotorPress(motorid){
    //send the character to the arduino if it's connected
    if(port!=null){
        if(serialMode=="pack"){
            writeToStream(packConfigToChar(alphabet["motor"+motorid]));
        }
        else writeToStream(motorid);
    }

    for(let i = 1; i<=6; i++){
        document.getElementById("motor" + (i).toString()).classList.remove("active")
    }
    document.getElementById("motor" + (motorid).toString()).classList.add("active")
}

//sends a given character to serial and updates visual indicator of which motors are activated
async function handleCharacterSend(char){
    //send the character to the arduino if it's connected

        if(serialMode == "pack"){
            if(port!=null) writeToStream(packConfigToChar(alphabet[char]));
            console.log("sending packed:", packConfigToChar(alphabet[char]));
        }
        else{
            if(port!=null) writeToStream(char);
            console.log("sending direct:", char)
        }

    if(["learn"].includes(mode)){
        //demonstrate which buttons need highlighting
        let motorConfig = alphabet[char] || [];
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
            for(let i = 1; i<=6; i++){
                document.getElementById("motor"+i).classList.remove("active")
            }
            document.getElementById("motor"+char).classList.add("active")
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

    // CODELAB: Send CTRL-C and turn off echo on REPL
    writeToStream('\x03');
}

async function clickConnect(){
    await connect();
}

function writeToStream(...lines){
    const writer = outputStream.getWriter();
    lines.forEach((line) => {
        console.log('[SEND]', line);
        writer.write(line);
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
            if(alphabet[quizModel.options[i]][conversion[d]] == 1) brailleDots[d].classList.add("active");
            else brailleDots[d].classList.remove("active");
        }
    }
    console.log(quizModel.history);
    resetGuessButtonStyles();
}

function handleAlphabetDownload(){
    console.log("attempting to download alphabet:", customAlphabetModel.alphabet)
    downloadObjectAsJson(customAlphabetModel.alphabet, "my-alphabet");
}

// function handleCustomAlphabetUpload(e){
//     let reader = new FileReader();
//     reader.onload = onReaderLoad;
//     reader.readAsText(e);
// }




//used to download JSON files
function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }