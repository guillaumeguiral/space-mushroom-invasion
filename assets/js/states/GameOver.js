ChampGame.GameOver = function() {
    this.sounds = {};
};

ChampGame.GameOver.prototype = {

    initSounds: function() {

        this.sounds.sfxVoiceGameOver = this.add.audio('sfx-voice-game-over');
        this.sounds.musicGameOver = this.add.audio('music-game-over');

    },

    create: function() {

        // initialisation des sons
        this.initSounds();

        this.sounds.sfxVoiceGameOver.play();

        this.sounds.musicGameOver.play("", 0, 0.3);

        var gameOverText = this.add.bitmapText(500, 300, 'Upheaval', 'Game Over', 72);
        gameOverText.anchor.setTo(0.5);

        this.input.onDown.add(function() {
            this.game.stateTransition.to('main-menu');
        }, this);
    }

}