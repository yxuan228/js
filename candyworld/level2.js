// static enemies
class level2 extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'level2' });


    }

preload() {

    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map2', 'assets/level2.json');
    
    this.load.spritesheet('tiles2', 'assets/tiles2.png', {frameWidth: 64, frameHeight: 64});

    this.load.atlas('player','assets/character.png', 'assets/character.json' );

    this.load.image('heart','assets/heart.png' );

    // this.load.atlas('enemy','assets/alien.png', 'assets/alien.json' );

    // this.load.atlas('robot', 'assets/robot.png', 'assets/robot.json');  

}

create() {

    this.map2 = this.make.tilemap({key: 'map2'});
    
    // Must match tileSets name
    let Tiles2 = this.map2.addTilesetImage('tiles2', 'tiles2');

    // create the ground layer
    this.backgroundLayer = this.map2.createDynamicLayer('backgroundLayer', Tiles2, 0, 0);
    this.pillarsLayer = this.map2.createDynamicLayer('pillarsLayer', Tiles2, 0, 0);
    this.obstaclesLayer = this.map2.createDynamicLayer('obstaclesLayer', Tiles2, 0, 0);
    this.exitLayer = this.map2.createDynamicLayer('exitLayer', Tiles2, 0, 0);
    this.candyLayer = this.map2.createDynamicLayer('candyLayer', Tiles2, 0, 0);

    // // alien position
    // this.alien = map2.findObject("objectLayer", obj => obj.name === "alien");

    // // Set starting and ending position using name
    // this.startPoint = this.map.findObject('exitobject', obj => obj.name === 'startPoint');
    // this.endPoint = this.map.findObject('exitobject', obj => obj.name === 'endPoint');

    // this.player = this.physics.add.sprite(this.startPoint.x, this.startPoint.y, 'player');
    // this.player.setScale(1);
    //     this.player.setCollideWorldBounds(true);

    //     window.player = this.player

    console.log( this.pillarsLayer.width, this.pillarsLayer.height );

    // create the player sprite    
    this.player = this.physics.add.sprite(200, 200, 'player');
    this.player.setBounce(0.1); // our this.player will bounce from items
    
    // small fix to our this.player images, we resize the physics body object slightly
    this.player.setCollideWorldBounds(true); // don't go out of the map  

    // Set this.player to starting position
    //this.player.setPosition(this.startPoint.x, this.startPoint.y);  
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
    this.Heart3 = this.add.image(170,530,'heart').setScrollFactor(0);

//     // create cat animation
// this.anims.create({
//     key:'alien_eye',
//     frames:[
//         {key: 'alien', frame: 'alien_01'},
//         {key: 'alien', frame: 'alien_02'},
//         {key: 'alien', frame: 'alien_03'},
//         {key: 'alien', frame: 'alien_04'},
       
//     ],
    
// frameRate:10,
// repeat: -1
// });

// this.time.addEvent({ delay: 1000, callback: this.moveRightLeft1, callbackScope: this, loop: false });
// this.time.addEvent({ delay: 1000, callback: this.moveRightLeft2, callbackScope: this, loop: false });

// this.alien1 = this.physics.add.sprite(550, 350, 'alien').setScale(0.8).play('alien_eye');
// this.alien2 = this.physics.add.sprite(550, 480, 'alien').setScale(0.8).play('alien_eye');

// //overlap cat
// this.physics.add.overlap(this.player, this.alien1, this.hitalien, null, this );
// this.physics.add.overlap(this.player, this.alien2, this.hitalien, null, this );


    


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

    // // alien movement
    // moveRightLeft1() {
    //     console.log('moveleft')
    //     this.tweens.timeline({
    //        targets: this.cat1,
    //        loop: -1, // loop forever
    //        ease: 'Linear',
    //        duration: 2000,
    //         tweens: [
    //        {
    //           x: 900,
    //        },
    //         {
    //           x: 550,
    //        },
    //      ]
    //      });
    //     }

    

    this.cursors = this.input.keyboard.createCursorKeys();

  // set bounds so the camera won't go outside the game world
  this.cameras.main.setBounds(0, 0, this.map2.widthInPixels, this.map2.heightInPixels);
  // make the camera follow the this.player
  this.cameras.main.startFollow(this.player);

  // set background color, so the sky is not black    
  this.cameras.main.setBackgroundColor('#ccccff');

}


      
// remove candy
// collectcandy(player, Tiles) {
//     console.log('candy', Tiles.index );
//     this.candyLayer.removeTileAt(tile.x, tile.y); // remove the item
//     return false;
//     }
    collectcandy(player,tile) {
        this.candy++;
        console.log('Collect Candy', this.candy);
        this.candyLayer.removeTileAt(tile.x, tile.y);
        return false;
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

    // // Check for reaching endPoint object
    // if ( this.player.x >= this.endPoint.x && this.player.y >= this.endPoint.y && this.candy > 1 ) {
    //     console.log('Reached endPoint, loading next level');
    //     this.scene.stop("level1");
    //     this.scene.start("level2");
    // }

    

    // // Check for reaching endPoint object
    // if ( this.player.x >= 2210 && this.player.y >= 40 && this.candy > 1 ) {
    //     console.log('Reached End, level1');
    //     // window.music1.stop();
    //     //this.cameras.main.shake(500);
    //     this.time.delayedCall(1000,function() {
    //      this.scene.start("level2");
    //     },[], this);
    //     }

    if ( this.liveCount === 2) {
        this.heart3.setVisible(true);
    } else if ( this.liveCount === 2) {
        this.heart2.setVisible(true);
    } else if ( this.liveCount === 0) {
        this.heart1.setVisible(true);
    }

    // hitalien(player, sprite){
    //     console.log("hitalien");
           
    //     sprite.disableBody (true, true);
    //     // this.bgmusicSnd.loop = false
    //     // this.bgmusicSnd.stop();
    //     // this.hitSnd.play();
    //     this.time.delayedCall(500,function() {
    //     this.meatCount = 0
    //     this.scene.start('faillevel2');
    //     },[], this);
        
           
    //     return false;
    //     }


    
}


}