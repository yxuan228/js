class storyScene extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'storyScene' });
    }

    preload() {
        this.load.image('story','assets/storyline.png');
    }

    create () {

        this.add.image(0, 0, 'story').setOrigin(0, 0);

        this.add.text(0, 580, ' ', { font: '24px Courier', fill: '#000000' });

        console.log("This is storyScene");

        //this.input.once('pointerdown', function(){
        var spaceDown = this.input.keyboard.addKey('SPACE');
        
        spaceDown.on('down', function(){
        console.log("Spacebar pressed, goto story2Scene");
        this.scene.stop("storyScene");
        this.scene.start("story2Scene");
        }, this );

    }

}
