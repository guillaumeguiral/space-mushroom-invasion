ChampGame.MainMenu = function() {
  // starfield
  this.distance = 300;
  this.speed = 6;
  this.star;
  this.texture;

  this.max = 400;
  this.xx = [];
  this.yy = [];
  this.zz = [];

  this.pad1;

  this.padSprite;
};

ChampGame.MainMenu.prototype = {
  initPad: function() {
    // on initialise le pad
    this.input.gamepad.start();

    // on récupère le 1er pad dispo
    this.pad1 = this.input.gamepad.pad1;

    // on ajoute un callback sur la dispo du pad pour mapper les boutons
    if (this.pad1.connected) {
      this.padConnected();
    }
  },

  padConnected: function() {
    this.padSprite = this.add.sprite(20, 20, 'pad');
    this.add
      .tween(this.padSprite)
      .to({ alpha: 0 }, 300, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
  },

  createBtn: function(x, y, text, callback) {
    var btn = this.add.button(x, y, 'btn', callback, this, 1, 0, 2);
    btn.anchor.setTo(0.5);

    var txt = this.make.bitmapText(0, 0, 'Upheaval-Black', text, 32);
    txt.anchor.setTo(0.5);

    btn.addChild(txt);

    return btn;
  },

  createIconBtn: function(x, y, icon, callback) {
    var btn = this.add.button(x, y, 'btn-mini', callback, this, 1, 0, 2);
    btn.anchor.setTo(0.5);

    var txt = this.make.sprite(0, 0, icon);
    txt.anchor.setTo(0.5);

    btn.addChild(txt);

    return btn;
  },

  btnStartHandler: function() {
    this.game.stateTransition.to('selector-menu');
  },

  btnHighScoresHandler: function() {
    // TODO: this.game.stateTransition.to('high-scores');
  },

  btnHelpHandler: function() {
    this.game.stateTransition.to('help');
  },

  btnFullScreenHandler: function() {
    if (this.scale.isFullScreen) {
      this.scale.stopFullScreen();
    } else {
      this.scale.startFullScreen(false);
    }
  },

  initBG: function() {
    // ajout du fond
    this.add.sprite(0, 0, 'main-menu-bg');
  },

  initGUI: function() {
    var logo = this.add.sprite(
      this.world.centerX,
      this.world.centerY - 100,
      'logo'
    );
    logo.anchor.setTo(0.5);
    this.add
      .tween(logo.scale)
      .from({ x: 0.6, y: 0.6 }, 1000, Phaser.Easing.Quadratic.Out, true, 500);
    this.add
      .tween(logo)
      .from({ alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true, 500);

    var btn1 = this.createBtn(
      this.world.centerX,
      this.world.centerY + 80,
      'START',
      this.btnStartHandler
    );
    var btn2 = this.createBtn(
      this.world.centerX,
      this.world.centerY + 140,
      'HIGH SCORES',
      this.btnHighScoresHandler
    );
    var btn3 = this.createBtn(
      this.world.centerX,
      this.world.centerY + 200,
      'HELP',
      this.btnHelpHandler
    );

    var btnFullScreen = this.createIconBtn(
      this.world.width - 48,
      48,
      'icon-fullscreen',
      this.btnFullScreenHandler
    );

    // Tweens
    this.add
      .tween(btn1)
      .from(
        { y: btn1.y + 60, alpha: 0 },
        600,
        Phaser.Easing.Quadratic.Out,
        true,
        0
      );
    this.add
      .tween(btn2)
      .from(
        { y: btn2.y + 60, alpha: 0 },
        600,
        Phaser.Easing.Quadratic.Out,
        true,
        200
      );
    this.add
      .tween(btn3)
      .from(
        { y: btn3.y + 60, alpha: 0 },
        600,
        Phaser.Easing.Quadratic.Out,
        true,
        400
      );

    this.add
      .tween(btnFullScreen)
      .from(
        { x: this.world.width + 24 },
        600,
        Phaser.Easing.Quadratic.Out,
        true,
        600
      );
  },

  createStarfield: function() {
    this.star = this.make.sprite(0, 0, 'star-02');
    this.texture = this.add.renderTexture(1000, 600, 'texture');

    this.add.sprite(0, 0, this.texture);

    for (var i = 0; i < this.max; i++) {
      this.xx[i] = Math.floor(Math.random() * 1200) - 400;
      this.yy[i] = Math.floor(Math.random() * 1000) - 300;
      this.zz[i] = Math.floor(Math.random() * 1700) - 100;
    }
  },

  updateStarfield: function() {
    this.texture.clear();

    for (var i = 0; i < this.max; i++) {
      var perspective = this.distance / (this.distance - this.zz[i]);
      var x = this.world.centerX + this.xx[i] * perspective;
      var y = this.world.centerY + this.yy[i] * perspective;

      this.zz[i] += this.speed;

      if (this.zz[i] > 300) {
        this.zz[i] -= 600;
      }

      this.texture.renderXY(this.star, x, y);
    }
  },

  create: function() {
    this.initBG();

    this.createStarfield();

    this.initGUI();

    this.initPad();
  },

  update: function() {
    this.updateStarfield();
  },

  render: function() {
    //this.game.debug.text(this.pad1.connected, 20, this.world.height - 20, "#00ffff", "14px Courier");
  }
};
