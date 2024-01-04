//octopus
let octopus;

//fish
let fish = [];

//ink
let ink = [];
let inkReady = false;

//game state
let gameOver = false;
let gameStart = true;
let gameWon = false;

//scoring system
let lives = 50;
let defeated = 0;
let score = 0;
let highScore = 0;
let level = 0;

//sounds
let inkPickUp;
let inkRelease;
let octopusHurt;
let fishHurt;

//images
let octopusIdle;
let fishIdle;
let seabed;
let inkBottle;
let inkSplash;

//homepage animation
let animationFrame = 0;

function preload() {
    //images
    seabed = loadImage('images/background/seabed.jpeg');
    octopusIdle = loadImage('images/octopus/Idle.png');
    fishIdle = loadImage('images/fish/Idle.png');
    inkBottle = loadImage('images/ink/Icon16.png');
    inkSplash = loadImage('images/ink/Portal2.png');

    //sounds
    inkPickUp = loadSound('sounds/ink/mixkit-bonus-earned-in-video-game-2058.wav');
    inkRelease = loadSound('sounds/ink/mixkit-game-blood-pop-slide-2363.wav');
    octopusHurt = loadSound('sounds/octopus/mixkit-negative-guitar-tone-2324.wav');
    fishHurt = loadSound('sounds/fish/mixkit-player-jumping-in-a-video-game-2043.wav');
}

function setup() {
    //creating canvas for the game
    let canvas = createCanvas(500, 500);
    canvas.parent('#game_container');

    //aligning all text in the canvas in the middle
    textAlign(CENTER);

    //stores high score
    highScore = window.localStorage.getItem('highScore');
    document.querySelector('#difficulty_dropdown').onchange = chooseDifficulty;
}

//states of the game
function draw() {
    //welcome page
    if (gameStart) {
        welcome();
    } else {
        //game is ongoing
        if (!gameOver) {
            visuals();
            play();
            // user won the game
        } else if (gameWon) {
            displayScore();
            //user lost the game
        } else {
            userLost();
        }
    }
}

//visuals for the welcome page
function welcome() {
    //background and text style for welcome page
    background(0);
    textSize(30);
    fill(255);
    text("CHOOSE DIFFICULTY TO \n START THE GAME", width / 2, 190);
    textSize(15);
    fill(255, 0, 100);

    //animation of octopus welcome page
    image(octopusIdle, width / 2 - 45, 280, 150, 150, animationFrame * 48, 0, 48, 48);

    if (frameCount % 7 == 0) {
        animationFrame += 1;
    }

    if (animationFrame >= 6) {
        animationFrame = 0;
    }

    //display highscore if there is one
    if (highScore) {
        text("The high score is: " + highScore, width / 2, height / 2 + 20);
    } else {
        text("Be the first one to set a high score!", width / 2, height / 2 + 20);
    }
}

//the game is being played and the characters interact with one another
function play() {
    //fishes
    for (let i = 0; i < level; i++) {
        fish[i].visuals();
        fish[i].movement();
        fish[i].checkIfOctopusHurt();
        fish[i].checkIfFishHurt();
    }

    //ink bottles
    for (let i = 0; i < 10 / level; i++) {
        ink[i].visuals();
        ink[i].movement();
    }

    //octopus
    octopus.releaseInk();
    octopus.visuals();
    octopus.movement();
}

//user gets the choice to start a new game
function startAnotherGame() {
    text("Press ENTER to start a new game.", width / 2, height / 2 + 15);
    if (keyIsPressed) {
        if (keyCode === ENTER) {
            resetValues();
        }
    }
}

//user lost the round
function userLost() {
    background(0);
    fill(255);
    text("You Lost.", width / 2, height / 2 - 15);
    startAnotherGame();
}

//resets all the values, user started a new game
function resetValues() {
    gameOver = false;
    gameStart = true;
    gameWon = false;
    lives = 50;
    defeated = 0;
    level = 0;
    ink = [];
    fish = [];
    score = 0;
}

//handles everything regarding the score
function displayScore() {
    //calculate this round's score
    score = lives * defeated;

    //check if the score was high score
    if (score > highScore) {
        highScore = score;
    }

    //store high score
    window.localStorage.setItem('highScore', highScore);

    //display score to user
    background(0);
    fill(255);
    text("You won. SCORE: " + score, width / 2, height / 2 - 15);

    startAnotherGame();
}

//lets the user choose difficulty
function chooseDifficulty(event) {
    fill(255);
    if (!(event.currentTarget.value == "Select difficulty")) {
        level = event.currentTarget.value;
        startAnotherGame();
        instancesCharacters();
    }
}

//create instances of all characters
function instancesCharacters() {

    //user controlled character
    octopus = new Octopus();

    //ink bottles
    for (let i = 0; i < 10 / level; i++) {
        ink.push(new InkBottle());
    }

    //fishes
    for (let i = 0; i < level; i++) {
        fish.push(new Fish());
    }

    //game is ready to start
    gameStart = false;
}

//visuals for the game plan
function visuals() {
    imageMode(CORNER);
    image(seabed, 0, 0, seabed.width, seabed.height, 0, seabed.height - 500, seabed.width, seabed.height);
    fill(255);
    textSize(20);
    text("Lives: " + lives, 58, 30);
    text("Fishes Defeated: " + defeated + "/" + level, 110, 60);
}

