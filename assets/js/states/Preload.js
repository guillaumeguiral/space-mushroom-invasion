ChampGame.Preload = function() {};

ChampGame.Preload.prototype = {

    createPreloadBar: function() {

        // Preload Text
        var loadingText = this.add.bitmapText(this.world.centerX, this.world.centerY - 20, 'Upheaval', 'Loading ...', 24);
        loadingText.anchor.setTo(0.5);

        // Preload Bar
        var loadingBar = this.add.sprite(this.world.centerX, this.world.centerY + 16, "bar-512");
        loadingBar.anchor.setTo(0.5);

        var loadingBarProgress = this.make.sprite(0, 0, "bar-fill-512");
        loadingBarProgress.anchor.setTo(0.5);
        loadingBar.addChild(loadingBarProgress);

        this.load.setPreloadSprite(loadingBarProgress, 0);

        // Tweens
        this.add.tween(loadingText).from({ y: -24, alpha: 0 }, 600, Phaser.Easing.Quadratic.Out, true, 0);
        this.add.tween(loadingBar).from({ y: this.world.centerX + 24, alpha: 0 }, 600, Phaser.Easing.Quadratic.Out, true, 200);
    },

    preload: function() {

        this.createPreloadBar();

        // gui
        this.load.image('main-menu-bg', 'assets/sprites/main-menu-bg.jpg');
        this.load.image('logo', 'assets/sprites/logo.png');
        this.load.spritesheet('btn', 'assets/sprites/btn.png', 272, 80, 3);
        this.load.spritesheet('btn-mini', 'assets/sprites/btn-mini.png', 48, 48, 3);
        this.load.spritesheet('ship-selector', 'assets/sprites/ship-selector.png', 256, 256, 3);
        this.load.image('spaceship-alpha-render', 'assets/sprites/spaceship-alpha-render.png');
        this.load.image('spaceship-beta-render', 'assets/sprites/spaceship-beta-render.png');
        this.load.image('spaceship-gamma-render', 'assets/sprites/spaceship-gamma-render.png');
        this.load.image('bar-512-red', 'assets/sprites/bar-512-red.png');
        this.load.image('bar-fill-512-red', 'assets/sprites/bar-fill-512-red.png');
        this.load.image('pad', 'assets/sprites/pad.png');

        // Icons
        this.load.image('icon-fullscreen', 'assets/sprites/icon-fullscreen.png');

        // joueur
        this.load.spritesheet('spaceship-alpha', 'assets/sprites/spaceship-alpha.png', 130, 90, 41);
        this.load.spritesheet('spaceship-beta', 'assets/sprites/spaceship-beta.png', 130, 90, 41);
        this.load.spritesheet('spaceship-gamma', 'assets/sprites/spaceship-gamma.png', 130, 90, 41);
        this.load.image('laser-alpha', 'assets/sprites/laser-alpha.png');
        this.load.image('laser-beta', 'assets/sprites/laser-beta.png');
        this.load.image('laser-gamma', 'assets/sprites/laser-gamma.png');

        // starfield
        this.load.image('star-01', 'assets/sprites/star-01.png');
        this.load.image('star-02', 'assets/sprites/star-02.png');

        // nebuleuse
        this.load.image('nebulae', 'assets/sprites/nebulae.png');

        // ennemis
        this.load.spritesheet('enemy-mushroom-01', 'assets/sprites/enemy-mushroom-01.png', 60, 60, 20);
        this.load.spritesheet('enemy-mushroom-02', 'assets/sprites/enemy-mushroom-02.png', 60, 60, 20);
        this.load.spritesheet('enemy-mushroom-03', 'assets/sprites/enemy-mushroom-03.png', 60, 60, 20);
        this.load.spritesheet('boss-01', 'assets/sprites/boss-01.png', 180, 160, 40);
        this.load.image('spore-01', 'assets/sprites/spore-01.png');

        // fx
        this.load.spritesheet('explosion-01', 'assets/sprites/explosion-01.png', 100, 100, 74);

        // sons
        this.load.audio('sfx-alarm', 'assets/sounds/sfx-alarm.mp3');
        this.load.audio('sfx-explosion', 'assets/sounds/sfx-explosion.mp3');
        this.load.audio('sfx-laser', 'assets/sounds/sfx-laser.mp3');
        this.load.audio('sfx-player-hit', 'assets/sounds/sfx-player-hit.mp3');
        this.load.audio('sfx-splash', 'assets/sounds/sfx-splash.mp3');
        this.load.audio('sfx-ui-btn', 'assets/sounds/sfx-ui-btn.mp3');
        this.load.audio('sfx-ui-confirm', 'assets/sounds/sfx-ui-confirm.mp3');
        this.load.audio('sfx-voice-game-over', 'assets/sounds/sfx-voice-game-over.mp3');
        this.load.audio('sfx-voice-get-ready', 'assets/sounds/sfx-voice-get-ready.mp3');

        this.load.audio('music-game-over', 'assets/sounds/music-game-over.mp3');
    },

    create: function() {
        this.game.stateTransition.to('main-menu');
    }

}