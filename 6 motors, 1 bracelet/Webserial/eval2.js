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


const evaluation30Questions = [
    {"questionNo":1,"options":["f","g","h","n","t"],"answer":"f","replaysRemaining":4},
    {"questionNo":2,"options":["b","i","k","o","t"],"answer":"i","replaysRemaining":4},
    {"questionNo":3,"options":["d","q","r","s","t"],"answer":"d","replaysRemaining":4},
    {"questionNo":4,"options":["h","q","r","v","y"],"answer":"h","replaysRemaining":4},
    {"questionNo":5,"options":["a","h","r","u","x"],"answer":"u","replaysRemaining":4},
    {"questionNo":6,"options":["a","f","n","t","y"],"answer":"n","replaysRemaining":4},
    {"questionNo":7,"options":["j","n","o","p","u"],"answer":"j","replaysRemaining":4},
    {"questionNo":8,"options":["b","c","l","p","y"],"answer":"c","replaysRemaining":4},
    {"questionNo":9,"options":["b","e","l","p","x"],"answer":"x","replaysRemaining":4},
    {"questionNo":10,"options":["h","k","n","u","y"],"answer":"k","replaysRemaining":4},
    {"questionNo":11,"options":["a","l","m","o","r"],"answer":"o","replaysRemaining":4},
    {"questionNo":12,"options":["b","e","g","u","z"],"answer":"z","replaysRemaining":4},
    {"questionNo":13,"options":["h","j","u","v","w"],"answer":"v","replaysRemaining":4},
    {"questionNo":14,"options":["a","c","j","l","u"],"answer":"l","replaysRemaining":4},
    {"questionNo":15,"options":["g","q","s","u","x"],"answer":"s","replaysRemaining":4},
    {"questionNo":16,"options":["m","p","r","u","w"],"answer":"p","replaysRemaining":4},
    {"questionNo":17,"options":["a","b","n","s","v"],"answer":"a","replaysRemaining":4},
    {"questionNo":18,"options":["a","g","q","w","y"],"answer":"g","replaysRemaining":4},
    {"questionNo":19,"options":["i","r","s","t","y"],"answer":"t","replaysRemaining":4},
    {"questionNo":20,"options":["b","h","p","q","u"],"answer":"q","replaysRemaining":4},
    {"questionNo":21,"options":["b","c","e","j","x"],"answer":"b","replaysRemaining":4},
    {"questionNo":22,"options":["f","m","r","t","u"],"answer":"r","replaysRemaining":4},
    {"questionNo":23,"options":["i","q","v","y","z"],"answer":"y","replaysRemaining":4},
    {"questionNo":24,"options":["a","d","e","j","w"],"answer":"w","replaysRemaining":4},
    {"questionNo":25,"options":["a","g","m","s","x"],"answer":"m","replaysRemaining":4},
    {"questionNo":26,"options":["c","e","k","l","q"],"answer":"e","replaysRemaining":4},
    {"questionNo":27,"options":["g","j","n","t","v"],"answer":"g","replaysRemaining":4},
    {"questionNo":28,"options":["c","o","r","x","z"],"answer":"x","replaysRemaining":4},
    {"questionNo":29,"options":["i","q","r","t","x"],"answer":"q","replaysRemaining":4},
    {"questionNo":30,"options":["b","g","k","n","s"],"answer":"g","replaysRemaining":4}
]

