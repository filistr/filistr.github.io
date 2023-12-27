function preload() {
    //INGREDIENTS IMAGES
    //Bakery
    cupcakeImage = loadImage('images/ingredients/bakery/cupcake.png');

    //Pizza
    cheeseImage = loadImage('images/ingredients/pizza/cheese.png');
    sausageImage = loadImage('images/ingredients/pizza/sausage.png');

    //Sushi
    riceImage = loadImage('images/ingredients/sushi/ricebowl.png'); 
    salmonImage = loadImage('images/ingredients/sushi/salmon.png'); 

    //Burger
    breadImage = loadImage('images/ingredients/burger/burgerbread.png');
    tomatoImage = loadImage('images/ingredients/burger/tomato.png');

    //TOWER IMAGES
    pizzaTowerImage = loadImage('images/towers/pizzaTowerRed.png');
    bakeryTowerImage = loadImage('images/towers/bakeryTowerPink1.png');
    sushiTowerImage = loadImage('images/towers/sushiTowerBlack.png');
    burgerTowerImage = loadImage('images/towers/burgerTowerBrown.png');
    superTowerImage = loadImage('images/towers/superTowerGold.png');
    missingImage = loadImage('images/missingImage.jpg');
    lockImage = loadImage('images/lock2.png');

    //BACKGROUND IMAGES
    mountainImage = loadImage('images/background/ice/mountain.png');
    cactusImage = loadImage('images/background/desert/cactus.png');
    treeImage =  loadImage('images/background/forest/tree.png');
    icicleImage = loadImage('images/background/ice/icicle.png');

    //SOUNDS
    purchaseSound = loadSound('sounds/mixkit-winning-a-coin-video-game-2069.wav'); 
    collectIngredientSound = loadSound('sounds/collectIngredient.wav'); 
    gameOverSound = loadSound('sounds/mixkit-arcade-space-shooter-dead-notification-272.wav');
    levelWonSound = loadSound('sounds/mixkit-casino-bling-achievement-2067.wav');
    upgradeSound = loadSound('sounds/mixkit-arcade-video-game-bonus-2044.wav');
    sellSound = loadSound('sounds/coin-donation-2-180438.mp3');
    buttonSound = loadSound('sounds/punch-1-166694.mp3');
    startLevelSound = loadSound('sounds/punch-3-166696.mp3');
    backgroundSound = loadSound('sounds/cruising-down-8bit-lane-159615.mp3');

    //JSON
    turnData = loadJSON("data/turns.json");
    config = loadJSON("data/config.json");

    // FONT
    font = loadFont('fonts/FuturaHeavy.otf'); 
}

