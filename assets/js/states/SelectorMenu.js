ChampGame.SelectorMenu = function() {
    // starfield
    this.distance = 300;
    this.speed = 6;
    this.star;
    this.texture;

    this.max = 400;
    this.xx = [];
    this.yy = [];
    this.zz = [];
};

ChampGame.SelectorMenu.prototype = {

    createBtn: function(x, y, text, callback) {
        var btn = this.add.button(x, y, 'ship-selector', callback, this, 1, 0, 2);
        btn.anchor.setTo(0.5);

        var ship = this.make.sprite(0, 0, 'spaceship-' + text + '-render');
        ship.anchor.setTo(0.5);

        btn.addChild(ship);

        var txt = this.make.bitmapText(0, 80, 'Upheaval', text, 16);
        txt.anchor.setTo(0.5);

        btn.addChild(txt);

        btn.ship = text;

        return btn;
    },

    btnStartHandler: function(btn) {
        this.state.states['main-level'].paramShip = btn.ship;
        this.game.stateTransition.to('main-level');
    },

    initBG: function() {
        // ajout du fond
        this.add.sprite(0, 0, 'main-menu-bg');
    },

    initGUI: function() {
        var btn1 = this.createBtn(this.world.centerX - 300, this.world.centerY, 'alpha', this.btnStartHandler);
        var btn2 = this.createBtn(this.world.centerX, this.world.centerY, 'beta', this.btnStartHandler);
        var btn3 = this.createBtn(this.world.centerX + 300, this.world.centerY, 'gamma', this.btnStartHandler);

        var btn1Tween = this.add.tween(btn1).from({ y: btn1.y + 60, alpha: 0 }, 600, Phaser.Easing.Quadratic.Out, true, 0);
        var btn2Tween = this.add.tween(btn2).from({ y: btn2.y + 60, alpha: 0 }, 600, Phaser.Easing.Quadratic.Out, true, 200);
        var btn3Tween = this.add.tween(btn3).from({ y: btn3.y + 60, alpha: 0 }, 600, Phaser.Easing.Quadratic.Out, true, 400);
    },

    createStarfield: function() {
        this.star = this.make.sprite(0, 0, 'star-02');
        this.texture = this.add.renderTexture(1000, 600, 'texture');

        this.add.sprite(0, 0, this.texture);

        for (var i = 0; i < this.max; i++)
        {
            this.xx[i] = Math.floor(Math.random() * 1200) - 400;
            this.yy[i] = Math.floor(Math.random() * 1000) - 300;
            this.zz[i] = Math.floor(Math.random() * 1700) - 100;
        }
    },

    updateStarfield: function() {
        this.texture.clear();

        for (var i = 0; i < this.max; i++)
        {
            var perspective = this.distance / (this.distance - this.zz[i]);
            var x = this.world.centerX + this.xx[i] * perspective;
            var y = this.world.centerY + this.yy[i] * perspective;

            this.zz[i] += this.speed;

            if (this.zz[i] > 300)
            {
                this.zz[i] -= 600;
            }

            this.texture.renderXY(this.star, x, y);
        }
    },

    create: function() {

        this.initBG();

        this.createStarfield();

        this.initGUI();
    },

    update: function() {
        this.updateStarfield();
    }

}