const evalHARD30questions = [
    {"questionNo":1,"options":["d","h","k","o","y"],"answer":"d","replaysRemaining":4},
    {"questionNo":2,"options":["b","i","n","p","y"],"answer":"p","replaysRemaining":4},
    {"questionNo":3,"options":["d","f","l","x","y"],"answer":"x","replaysRemaining":4},
    {"questionNo":4,"options":["c","j","m","n","o"],"answer":"j","replaysRemaining":4},
    {"questionNo":5,"options":["a","b","i","r","s"],"answer":"s","replaysRemaining":4},
    {"questionNo":6,"options":["i","j","l","n","s"],"answer":"i","replaysRemaining":4},
    {"questionNo":7,"options":["f","h","m","u","w"],"answer":"m","replaysRemaining":4},
    {"questionNo":8,"options":["f","g","l","w","y"],"answer":"y","replaysRemaining":4},
    {"questionNo":9,"options":["d","h","l","o","t"],"answer":"t","replaysRemaining":4},
    {"questionNo":10,"options":["i","k","o","t","u"],"answer":"u","replaysRemaining":4},
    {"questionNo":11,"options":["a","d","h","i","z"],"answer":"z","replaysRemaining":4},
    {"questionNo":12,"options":["h","i","l","u","v"],"answer":"v","replaysRemaining":4},
    {"questionNo":13,"options":["a","c","q","s","t"],"answer":"a","replaysRemaining":4},
    {"questionNo":14,"options":["d","f","l","w","x"],"answer":"f","replaysRemaining":4},
    {"questionNo":15,"options":["b","n","o","p","z"],"answer":"b","replaysRemaining":4},
    {"questionNo":16,"options":["a","b","g","i","j"],"answer":"g","replaysRemaining":4},
    {"questionNo":17,"options":["f","m","n","y","z"],"answer":"n","replaysRemaining":4},
    {"questionNo":18,"options":["b","k","n","o","u"],"answer":"k","replaysRemaining":4},
    {"questionNo":19,"options":["c","d","e","r","s"],"answer":"e","replaysRemaining":4},
    {"questionNo":20,"options":["c","e","l","u","z"],"answer":"l","replaysRemaining":4},
    {"questionNo":21,"options":["e","j","k","q","y"],"answer":"q","replaysRemaining":4},
    {"questionNo":22,"options":["c","j","m","r","t"],"answer":"r","replaysRemaining":4},
    {"questionNo":23,"options":["e","j","p","v","w"],"answer":"w","replaysRemaining":4},
    {"questionNo":24,"options":["b","f","l","o","p"],"answer":"o","replaysRemaining":4},
    {"questionNo":25,"options":["c","g","q","r","t"],"answer":"c","replaysRemaining":4},
    {"questionNo":26,"options":["a","c","e","h","v"],"answer":"h","replaysRemaining":4},
    {"questionNo":27,"options":["d","m","o","t","w"],"answer":"w","replaysRemaining":4},
    {"questionNo":28,"options":["a","b","n","w","z"],"answer":"n","replaysRemaining":4},
    {"questionNo":29,"options":["g","j","k","v","w"],"answer":"g","replaysRemaining":4},
    {"questionNo":30,"options":["b","h","m","s","w"],"answer":"h","replaysRemaining":4}
]
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
      ".": [0, 0, 0, 0, 0, 1],
      "motor1": [1, 0, 0, 0, 0, 0],
      "motor2": [0, 1, 0, 0, 0, 0],
      "motor3": [0, 0, 1, 0, 0, 0],
      "motor4": [0, 0, 0, 1, 0, 0],
      "motor5": [0, 0, 0, 0, 1, 0],
      "motor6": [0, 0, 0, 0, 0, 1]
    }

    const curatedQuestions = [
        {"answer":"a", "options":["b", "k", "e", "c"]},
        {"answer": "b", "options": ["k", "l", "a", "f"]},
        {"answer": "c", "options": ["e", "i", "m", "u"]},
        {"answer": "d", "options": ["j", "h", "n", "g"]},
        {"answer": "e", "options": ["c", "o", "i", "d"]},
        {"answer": "f", "options": ["m", "h", "o", "s"]},
        {"answer": "g", "options": ["n", "t", "x", "z"]},
        {"answer": "h", "options": ["f", "g", "j", "o", "r", "f"]},
        {"answer": "i", "options": ["j", "e", "c", "f"]},
        {"answer": "j", "options": ["h", "d", "n", "g", "t", "w"]},
        {"answer": "k", "options": ["a", "b", "l", "o"]},
        {"answer": "l", "options": ["k", "a", "s", "b"]},
        {"answer": "m", "options": ["f", "o", "u", "x"]},
        {"answer": "n", "options": ["x", "z", "g", "t"]},
        {"answer": "o", "options": ["u", "h", "m", "f"]},
        {"answer": "p", "options": ["v", "f", "h", "q"]},
        {"answer": "q", "options": ["g", "p", "r", "t", "y"]},
        {"answer": "r", "options": ["v", "p", "q", "w"]},
        {"answer": "s", "options": ["f", "h", "m", "t", "o"]},
        {"answer": "t", "options": ["g", "n", "q", "s", "x", "z"]},
        {"answer": "u", "options": ["f", "h", "m", "o", "s", "z"]},
        {"answer": "v", "options": ["p", "r", "u", "w"]},
        {"answer": "w", "options": ["d", "j", "r", "y"]},
        {"answer": "x", "options": ["g", "n", "m", "t", "y", "z", "u"]},
        {"answer": "y", "options": ["n", "t", "x", "z", "w"]},
        {"answer": "z", "options": ["n", "y", "o", "x"]}
]

