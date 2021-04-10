// static enemies
class level3 extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'level3' });
        this.candy = 0
        this.liveCount = 3
        this.candyCount = 0;
    }

preload() {

    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map3', 'assets/level3.json');
    
    this.load.spritesheet('tiles3', 'assets/tiles3.png', {frameWidth: 64, frameHeight: 64});

    this.load.atlas('player','assets/character.png', 'assets/character.json' );

    this.load.image('heart','assets/heart.png' );

    this.load.atlas('enemy','assets/alien.png', 'assets/alien.json' ); 

    // mp3
    this.load.audio('collect','assets/collectcandy.mp3');
    this.load.audio('bgmusic','assets/bgm.mp3');
    this.load.audio('hit','assets/enemy.mp3');

}

create() {

    this.map3 = this.make.tilemap({key: 'map3'});
    
    // Must match tileSets name
    let Tiles3 = this.map3.addTilesetImage('tiles3', 'tiles3');

    this.collectSnd = this.sound.add('collect');
    this.hitSnd = this.sound.add('hit');
    this.bgmusicSnd = this.sound.add('bgmusic');

    this.bgmusicSnd = this.sound.add('bgmusic', {volume: 0.1});
    this.bgmusicSnd.play();
    
    this.bgmusicSnd.loop = true;

    // create the ground layer
    this.backgroundLayer = this.map3.createDynamicLayer('backgroundLayer', Tiles3, 0, 0);
    this.pillarsLayer = this.map3.createDynamicLayer('pillarsLayer', Tiles3, 0, 0);
    this.obstaclesLayer = this.map3.createDynamicLayer('obstaclesLayer', Tiles3, 0, 0);
    this.exitLayer = this.map3.createDynamicLayer('exitLayer', Tiles3, 0, 0);
    this.candyLayer = this.map3.createDynamicLayer('candyLayer', Tiles3, 0, 0);

    // Set starting and ending position using name
    this.startPoint = this.map3.findObject('exitobject', obj => obj.name === 'startPoint');
    this.endPoint = this.map3.findObject('exitobject', obj => obj.name === 'endPoint');

    // console.log( this.pillarsLayer.width, this.pillarsLayer.height );
    console.log( this.startPoint.x, this.startPoint.y);

    // create the player sprite    
    this.player = this.physics.add.sprite(200, 200, 'player');
    this.player.setBounce(0.1); // our this.player will bounce from items
    
    // small fix to our this.player images, we resize the physics body object slightly
    this.player.setCollideWorldBounds(true); // don't go out of the map  

    // Set this.player to starting position
    this.player.setPosition(0, 0);  

    // set the boundaries of our game world
    this.physics.world.bounds.width = this.pillarsLayer.width;
    this.physics.world.bounds.height = this.pillarsLayer.height;

    // the this.player will collide with this layer
    this.pillarsLayer.setCollisionByProperty({ pillars: true });
    this.obstaclesLayer.setCollisionByProperty({ obstacles: true });
    
    this.physics.add.collider(this.pillarsLayer, this.player);
    this.physics.add.collider(this.obstaclesLayer, this.player);
    this.physics.add.collider(this.candyLayer, this.player);

    this.heart1 = this.add.image(50,530, 'heart').setScrollFactor(0);
    this.heart2 = this.add.image(110,530,'heart').setScrollFactor(0);
    this.heart3 = this.add.image(170,530,'heart').setScrollFactor(0);

    // create alien animation
this.anims.create({
    key:'alien_eye',
    frames:[
        {key: 'enemy', frame: 'alien_01'},
        {key: 'enemy', frame: 'alien_02'},
        {key: 'enemy', frame: 'alien_03'},
        {key: 'enemy', frame: 'alien_04'},
    ],
    
frameRate:10,
repeat: -1
});

this.time.addEvent({ delay: 1000, callback: this.moveDownUp, callbackScope: this, loop: false });
this.time.addEvent({ delay: 1000, callback: this.moveLeftRight, callbackScope: this, loop: false });
this.time.addEvent({ delay: 1000, callback: this.moveUpDown, callbackScope: this, loop: false });
this.time.addEvent({ delay: 1000, callback: this.moveRightLeft, callbackScope: this, loop: false });

//  alien
this.alien1 = this.physics.add.sprite(550, 350, 'enemy').setScale(0.8).play('alien_eye');
this.alien2 = this.physics.add.sprite(900, 800, 'enemy').setScale(0.8).play('alien_eye');
this.alien3 = this.physics.add.sprite(1450, 600, 'enemy').setScale(0.8).play('alien_eye');
this.alien4 = this.physics.add.sprite(1850, 800, 'enemy').setScale(0.8).play('alien_eye');

//overlap cat
this.physics.add.overlap(this.player, this.alien1, this.hitalien, null, this );
this.physics.add.overlap(this.player, this.alien2, this.hitalien, null, this );
this.physics.add.overlap(this.player, this.alien3, this.hitalien, null, this );
this.physics.add.overlap(this.player, this.alien4, this.hitalien, null, this );

this.physics.add.collider(this.pillarsLayer, this.alien1);
this.physics.add.collider(this.pillarsLayer, this.alien2);
this.physics.add.collider(this.pillarsLayer, this.alien3);
this.physics.add.collider(this.pillarsLayer, this.alien4);

    //   collect candy
    this.candyLayer.setTileIndexCallback(12, this.collectcandy, this);

    this.anims.create({
        key:'left',
        frames:[
            {key:'player',frame:'monster_walk01'},
            {key:'player',frame:'monster_walk02'},
            {key:'player',frame:'monster_walk03'},
            {key:'player',frame:'monster_walk04'},
        ],
        frameRate:10,
        repeat: -1
    });

    this.anims.create({
        key:'front',
        frames:[
            {key:'player',frame:'monster_front'},
        
        ],
        frameRate:10,
        repeat: -1
    });

    this.anims.create({
        key:'back',
        frames:[
            {key:'player',frame:'monster_back'},
        ],
        frameRate:10,
        repeat: -1
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    // this text will show the score
    this.candyText = this.add.text(650, 50, this.candyCount, {
        fontSize: '30px',
        fill: '#221C48'
        });

    // fix the text to the camera
    this.candyText.setScrollFactor(0);
    this.candyText.visible = true;

    this.anims.create({
    key: this.player,
    frames: [{key: this.player, frame: this.player}],
    frameRate: 10,
    });

  // set bounds so the camera won't go outside the game world
  this.cameras.main.setBounds(0, 0, this.map3.widthInPixels, this.map3.heightInPixels);
  // make the camera follow the this.player
  this.cameras.main.startFollow(this.player);

  // set background color, so the sky is not black    
  this.cameras.main.setBackgroundColor('#ccccff');

}  

update() {

    if (this.cursors.left.isDown)
    {
        this.player.body.setVelocityX(-300);
        this.player.anims.play('left', true); // walk left
        this.player.flipX = false; // flip the sprite to the left
    }
    else if (this.cursors.right.isDown)
    {
        this.player.body.setVelocityX(300);
        this.player.anims.play('left', true);
        this.player.flipX = true; // use the original sprite looking to the right
    } else {
        this.player.body.setVelocityX(0);
        this.player.anims.play('front', true);
    }
    // jump 
    if (this.cursors.up.isDown && this.player.body.onFloor())
    {
        this.player.body.setVelocityY(-500);   
        this.player.anims.play('front', true);    
    }

    // Check for reaching endPoint object
    if ( this.player.x >= this.endPoint.x && this.player.y >= this.endPoint.y && this.candy > 9 ) {
        console.log('Reached endPoint, loading next level');
        this.bgmusicSnd.stop();
        this.scene.stop("level3");
        this.scene.start("mainScene");
    }
    
}

collectcandy(player,tile) {
    this.candy++;
    console.log('Collect Candy', this.candy);
    this.candyLayer.removeTileAt(tile.x, tile.y);
    this.candyCount += 1;
    this.collectSnd.play();
    this.candyText.setText(this.candyCount);
    return false;
}
    
    hitalien(player, sprite) {
        //bombs.disableBody(true, true);
        sprite.disableBody(true, true);
        this.liveCount -= 1;
        this.hitSnd.play();
        console.log('Hit alien, deduct heart, balance is',this.liveCount);
    
        // Default is 3 lives
        if ( this.liveCount === 2) {
            // this.explodeSnd.play();
            this.cameras.main.shake(100);
            this.heart3.setVisible(false);
        } else if ( this.liveCount === 1) {
            // this.explodeSnd.play();
            this.cameras.main.shake(100);
            this.heart2.setVisible(false);
        } else if ( this.liveCount === 0) {
            // this.explodeSnd.play();
            this.cameras.main.shake(500);
            this.heart1.setVisible(false);
            this.isDead = true;
        }
    
        // No more lives, shake screen and restart the game
        if ( this.isDead ) {
        console.log("Player is dead!!!")
        // delay 1 sec
        this.time.delayedCall(2000,function() {
            // Reset counter before a restart
            this.isDead = false;
            this.liveCount = 3;
            this.scene.restart();
        },[], this);
        }
    
    }

    moveDownUp() {
        console.log('moveDownUp')
        this.tweens.timeline({
            targets: this.alien1,
            ease: 'Linear',
            loop: -1, // loop forever
            duration: 2000,
            tweens: [
        
            {
                y: 100,
            },
            {
                y: 350,
            },
        ]
        });
    }

    moveLeftRight() {
        console.log('moveLeftRight')
        this.tweens.timeline({
            targets: this.alien2,
            ease: 'Linear',
            loop: -1, // loop forever
            duration: 2000,
            tweens: [
        
            {
                x: 700,
            },
            {
                x: 900,
            },
        ]
        });
    }

    moveUpDown() {
        console.log('moveUpDown')
        this.tweens.timeline({
            targets: this.alien3,
            ease: 'Linear',
            loop: -1, // loop forever
            duration: 2000,
            tweens: [
        
            {
                y: 300,
            },
            {
                y: 600,
            },
        ]
        });
    }


    moveRightLeft() {
        console.log('moveRightLeft')
        this.tweens.timeline({
            targets: this.alien4,
            ease: 'Linear',
            loop: -1, // loop forever
            duration: 2000,
            tweens: [
        
            {
                x: 1650,
            },
            {
                x: 1850,
            },
        ]
        });
    }
    
}