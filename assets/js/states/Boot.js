var ChampGame = {};

ChampGame.Boot = function() {};

ChampGame.Boot.prototype = {

    init: function() {
        this.game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);
        this.game.stateTransition.configure({
            duration: Phaser.Timer.SECOND * 0.8,
            ease: Phaser.Easing.Exponential.Out,
            properties: {
                alpha: 0,
                scale: {
                    x: 1.4,
                    y: 1.4
                }
            }
        });
    },

    preload: function() {
        // chargement de tout les assets du jeu
        this.load.bitmapFont('Upheaval', 'assets/fonts/Upheaval.png', 'assets/fonts/Upheaval.fnt');
        this.load.bitmapFont('Upheaval-Black', 'assets/fonts/Upheaval-Black.png', 'assets/fonts/Upheaval-Black.fnt');

        this.load.image('bar-512', 'assets/sprites/bar-512.png');
        this.load.image('bar-fill-512', 'assets/sprites/bar-fill-512.png');
        this.load.image('bar-indicator-512', 'assets/sprites/bar-indicator-512.png');

        this.time.advancedTiming = true;
    },

    create: function() {
        // configurer l'environnement
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

        // démarrage
        this.game.stateTransition.to('preload');
    }

}