//converts from old motor grid layout to conventional Braille layout
conversion = {
    0:0,
    1:3,
    2:1,
    3:4,
    4:2,
    5:5
}

function chooseRandomArrayElement(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

function copyArray(arr){
    return JSON.parse(JSON.stringify(arr))
}

function convertCuratedAndRandom(curatedQuestion, questionNo, replays, totalOptions, totalRandom, keepAnswer){
    const finalOptions = []
    let answer = curatedQuestion.answer
    //get all the similar options
    const all = copyArray(curatedQuestion.options);
    all.push(curatedQuestion.answer);

    //choose one to be the answer
    if(keepAnswer){
        answer = curatedQuestion.answer;
    }
    else{
        answer = chooseRandomArrayElement(all);
    }
    finalOptions.push(answer);
    //select more from the pool of similar options
    for(let i = 0; i< totalRandom; i++){
        //only choose from letters that haven't yet been selected as an option
        finalOptions.push(chooseRandomArrayElement(all.filter(l => !finalOptions.includes(l))));
    }

    //select the final options randomly from the whole alphabet
    while(finalOptions.length < totalOptions){
        finalOptions.push(chooseRandomArrayElement(evaluationModel.allSymbols.filter(s => !finalOptions.includes(s))));
    }


    const newQuestion = {
        questionNo: questionNo,
        options: finalOptions.sort(),
        answer: answer,
        replaysRemaining: replays,   
    }

    return newQuestion;
}

function convertCurated(curatedQuestion, questionNo, replays, isRandomAnswer){
    let answer = curatedQuestion.answer
    let options= curatedQuestion.options;
    if(isRandomAnswer){
        const all = copyArray(curatedQuestion.options);
        all.push(curatedQuestion.answer);
        answer = chooseRandomArrayElement(all);
        options = all.filter(l => l!=answer);
    }
    const newQuestion = {
        questionNo: questionNo,
        options: options.sort(),
        answer: answer,
        replaysRemaining: replays,   
    }

    return newQuestion;
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
        "noQuestions": 10,
        "currentQuestionNo": 1,
        "previousAttempts": [],
        "currentIncorrect": [],
        "currentCorrect" :[],
        "questions":[],
        "round": 1,
        "time": Date.now()
    },
    "noReplays" : 4,
    "optionsPerGuess": 5,
    "optionsPerGuessMax": 5,
    "allSymbols": ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    guessesGUI: []
}


console.log(document.body);

function setRound(r){
    console.log("round:", r);
    evaluationModel.currentParticipant.round = r;
    document.getElementById("first").classList.remove("active");
    document.getElementById("second").classList.remove("active");
    document.getElementById("third").classList.remove("active");

    if(r == 1){
        document.getElementById("first").classList.add("active");
    }
    if(r == 2){
        document.getElementById("second").classList.add("active");
    }
    if(r == 3){
        document.getElementById("third").classList.add("active");
    }
}

const orderedEvaluationQuestions = curatedQuestions.map((q, index) => {
    return(convertCuratedAndRandom(q, index+1, evaluationModel.noReplays, evaluationModel.optionsPerGuess, evaluationModel.totalRandom, true));
})


shuffledEvaluationQuestions = []

