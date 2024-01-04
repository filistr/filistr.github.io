let canvas;

// IMAGES
// ingredients
let cupcakeImage, cheeseImage, breadImage, tomatoImage, sausageImage, salmonImage, riceImage; 
let ingredientImages = new Object();
let menuIngredientImages = []; 

// towers
let pizzaTowerImage, bakeryTowerImage, sushiTowerImage, burgerTowerImage; 
let missingImage, lockImage;

//background
let mountainImage;
let scyscraperImage;
let treeImage;
let backgroundImage;
let icicleImage; 

// INSTANCES
// ingredients
let ingredientCollection = []; 
let ingredientSpeed = 2;
let ingredientNum = 0;
let cumulativeSpawnNum = 0;
let startX, startY, startDir;

// towers
let towerPurchased = [];

// turn data
let turnData;
let world;

// game configuration data
let config;

// CONTROL PANEL
// score system
let lives = 10;
let money = 4000;
let needMoreMoney = false;
let timeNeedMoreMoney = 10;
let start = false;
let level;
let menu = {
    "pizza": {
        menuX: 1220,
        menuY: 350,
        price: 1600,
        captureNumMax: 4
    },
    "bakery": {
        menuX: 1080,
        menuY: 180,
        price: 700,
        captureNumMax: 1
    },
     "burger": {
        menuX: 1220,
        menuY: 180,
        price: 1000,
        captureNumMax: 2
    },
     "sushi": {
       menuX: 1080,
        menuY: 350,
        price: 1300,
        captureNumMax: 2
    },
    "super": {
        menuX: 1150,
        menuY: 530,
        price: 7000,
        captureNumMax: 5,
    }
};

//HITMAP
let buffer; 

//SOUNDS
let purchaseSound; 
let collectIngredientSound;  
let gameOverSound; 
let levelWonSound; 
let buttonSound; 
let upgradeSound;
let sellSound;
let startRoundSound;
let backgroundSound;

// FONT
let font; 

// GAME STATE
// 0 - welcome screen; 1 - game playing; 2 - game over; 3 - win the whole game
let state = 0;

//COLOR
//index 0-2 menu, upgrade buttons, next round, game over screen
//index 3-5 path, price display, money & lives text
//index 6-8 background color, start & restart buttons, bar
let forestColor = [1, 50, 32, 234, 221, 202, 138, 154, 91]; //188
let desertColor = [68, 40, 40, 255, 248, 220, 225, 198, 153];
let iceColor = [126, 167, 235, 250, 250, 255, 192, 223, 255];
let colorPalette = [];

//WAVE
let widthBar;
let heightBar;
let speedBar;
let wave = 1;
let ingredientTypeWave;
let nextWaveIndgredient;
let towerTypeWave;
let waveOngoing = false;
let switchColor = 1;
let colorTime = 20;

// DELAY
const delay = 1000;



