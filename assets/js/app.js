function Game() {}

Game.prototype = {
    start: function() {
        var game = new Phaser.Game(1000, 600, Phaser.AUTO, 'game-container');

        game.state.add('boot', ChampGame.Boot);
        game.state.add('preload', ChampGame.Preload);
        game.state.add('main-menu', ChampGame.MainMenu);
        game.state.add('selector-menu', ChampGame.SelectorMenu);
        game.state.add('main-level', ChampGame.MainLevel);
        game.state.add('game-over', ChampGame.GameOver);
        game.state.start('boot');
    }
};