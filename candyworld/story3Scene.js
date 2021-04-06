class story3Scene extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'story3Scene' });
    }


    preload() {
        this.load.image('story3','assets/rules.png');

    }

    create () {

        this.add.image(0, 0, 'story3').setOrigin(0, 0);

        this.add.text(50, 550, ' ', { font: '24px Courier', fill: '#000000' });

        console.log("This is story3Scene");

        var spaceDown = this.input.keyboard.addKey('SPACE');
        
        spaceDown.on('down', function(){
        console.log("Spacebar pressed, goto level1");
        this.scene.stop("story3Scene");
        this.scene.start("level1");
        }, this );

    }

}