while(shuffledEvaluationQuestions.length != orderedEvaluationQuestions.length){
    shuffledEvaluationQuestions.push(chooseRandomArrayElement(orderedEvaluationQuestions.filter(q => !shuffledEvaluationQuestions.includes(q))))
}

while(shuffledEvaluationQuestions.length < evaluationModel.currentParticipant.noQuestions){
    shuffledEvaluationQuestions.push(convertCuratedAndRandom(chooseRandomArrayElement(curatedQuestions), shuffledEvaluationQuestions.length+1, evaluationModel.noReplays, evaluationModel.optionsPerGuess, 1, false));
}

console.log(shuffledEvaluationQuestions);


//create new questions and store them in the model, then update GUI to start the evaluation
function startNewEvaluation(){
        mode = "eval";
        if(evaluationModel.currentParticipant.round == ""){
            window.alert("please select the relevant round");
            return;
        }
        if(document.getElementById("participant-id-input").value == ""){
            window.alert("please enter a new participant ID");
            return;
        }
        let r = evaluationModel.currentParticipant.round;
        console.log("r:", r);
        evaluationModel.currentParticipant.questions = evaluation30Questions.filter((q,i) => {return q.questionNo > 10*(r-1) && q.questionNo <= (r*10)});
        

        console.log(evaluationModel.currentParticipant.questions);

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
    if(evaluationModel.currentParticipant.currentQuestionNo > evaluationModel.currentParticipant.noQuestions){
        return;
    }

    let currentParticipant = evaluationModel.currentParticipant;
    if(currentParticipant.currentCorrect.length > 0){
        console.log("Ready to Move on");
        let currentPoints = 1
        if(evaluationModel.currentParticipant.currentIncorrect.length > 0){
            currentPoints = 0.8 - 0.2*evaluationModel.currentParticipant.currentIncorrect.length;
        }
        currentParticipant.previousAttempts.push({
            "questionNo": evaluationModel.currentParticipant.currentQuestionNo,
            "answer": JSON.parse(JSON.stringify(currentParticipant.questions[evaluationModel.currentParticipant.currentQuestionNo].answer)),
            "incorrect": JSON.parse(JSON.stringify(currentParticipant.currentIncorrect)),
            "isCorrect": currentParticipant.currentIncorrect == 0,
            "replaysRemaining": currentParticipant.questions[evaluationModel.currentParticipant.currentQuestionNo].replaysRemaining,
            "points": currentPoints
        })

        currentParticipant.currentCorrect = [];
        currentParticipant.currentIncorrect = [];

        evaluationModel.currentParticipant.currentQuestionNo = evaluationModel.currentParticipant.currentQuestionNo + 1;
        if(evaluationModel.currentParticipant.currentQuestionNo == evaluationModel.currentParticipant.noQuestions){
            document.getElementById("eval-next").classList.add("unpressable");
            document.getElementById("eval-next").textContent = "No more questions";
        }

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
            for(let i = 0; i < evaluationModel.optionsPerGuessMax; i++){
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
            for(let i = 0; i < evaluationModel.optionsPerGuessMax; i++){
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
    const dateStr = new Date().toString();
    const newParticipant = {
        participantID: evaluationModel.currentParticipant.participantID,
        date: dateStr,
        round: evaluationModel.currentParticipant.round,
        answerHistory: evaluationModel.currentParticipant.previousAttempts,
        totalQuestions: totalQuestions,
        totalCorrect: totalCorrect,
        totalIncorrect: totalQuestions - totalCorrect,
        comments: ""
    }

    previousParticipants.push(newParticipant);

    downloadObjectAsJson(previousParticipants, "User Evaluation ALL as of " + dateStr);
    downloadObjectAsJson(newParticipant, "User Evaluation of " + newParticipant.participantID);

}

function updateEvaluationGui(){
    //update choices
    //update play letter button
    let currentQuestionNo = evaluationModel.currentParticipant.currentQuestionNo;
    document.getElementById("eval-play-letter").textContent="Play Letter"

    if (currentQuestionNo >= evaluationModel.currentParticipant.noQuestions || true){
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

    document.getElementById("connect-button").textContent = "connected!"

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