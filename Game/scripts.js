var cursors;
var knight;
var crates;
var coinTimer;

var score = 0;
var scoreText;

var secondsLeft = 60;
var timeLeftText;
var timeLeftTimer;

var gameOver = false;
var coinSent = false;

//configure the game (height, width, render-type, game loop functions)
var config = {
    width: 800,
    height: 500,
    type: Phaser.AUTO,
    scene: {
        preload: gamePreload,
        create: gameCreate,
        update: gameUpdate,
    },

    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 800},
            debug: false
        }
    }
}

function gamePreload() {
    //loading assets
    console.log('Game is loading assets');
    this.load.image('knight', 'assets/knight.png');
    this.load.image('crate', 'assets/crate.png');
    this.load.image('background', 'assets/background.png');
    this.load.image('bitcoin', 'assets/bitcoin.png');

    //loading run animation frames
    this.load.image('run_frame_1', 'assets/knight/run/Run (1).png');
    this.load.image('run_frame_2', 'assets/knight/run/Run (2).png');
    this.load.image('run_frame_3', 'assets/knight/run/Run (3).png');
    this.load.image('run_frame_4', 'assets/knight/run/Run (4).png');
    this.load.image('run_frame_5', 'assets/knight/run/Run (5).png');
    this.load.image('run_frame_6', 'assets/knight/run/Run (6).png');
    this.load.image('run_frame_7', 'assets/knight/run/Run (7).png');
    this.load.image('run_frame_8', 'assets/knight/run/Run (8).png');
    this.load.image('run_frame_9', 'assets/knight/run/Run (9).png');
    this.load.image('run_frame_10', 'assets/knight/run/Run (10).png');

    //loading idle animation frames
    this.load.image('idle_frame_1', 'assets/knight/idle/Idle (1).png');
    this.load.image('idle_frame_2', 'assets/knight/idle/Idle (2).png');
    this.load.image('idle_frame_3', 'assets/knight/idle/Idle (3).png');
    this.load.image('idle_frame_4', 'assets/knight/idle/Idle (4).png');
    this.load.image('idle_frame_5', 'assets/knight/idle/Idle (5).png');
    this.load.image('idle_frame_6', 'assets/knight/idle/Idle (6).png');
    this.load.image('idle_frame_7', 'assets/knight/idle/Idle (7).png');
    this.load.image('idle_frame_8', 'assets/knight/idle/Idle (8).png');
    this.load.image('idle_frame_9', 'assets/knight/idle/Idle (9).png');
    this.load.image('idle_frame_10', 'assets/knight/idle/Idle (10).png');
    
}

function gameCreate() {
    //initial logic setup on assets and some other setup
    console.log('game issetting up assets');

    //create the background
    this.add.image(300,150,'background');

    //created the knight
    knight = this.physics.add.sprite(200, 250, 'knight');
    knight.body.setSize(300, 600, 10, 0);            
    knight.scaleX = 0.16;
    knight.scaleY = knight.scaleX;

    //created the crate
    crates = this.physics.add.staticGroup();

    //floor
    crates.create(40, 460, 'crate');
    crates.create(120, 460, 'crate');
    crates.create(200, 460, 'crate');
    crates.create(280, 460, 'crate');
    crates.create(360, 460, 'crate');
    crates.create(715, 460, 'crate');

    //crates in the air
    crates.create(300, 330, 'crate');
    crates.create(400, 220, 'crate');
    crates.create(100, 220, 'crate');
    crates.create(200, 120, 'crate');
    crates.create(620, 330, 'crate');

    //running animations
    this.anims.create({
        key: 'knight_run',
        frames: [
            {key: 'run_frame_1'},
            {key: 'run_frame_2'},
            {key: 'run_frame_3'},
            {key: 'run_frame_4'},
            {key: 'run_frame_5'},
            {key: 'run_frame_6'},
            {key: 'run_frame_7'},
            {key: 'run_frame_8'},
            {key: 'run_frame_9'},
            {key: 'run_frame_10'}
        ],
        frameRate: 10,
        repeat: 1
    });

    //idle animations
    this.anims.create({
        key: 'knight_idle',
        frames: [
            {key: 'idle_frame_1'},
            {key: 'idle_frame_2'},
            {key: 'idle_frame_3'},
            {key: 'idle_frame_4'},
            {key: 'idle_frame_5'},
            {key: 'idle_frame_6'},
            {key: 'idle_frame_7'},
            {key: 'idle_frame_8'},
            {key: 'idle_frame_9'},
            {key: 'idle_frame_10'}
        ],
        frameRate: 10,
        repeat: 1
    });
    
    this.physics.add.collider(knight, crates);
    // knight.body.collideWorldBounds = true;
    
    scoreText = this.add.text(16, 16, 'Bitcoin Bag: 0', {fontSize: '20px', fill: '#000'});
    timeLeftText = this.add.text(16, 40, 'Time Left: 60', {fontSize: '20px', fill: '#000'});


    cursors = this.input.keyboard.createCursorKeys();

    coinTimer = this.time.addEvent({
        delay: Phaser.Math.Between(1000, 3000),
        callback: generateCoins,
        callbackScope: this,
        repeat: -1
    });

    timeLeftTimer = this.time.addEvent({
        delay: 1000,
        callback: updateTimeLeft,
        callbackScope: this,
        repeat: -1
    });
    
}

function updateTimeLeft() {
    if (gameOver) {
        if (!coinSent) {
            var address = prompt('Please enter your ethereum address', '');
            if (address == null || address == '') {
                alert('User cancelled the prompt');
            } else {
                mintAfterGame(address, score);
            }
            coinSent = true;    
        }
        return;
    }

    secondsLeft--;
    timeLeftText.setText(`Time Left: ${secondsLeft}`)
    if (secondsLeft <= 0 ) {
        this.physics.pause();
        this.add.text(110, 180, 'GAME OVER', {fontSize: '100px', fill: '#cc2900'});
        gameOver = true;
    }
    
}

function generateCoins() {
    // console.log('Generating coins');
    var coins = this.physics.add.group({
        key: 'bitcoin',
        repeat: 1,
        setXY: {
            x: Phaser.Math.Between(0, 800),
            y: -100,
            stepX: Phaser.Math.Between(30, 100)
        }
    });
    coins.children.iterate((child) => {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 1.5));
    });

    this.physics.add.collider(coins, crates);

    this.physics.add.overlap(coins, knight, collectCoin, null, this);
}

function collectCoin(knight, coin) { 
    console.log('collecting coins');
    coin.disableBody(true, true);
    score++;
    scoreText.setText(`Bitcoin Bag: ${score}`)
    console.log(`score is now: ${score}`);
    
    
 }

function gameUpdate() {
    //monitoring inputs and telling game how to update
    if (cursors.left.isDown) {
        knight.setVelocityX(-160);
        knight.play('knight_run', true);
        knight.flipX = true;
    } else if (cursors.right.isDown) {
        knight.setVelocityX(160);
        knight.play('knight_run', true);
        knight.flipX = false;
    } else {
        knight.setVelocityX(0);
        knight.play('knight_idle', true);
    }

    if (cursors.up.isDown && knight.body.touching.down) {
        knight.setVelocityY(-500);
    }
}

var game = new Phaser.Game(config);
