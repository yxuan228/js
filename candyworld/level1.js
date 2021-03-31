// collect candy, no enemy
class level1 extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'level1' });
        this.candy = 0
        this.candyCount = 0;
        
    }

preload() {

    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/level1.json');
    
    this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth: 64, frameHeight: 64});

    this.load.atlas('player','assets/character.png', 'assets/character.json' );

    // this.load.image('heart','assets/heart.png' );

}

create() {

    this.map = this.make.tilemap({key: 'map'});
    
    // Must match tileSets name
    let Tiles = this.map.addTilesetImage('tiles', 'tiles');

    // create the ground layer
    this.backgroundLayer = this.map.createDynamicLayer('backgroundLayer', Tiles, 0, 0);
    this.pillarsLayer = this.map.createDynamicLayer('pillarsLayer', Tiles, 0, 0);
    this.obstaclesLayer = this.map.createDynamicLayer('obstaclesLayer', Tiles, 0, 0);
    this.exitLayer = this.map.createDynamicLayer('exitLayer', Tiles, 0, 0);
    this.candyLayer = this.map.createDynamicLayer('candyLayer', Tiles, 0, 0);

    // Set starting and ending position using name
    this.startPoint = this.map.findObject('exitobject', obj => obj.name === 'startPoint');
    this.endPoint = this.map.findObject('exitobject', obj => obj.name === 'endPoint');

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

    // this.heart1 = this.add.image(50,530, 'heart').setScrollFactor(0);
    // this.heart2 = this.add.image(100,530,'heart').setScrollFactor(0);
    // this.Heart3 = this.add.image(150,530,'heart').setScrollFactor(0);

    


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
  this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
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
        this.candyCount += 1;
        this.candyText.setText(this.candyCount);
        return false;
    }

    // collectSapling(player, sprite){
    //     console.log("Sapling collected");
    //     this.score = this.score + 1 ;
    //     this.collectSnd.play();
    //     this.saplingText.setText(this.score);
    //     sprite.disableBody (true, true);
        
    //     return false;
    //     }
  

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
    if ( this.player.x >= this.endPoint.x && this.player.y >= this.endPoint.y && this.candy > 5 ) {
        console.log('Reached endPoint, loading next level');
        this.scene.stop("level1");
        this.scene.start("level2");
    }

    

    // // Check for reaching endPoint object
    // if ( this.player.x >= 2210 && this.player.y >= 40 && this.candy > 1 ) {
    //     console.log('Reached End, level1');
    //     // window.music1.stop();
    //     //this.cameras.main.shake(500);
    //     this.time.delayedCall(1000,function() {
    //      this.scene.start("level2");
    //     },[], this);
    //     }

    // if ( this.liveCount === 2) {
    //     this.heart3.setVisible(true);
    // } else if ( this.liveCount === 2) {
    //     this.heart2.setVisible(true);
    // } else if ( this.liveCount === 0) {
    //     this.heart1.setVisible(true);
    // }

    
}


}