//class for ink bottles
class InkBottle {
    constructor() {
        this.graphic = inkBottle;
        this.x = random(width - this.graphic.width);
        this.y = random(height - this.graphic.height);
        this.size = 1.7;
        this.xNoise = random(500);

    }

    //displays the ink bottles
    visuals() {
        image(this.graphic, this.x, this.y, inkBottle.width * this.size, inkBottle.height * this.size);

        //checks if octopus picked up ink bottle
        if (dist(octopus.x + 40, octopus.y + 45, this.x + 28, this.y + 25) < 25) {
            this.y = -100;
            inkPickUp.play();
            inkReady = true;
        }
    }

    //movement ink bottles
    movement() {
        this.y += 0.7;
        this.x += map(noise(this.xNoise), 0, 1, -2, 2);

        //movement limitations
        if (this.y > height) {
            this.y = -20;
        }
        if (this.x > width) {
            this.x = 0;
        }
        if (this.x < 0) {
            this.x = width;
        }
        this.xNoise += random(0.1);
    }
}

//class for fish
class Fish {
    constructor() {
        this.graphic = fishIdle;
        this.x = random(width - 120);
        this.y = random(height - 80);
        this.xSpeed = random((level / 3), level);
        this.ySpeed = random((level / 3), level);
        this.size = random(1.3, 4);
        this.alive = true;
        this.animationFrame = 0;

    }

    //display fishes
    visuals() {
        image(this.graphic, this.x, this.y, 50 * this.size, 50 * this.size, this.animationFrame * 48, 0, 48, 48);

        if (frameCount % 5 == 0) {
            this.animationFrame += 1;
        }

        if (this.animationFrame >= 4) {
            this.animationFrame = 0;
        }

    }

    //movement fishes
    movement() {
        //if the fish is still alive, it should move
        if (this.alive) {
            this.x += this.xSpeed;
            this.y += this.ySpeed;

            //movement limitation
            if (this.x >= width - 100) {
                this.xSpeed *= -1;
            }
            if (this.x <= 0) {
                this.xSpeed *= -1;
            }
            if (this.y >= height - 80) {
                this.ySpeed *= -1;
            }
            if (this.y <= 0) {
                this.ySpeed *= -1;
            }
        }
        this.xSpeed += 0.01;
        this.ySpeed += 0.01;
    }

    //checks if any of the fishes have hurted the octopus
    checkIfOctopusHurt() {
        if (dist(octopus.x + 40, octopus.y + 45, this.x + 20 * this.size, this.y + 25 * this.size) < 25) {
            lives -= 1;
            if (frameCount % 5 === 0) {
                octopusHurt.play();
            }
            // if octopus lost all its lives, the game is over
            if (lives == 0) {
                gameOver = true;
            }
        }
    }
    //checks if ink has hurted any of the fishes
    checkIfFishHurt() {
        if (dist(octopus.xInk - 20, octopus.yInk, this.x + 20 * this.size, this.y + 20 * this.size) < 25) {
            //if fish is hit by ink, it sizes decreases
            this.size -= 0.5;
            fishHurt.play();
            //if fish size equals 1.3, it is considered defeated
            if (this.size <= 1.3) {
                this.alive = false;
                this.y = -100;
                defeated += 1;
                if (defeated == level) {
                    gameWon = true;
                    gameOver = true;
                }
            }
        }
    }
}

//class for octopus
class Octopus {
    constructor() {
        this.graphic = octopusIdle;
        this.x = width / 2;
        this.y = height / 2;
        this.xSpeed = 3;
        this.ySpeed = 3;
        this.size = 5;
        this.xInk;
        this.yInk;
        this.radiusInk = 35;
        this.animationFrame = 0;
        this.frameInk = 0;
        this.sizeInk = 200;
    }
    //visuals octopus
    visuals() {
        fill(255);
        image(this.graphic, this.x, this.y, 100, 100, this.animationFrame * 48, 0, 48, 48);

        if (frameCount % 7 == 0) {
            this.animationFrame += 1;
        }

        if (this.animationFrame >= 6) {
            this.animationFrame = 0;
        }
    }
    //movemet octopus
    movement() {
        if (keyIsDown(68)) {
            this.x += this.xSpeed;
        }
        if (keyIsDown(65)) {
            this.x -= this.xSpeed;
        }
        if (keyIsDown(83)) {
            this.y += this.ySpeed;
        }
        if (keyIsDown(87)) {
            this.y -= this.ySpeed;
        }

        //limit movement
        if (this.x > width - 35) {
            this.x = width - 35;
        }
        if (this.x < -35) {
            this.x = -35;
        }
        if (this.y > height - this.graphic.height) {
            this.y = height - this.graphic.height;
        }
        if (this.y < -this.graphic.height / 2) {
            this.y = -this.graphic.height / 2;
        }
        
        //ink that has been released
        image(inkSplash, this.xInk - (inkSplash.width*1.1), this.yInk - (inkSplash.height/8), this.sizeInk, this.sizeInk, 0, this.frameInk * 96, 96, 96);
       
        if (frameCount % 5 == 0) {
            this.frameInk += 1;
        }

        if (this.frameInk >= 6) {
            this.frameInk = 0;
        }
        this.sizeInk -= 0.3;
        this.yInk += 1;
    }

    releaseInk() {
        //user press space to release ink
        //checks if the user has picked up any ink bottle
        if (keyIsDown('32') && inkReady) {
            this.xInk = this.x + 80;
            this.yInk = this.y + 100;
            inkRelease.play();
            inkReady = false;
            this.sizeInk = 200;
        }
    }
}
