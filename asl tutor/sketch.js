/* model trained on data from
https://www.canva.com/p/templates/EAFDoRFMD1Q?utm_source=google_sem&utm_medium=cpc&utm_campaign=us_en_all_print_rev_conversion_print_shopping&utm_adgroup=us_en_all_print_rev_conversion_poster_shopping&utm_keyword=PRODUCT_GROUP&gclid=EAIaIQobChMIx6vlr7fxggMVfkhHAR39mwamEAQYAiABEgIIkvD_BwE&gclsrc=aw.ds 
https://www.amazon.com/TREND-enterprises-Language-Learning-Chart/dp/B002IXIU3Q/ref=asc_df_B002IXIU3Q/?tag=hyprod-20&linkCode=df0&hvadid=312137960118&hvpos=&hvnetw=g&hvrand=104160282543731659&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9067609&hvtargid=pla-597322938124&psc=1&mcid=ff0093da427634a68813c890893d965f&tag=&ref=&adgrpid=61323203759&hvpone=&hvptwo=&hvadid=312137960118&hvpos=&hvnetw=g&hvrand=104160282543731659&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9067609&hvtargid=pla-597322938124&gclid=EAIaIQobChMIv4j6mLnxggMVtFxHAR38-gwGEAQYAyABEgIjUfD_BwE
https://www.amazon.com/Gerard-Aflague-Collection-American-Language/dp/B076JTXSYG
https://www.youtube.com/watch?v=kj_nx1iLqY8 
https://www.mdpi.com/applsci/applsci-11-05594/article_deploy/html/images/applsci-11-05594-g001.png 
https://www.youtube.com/watch?v=tkMg8g8vVUo 
https://www.youtube.com/watch?v=sHyG7iz3ork
https://www.youtube.com/watch?v=7suKo9kCTus 
https://www.youtube.com/watch?v=cGavOVNDj1s 
https://www.youtube.com/watch?v=6_gXiBe9y9A 
https://www.youtube.com/watch?v=eeAq4gkOEUY 
https://www.youtube.com/watch?v=wMQHd1UBkeI 
https://www.youtube.com/watch?v=csBb71UPN8E 
https://www.youtube.com/watch?v=aEYcmNhz7Uc 
https://www.youtube.com/watch?v=fXf4d23WqiA 
https://www.youtube.com/watch?v=dhWk-nkdeck 
https://www.youtube.com/watch?v=g9omp6ak0aI 
https://www.youtube.com/watch?v=1TYeqrDLHUc */

/* image source https://www.thearcofohio.org/asl-alphabet/ */


let classifier;

let imageModelURL = 'https://teachablemachine.withgoogle.com/models/jK-f03k5v/';

let video;
let flippedVideo;

let label = "";

let state = 0;
let points = 0;
let gameState = "idle";

let letters = ['c', 'd', 'e', 'f', 'g', 'i'];
let currentLetter = 0;

let time = 3;

let font;

function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
    createCanvas(640, 500);

    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    textAlign(CENTER, CENTER);
    rectMode(CENTER);

    flippedVideo = ml5.flipImage(video);

    classifyVideo();
}

function draw() {
    //start page
    if (state == 0) {
        startPage();
        //game playing
    } else if (state == 1) {
        gamePlaying();
        //game end
    } else {
        gameEnd();
    }
}

function startPage() {
    //display and hide HTML elements
    displayStartButton();
    displayStartInstructions();
    hideCheckButton();
    hidePlayAgainButton();
    hideGameInstructions();
    hideScoreInfo();

    setBackgroundColor(240, 255, 255);
}

function gamePlaying() {
    //display and hide HTML elements
    displayCheckButton();
    displayGameInstructions();
    hideStartButton();
    hidePlayAgainButton();
    hideStartInstructions();
    hideScoreInfo();

    setBackgroundColor(240, 255, 255);

    //display video camera
    image(flippedVideo, 0, 0);

    if (gameState == "idle") {
        displayIdle();
    } else {
        displayResult();
    }

    strokeWeight(15);
    fill(255, 255, 255, 0);
    rect(width / 2, height / 2, 300, 400, 20, 20);
    noStroke();
    fill(255);
    textSize(25);
}

function displayIdle() {
    noStroke();
    fill(255);
    textSize(255);
    text(letters[currentLetter], width / 2, height / 2);
    stroke(0);
}

function gameEnd() {
    //display and hide HTML elements
    displayScoreInfo();
    displayPlayAgainButton();
    hideStartButton();
    hideCheckButton();
    hideStartInstructions();
    hideGameInstructions();

    setBackgroundColor(176, 196, 222);
    fill(240, 255, 255);
    textSize(40);
}

//check if the sign is correct
function checkIfCorrect() {
    //if the user fingerspelled the correct sign, remove it from letters and increase points
    if (label == letters[currentLetter]) {
        gameState = "correct";
        points += 10;
        letters.splice(currentLetter, 1);
    } else {
        textSize(40);
        fill(235, 92, 92);
        text("incorrect", width / 2, height / 2);
        gameState = "incorrect";
        points -= 5;
        currentLetter++;
    }

    //user has made the correct sign for all the letters at least one time
    if (letters.length == 0) {
        setState(2);
        letters = ['c', 'd', 'e', 'f', 'g', 'i'];
        window.scrollTo(0, 0);
        return;
    }

    //start over to go over all the incorrect signs once again
    if (currentLetter >= letters.length) {
        currentLetter = 0;
    }
    time = 1.5;
}

function displayResult() {
    if (frameCount % 100 == 0) {
        time = -1;
    }

    //amount of time that the frame will be either green or red to indicate corect or incorrect answer
    if (time > 0) {
        if (gameState == "correct") {
            noStroke();
            textSize(25);
            fill(204, 255, 204);
            text("correct", width / 2, height / 2);
            stroke(204, 255, 204);
        } else {
            noStroke();
            textSize(25);
            fill(235, 92, 92);
            text("incorrect", width / 2, height / 2);
            stroke(235, 92, 92);
        }
    } else {
        gameState = "idle";
    }
}

function setState(s) {
    state = s;
}


function classifyVideo() {
    flippedVideo = ml5.flipImage(video)
    classifier.classify(flippedVideo, gotResult);
    flippedVideo.remove();
}

function setBackgroundColor(r, g, b) {
    document.body.style.background = "rgb(" + r + "," + g + "," + b + ")";
    background(r, g, b);
}


function gotResult(error, results) {
    if (error) {
        console.error(error);
        return;
    }
    label = results[0].label;

    classifyVideo();
}

function displayPlayAgainButton() {
    var playAgainButton = document.getElementById("playAgainBtn");
    playAgainButton.style.display = "initial";
}

function hidePlayAgainButton() {
    var playAgainButton = document.getElementById("playAgainBtn");
    playAgainButton.style.display = "none";
}

function hideStartButton() {
    var startButton = document.getElementById("startBtn");
    startButton.style.display = "none";
}

function displayStartButton() {
    var startButton = document.getElementById("startBtn");
    startButton.style.display = "initial";
}

function hideCheckButton() {
    var btn = document.getElementById("checkBtn");
    btn.style.display = "none";
}

function displayCheckButton() {
    var checkBtn = document.getElementById("checkBtn");
    checkBtn.style.display = "initial";
}

function displayStartInstructions() {
    var startText = document.getElementById("startInfo");
    startText.style.display = "block";
}

function hideStartInstructions() {
    var startText = document.getElementById("startInfo");
    startText.style.display = "none";
}

function displayGameInstructions() {
    var gameText = document.getElementById("gameInfo");
    gameText.style.display = "block";
}

function hideGameInstructions() {
    var gameText = document.getElementById("gameInfo");
    gameText.style.display = "none";
}

function displayScoreInfo() {
    var scoreText = document.getElementById("scoreInfo");
    scoreText.style.display = "block";
    var pointsText = document.getElementById("pointsInfo");
    pointsText.innerText = points + "/" + letters.length * 10;
    pointsText.style.display = "block";
}

function hideScoreInfo() {
    var scoreText = document.getElementById("scoreInfo");
    scoreText.style.display = "none";
    var pointsText = document.getElementById("pointsInfo");
    pointsText.style.display = "none";
}
