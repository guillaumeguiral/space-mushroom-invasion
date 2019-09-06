ChampGame.MainLevel = function() {
    // controls
    this.controls;

    // gamepad
    this.pad1;

    this.pad1BtnA;
    this.pad1BtnB;
    this.pad1BtnX;
    this.pad1BtnY;
    this.pad1Left;
    this.pad1Right;
    this.pad1Up;
    this.pad1Down;

    // sprite du joueur
    this.player;

    this.playerCanMove = false;

    // cooldown de tir joueur
    this.playerFiringCooldown

    this.playerDecelerationAnim = false;

    // vies
    this.lifes;
    this.score;

    // UI
    this.GUI = {};

    // ships
    this.spaceships = {
        alpha: {
            sprite: 'spaceship-alpha',
            laserSprite: 'laser-alpha',
            maxSpeed: 400,
            acceleration: 20,
            deceleration: 1.3,
            weapons: {}
        },
        beta: {
            sprite: 'spaceship-beta',
            laserSprite: 'laser-beta',
            maxSpeed: 600,
            acceleration: 50,
            deceleration: 1.5,
            weapons: {}
        },
        gamma: {
            sprite: 'spaceship-gamma',
            laserSprite: 'laser-gamma',
            maxSpeed: 300,
            acceleration: 10,
            deceleration: 1.1,
            weapons: {}
        }
    };

    // types d'ennemis
    this.enemyTypes;

    // selection du vaisseau
    // TODO: A choisir dans le menu principal
    this.paramShip = 'alpha';
    this.playerSpaceship = this.spaceships[this.paramShip];

    // Boost
    this.starfieldSpeed = 2;

    // Neublae
    this.nebulae;

    // starfield
    this.star;
    this.stars = [];
    this.sfTexture1;
    this.sfTexture2;
    this.sfTexture3;

    // enemies group
    this.enemies;

    // tirs enemis group
    this.enemyBullets;

    // cooldown de tir ennemi
    this.enemyFiringCooldown = 0;
    this.enemyFiringCooldownDelay = 2000;

    // explosions group
    this.explosions;

    // enemay spawn delay
    this.enemySpawnCooldown = 0;
    this.enemySpawnCooldownDelay = 300;

    this.enemySpawnable = false;

    this.sounds = {};

    this.levelProgression = 0;
    this.levelLength = 3000;
    this.bossTriggered = false;

    // sprite du boss
    this.boss;

    // définit si le boss peut bouger
    this.bossCanMove = false;

    // vie du boss
    this.bossHealth = 200;
    this.bossHealthMax = 200;
    this.bossHealthBar = {};

    // déplacements du boss
    this.bossMovementCooldown = 0;
    this.bossMovementCooldownDelay = 2000;
};

ChampGame.MainLevel.prototype = {

    initControls: function() {
        // on initialise le clavier
        this.controls = this.input.keyboard.createCursorKeys();

        // on initialise le pad
        this.input.gamepad.start();

        // on récupère le 1er pad dispo
        this.pad1 = this.input.gamepad.pad1;

        // on initialise les controles
        if (this.pad1.connected) {
            this.initPadControls();
        }
    },

    initPadControls: function() {
        this.pad1BtnA = this.pad1.getButton(Phaser.Gamepad.XBOX360_A);
        this.pad1BtnB = this.pad1.getButton(Phaser.Gamepad.XBOX360_B);
        this.pad1BtnX = this.pad1.getButton(Phaser.Gamepad.XBOX360_X);
        this.pad1BtnY = this.pad1.getButton(Phaser.Gamepad.XBOX360_Y);

        this.pad1Left = this.pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT);
        this.pad1Right = this.pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT);
        this.pad1Up = this.pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_UP);
        this.pad1Down = this.pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_DOWN);
    },

    initSounds: function() {

        this.sounds.sfxAlarm = this.add.audio('sfx-alarm');
        this.sounds.sfxExplosion = this.add.audio('sfx-explosion');
        this.sounds.sfxLaser = this.add.audio('sfx-laser');
        this.sounds.sfxPlayerHit = this.add.audio('sfx-player-hit');
        this.sounds.sfxSplash = this.add.audio('sfx-splash');
        this.sounds.sfxVoiceGetReady = this.add.audio('sfx-voice-get-ready');

    },

    // ------------------------------------------------------------------------
    // GUI
    // ------------------------------------------------------------------------

    getReadyInit: function() {
        // on ajoute le timer pour le message
        this.time.events.add(Phaser.Timer.SECOND * 1, this.getReadyAnnounce, this);
        // on ajoute le timer pour le lancement du jeu
        this.time.events.add(Phaser.Timer.SECOND * 3, this.getReadyCallback, this);
    },

    getReadyAnnounce: function() {
        // on joue le son
        this.sounds.sfxVoiceGetReady.play();
        // message alerte
        this.createAlertText("Get ready !", 72);
    },

    getReadyCallback: function() {
        // on autorise le spawn d'ennemi
        this.enemySpawnable = true;

        // on empeche le joueur de sortir de l'écran
        this.player.body.collideWorldBounds = true;

        // on autorise les mouvements du joueur
        this.playerCanMove = true;
    },

    // ------------------------------------------------------------------------
    // GUI
    // ------------------------------------------------------------------------

    initGUI: function() {
        this.GUI.lifes = this.add.bitmapText(20, 20, 'Upheaval', 'Lifes : 3', 32);
        this.GUI.lifes.anchor.setTo(0, 0);
        this.GUI.lifes.fixedToCamera = true;

        this.GUI.score = this.add.bitmapText(this.world.width - 20, 20, 'Upheaval', 'Score : 0', 32);
        this.GUI.score.anchor.setTo(1, 0);
        this.GUI.score.fixedToCamera = true;

        this.GUI.levelProgressLabel = this.add.bitmapText(this.world.centerX, 20, 'Upheaval', 'Level Progression', 12);
        this.GUI.levelProgressLabel.anchor.setTo(0.5);

        this.GUI.levelProgressBG = this.add.sprite(this.world.centerX, 28, 'bar-512');
        this.GUI.levelProgressBG.anchor.setTo(0.5, 0);

        this.GUI.levelProgressBar = this.add.sprite(this.world.centerX - 256, 28, 'bar-fill-512');
        this.GUI.levelProgressBar.anchor.setTo(0);

        // on créé un mask pour la barre de progression
        this.GUI.levelProgressBarMask = this.make.graphics(0, 0);
        this.GUI.levelProgressBarMask.beginFill(0xffffff);

        // on ajoute le mask en enfant
        this.GUI.levelProgressBar.addChild(this.GUI.levelProgressBarMask);

        // puis on attribue le mask
        this.GUI.levelProgressBar.mask = this.GUI.levelProgressBarMask;
    },

    updateLevelProgressBarMask: function(w) {
        this.GUI.levelProgressBarMask.drawRect(0, 0, w, 24);
    },

    removeLevelProgressBar: function() {
        this.add.tween(this.GUI.levelProgressLabel).to({ y: -32 }, 600, Phaser.Easing.Quadratic.In, true, 0);
        this.add.tween(this.GUI.levelProgressBG).to({ y: -32 }, 600, Phaser.Easing.Quadratic.In, true, 200);
        this.add.tween(this.GUI.levelProgressBar).to({ y: -32 }, 600, Phaser.Easing.Quadratic.In, true, 200);
    },

    updateGUI: function() {
        this.GUI.lifes.setText("Lifes : " + this.lifes);
        this.GUI.score.setText("Score : " + this.score);
    },

    createCombatText: function(x, y, text, size) {
        var cTxt = this.add.bitmapText(x, y - 30, 'Upheaval', text, size);
        cTxt.anchor.setTo(0.5);

        var cTxtTween = this.add.tween(cTxt).to({ alpha: 0, y: cTxt.y - 40 }, 1000, Phaser.Easing.Quadratic.Out);
        cTxtTween.onComplete.add(cTxtTweenDone, this);
        cTxtTween.start();

        function cTxtTweenDone(obj, twn) {
            obj.destroy();
        }
    },

    createAlertText: function(text, size) {
        var aTxt = this.add.bitmapText(this.world.centerX, this.world.centerY, 'Upheaval', text, size);
        aTxt.anchor.setTo(0.5);

        var aTxtTween = this.add.tween(aTxt).to({ alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out);
        aTxtTween.onComplete.add(aTxtTweenDone, this);
        aTxtTween.start();

        function aTxtTweenDone(obj, twn) {
            obj.destroy();
        }
    },

    // ------------------------------------------------------------------------
    // Nebuleuse
    // ------------------------------------------------------------------------

    initNebulae: function() {
        this.nebulae = this.add.tileSprite(0, 0, 1280, 640, 'nebulae');
    },

    updateNebulae: function() {
        this.nebulae.tilePosition.x -= 1;
    },

    // ------------------------------------------------------------------------
    // Starfield
    // ------------------------------------------------------------------------

    createStarfield: function() {
        this.star = this.make.sprite(0, 0, 'star-01');

        this.sfTexture1 = this.add.renderTexture(1000, 600, 'sfTexture1');
        this.sfTexture2 = this.add.renderTexture(1000, 600, 'sfTexture2');
        this.sfTexture3 = this.add.renderTexture(1000, 600, 'sfTexture3');

        this.add.sprite(0, 0, this.sfTexture1);
        this.add.sprite(0, 0, this.sfTexture2);
        this.add.sprite(0, 0, this.sfTexture3);

        var tex = this.sfTexture1;
        var spd = this.starfieldSpeed;

        for (var i = 0; i < 300; i++)
        {
            if (i == 100)
            {
                spd = this.starfieldSpeed + 2;
                tex = this.sfTexture2;
            }
            else if (i == 200)
            {
                spd = this.starfieldSpeed + 4;
                tex = this.sfTexture3;
            }

            this.stars.push({
                x: this.world.randomX,
                y: this.world.randomY,
                speed: spd,
                texture: tex
            });
        }
    },

    updateStarField: function() {
        for (var i = 0; i < 300; i++)
        {
            this.stars[i].x -= this.stars[i].speed;

            if (this.stars[i].x < 0)
            {
                this.stars[i].x = this.world.width;
                this.stars[i].y = this.world.randomY;
            }

            if (i > 0 && i <= 100) {
                this.star.alpha = 1;
            } else if (i > 100 && i <= 200) {
                this.star.alpha = 0.6;
            } else if (i > 200) {
                this.star.alpha = 0.2;
            }

            if (i == 0 || i == 100 || i == 200)
            {
                this.stars[i].texture.renderXY(this.star, this.stars[i].x, this.stars[i].y, true);
            }
            else
            {
                this.stars[i].texture.renderXY(this.star, this.stars[i].x, this.stars[i].y, false);
            }
        }
    },

    // ------------------------------------------------------------------------
    // Joueur
    // ------------------------------------------------------------------------

    createPlayer: function() {
        // on ajoute le joueur sur la scene
        this.player = this.add.sprite(200, this.world.centerY, this.playerSpaceship.sprite, 20);

        this.player.animations.add('stand', [20], 12, true);
        this.player.animations.add('up-forward', Phaser.ArrayUtils.numberArrayStep(19, 0, -1));
        this.player.animations.add('up-backward', Phaser.ArrayUtils.numberArray(0, 19));
        this.player.animations.add('down-forward', Phaser.ArrayUtils.numberArray(21, 40));
        this.player.animations.add('down-backward', Phaser.ArrayUtils.numberArrayStep(40, 21, -1));
        this.player.animations.play('stand');

        this.player.anchor.setTo(0.5);

        // on active la physique pour le joueur
        this.physics.arcade.enable(this.player);

        this.player.body.setSize(100, 40, 5, 0);

        // on anime son entrée
        this.add.tween(this.player).from({ x: -100 }, 2500, Phaser.Easing.Quadratic.Out, true, 0);
    },

    playerMovementsHandler: function() {
        // on récupère la vitesse en cours
        var xSpeed = this.player.body.velocity.x;
        var ySpeed = this.player.body.velocity.y;

        // CONTROLE CLAVIER

        if(this.controls.left.isDown && this.playerCanMove) {
            xSpeed -= this.playerSpaceship.acceleration;
        } else if(this.controls.right.isDown && this.playerCanMove) {
            xSpeed += this.playerSpaceship.acceleration;
        } else if((this.pad1.connected && (this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1 || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)) && this.playerCanMove) {
            xSpeed += this.playerSpaceship.acceleration * this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
        } else {
            if (xSpeed >= -10 && xSpeed <= 10) {
                xSpeed = 0;
            } else {
                xSpeed = Math.floor(xSpeed / this.playerSpaceship.deceleration);
            }
        }

        if((this.controls.up.isDown || (this.pad1Up && this.pad1Up.isDown)) && this.playerCanMove) {
            ySpeed -= this.playerSpaceship.acceleration;
        } else if((this.controls.down.isDown || (this.pad1Down && this.pad1Down.isDown)) && this.playerCanMove) {
            ySpeed += this.playerSpaceship.acceleration;
        } else if((this.pad1.connected && (this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1 || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1)) && this.playerCanMove) {
            ySpeed += this.playerSpaceship.acceleration * this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
        } else {
            if (ySpeed >= -10 && ySpeed <= 10) {
                ySpeed = 0;
            } else {
                ySpeed = Math.floor(ySpeed / this.playerSpaceship.deceleration);
            }
        }

        this.player.body.velocity.x = this.math.clamp(xSpeed, -this.playerSpaceship.maxSpeed, this.playerSpaceship.maxSpeed);
        this.player.body.velocity.y = this.math.clamp(ySpeed, -this.playerSpaceship.maxSpeed, this.playerSpaceship.maxSpeed);

        // on détermine l'animation à jouer pour la spritesheet
        var anim = this.player.animations.currentAnim.name;

        if ((this.controls.up.isDown || (this.pad1Up && this.pad1Up.isDown)) && this.playerCanMove) {
            if (anim != 'up-forward') {
                this.player.animations.play('up-forward');
                this.playerDecelerationAnim = true;
            }
        } else if ((this.controls.down.isDown || (this.pad1Down && this.pad1Down.isDown)) && this.playerCanMove) {
            if (anim != 'down-forward') {
                this.player.animations.play('down-forward');
                this.playerDecelerationAnim = true;
            }
        } else {
            if (this.playerDecelerationAnim) {
                if (anim == 'up-forward') {
                    this.player.animations.play('up-backward');
                } else if (anim == 'down-forward') {
                    this.player.animations.play('down-backward');
                }
                this.playerDecelerationAnim = false;
            }
        }
    },

    hitByEnemy: function() {
        if (this.lifes > 0) {
            this.playerHit();
        } else {
            this.game.stateTransition.to('game-over');
        }
    },

    playerHit: function() {
        // son hit
        this.sounds.sfxPlayerHit.play();

        // son alarm
        this.sounds.sfxAlarm.play();

        // on affiche un message d'alerte
        this.createAlertText("Hit !", 72);

        // on retire une vie
        this.lifes--;

        // on affiche un combat text
        this.createCombatText(this.player.x, this.player.y, "-1 Life", 24);

        // on met à jour le GUI
        this.updateGUI();
    },

    playerHitByBoss: function() {
        // on créé un explosion
        this.createExplosion(this.player.x, this.player.y);

        // son explosion
        this.sounds.sfxExplosion.play();

        // on descend les vies à 0
        this.lifes = 0;

        // on met à jour le GUI
        this.updateGUI();

        // ecran game-over
        this.game.stateTransition.to('game-over');
    },

    // ------------------------------------------------------------------------
    // Tirs joueur
    // ------------------------------------------------------------------------

    initPlayerBulletsGroup: function() {
        this.playerBullets = this.add.group();
        this.playerBullets.enableBody = true;
        this.playerBullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.playerBullets.createMultiple(20, this.playerSpaceship.laserSprite);

        this.playerBullets.setAll('checkWorldBounds', true);
        this.playerBullets.setAll('outOfBoundsKill', true);
    },

    createPlayerBullet: function(x, y) {
        // on récupère le premier "dead" de la pool
        var bullet = this.playerBullets.getFirstDead();

        if (bullet) {
            // on reset sa position
            bullet.reset(x, y);
            bullet.anchor.setTo(0.5);

            // on envoi la bullet sur le joueur
            bullet.body.velocity.x = 1000;
        }
    },

    playerFiringHandler: function() {
        // Tir par défaut (laser)
        if (this.input.activePointer.isDown || (this.pad1BtnA && this.pad1BtnA.isDown)) {
            // si le cooldown n'est pas passé, on annule le tir
            if (this.time.now < this.playerFiringCooldown) {
                return false;
            }

            // son laser
            this.sounds.sfxLaser.play();

            // And fire the bullet from this enemy
            this.createPlayerBullet(this.player.x + 60, this.player.y);

            this.playerFiringCooldown = this.time.now + 200;
        }

    },

    // ------------------------------------------------------------------------
    // Enemis (champignons maléfiques)
    // ------------------------------------------------------------------------

    initEnemyTypes: function() {
        this.enemyTypes = [
            {
                points: 100,
                texture: 'enemy-mushroom-01',
                tweenType: 'double-wave',
                speed: 3000
            },
            {
                points: 200,
                texture: 'enemy-mushroom-02',
                tweenType: 'return-wave',
                speed: 2000
            },
            {
                points: 300,
                texture: 'enemy-mushroom-03',
                tweenType: 'quad-wave',
                speed: 2000
            }
        ]
    },

    getRandomEnemyType: function() {
        var t = Phaser.ArrayUtils.getRandomItem(this.enemyTypes);

        if (t.tweenType == 'double-wave') {
            t.tween = {
                x: [ 500, -50 ],
                y: [ this.world.randomY, this.world.randomY ]
            }
        } else if (t.tweenType == 'quad-wave') {
            t.tween = {
                x: [ 750, 500, 250, -50 ],
                y: [ 0, 600, 0, 600 ]
            }
        } else if (t.tweenType == 'return-wave') {
            t.tween = {
                x: [ 100, this.world.width + 60 ],
                y: [ this.world.randomY, this.world.randomY ]
            }
        }

        return t;
    },

    initEnemyGroup: function() {
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

        this.enemies.createMultiple(20, 'enemy-mushroom-01');
    },

    createEnemy: function() {
        // on récupère le premier "dead" de la pool
        var enemy = this.enemies.getFirstDead();
        // on reset sa position
        enemy.reset(this.world.width + 50, this.world.randomY);
        enemy.anchor.setTo(0.5);
        enemy.body.setSize(50, 50, 0, 0);

        // on recupere un type d'ennemi aléatoirement
        enemy.eType = this.getRandomEnemyType();

        // on attribue la bonne texture
        enemy.loadTexture(enemy.eType.texture);

        enemy.animations.add('turn', Phaser.ArrayUtils.numberArray(0, 19), 30, true);
        enemy.animations.play('turn');

        var enemyTween = this.add.tween(enemy).to(enemy.eType.tween, enemy.eType.speed, Phaser.Easing.Linear.None);
        enemyTween.interpolation(Phaser.Math.catmullRomInterpolation);
        enemyTween.onComplete.add(this.enemyMovementDone, this);
        enemyTween.start();
    },

    enemyMovementDone: function(obj, twn) {
        this.killEnemy(obj);
    },

    enemyHit: function(enemy) {
        // TODO: Calculer le score en fonction de l'ennemi
        // on met à jour le score
        this.score += enemy.eType.points;

        // on créé une animation sur l'ennemi (texte flottant)
        this.createCombatText(enemy.x, enemy.y, "+" + enemy.eType.points, 24);

        // on met à jour le GUI
        this.updateGUI();
    },

    enemyExplode: function(enemy) {
        // on déclenche une explosion
        this.createExplosion(enemy.x, enemy.y);
        // son explosion
        this.sounds.sfxExplosion.play();
        // on tue l'ennemi
        this.killEnemy(enemy);
    },

    killEnemy: function(enemy) {
        this.tweens.removeFrom(enemy);
        enemy.kill();
    },

    enemySpawnerHandler: function() {
        // si les monstres sont spawnables
        if (this.enemySpawnable) {
            // si le cooldown n'est pas passé, on ne fait rien
            if (this.time.now < this.enemySpawnCooldown) {
                return false;
            }

            // spawn enemy
            this.createEnemy();

            this.enemySpawnCooldown = this.time.now + this.enemySpawnCooldownDelay;
        }
    },

    // ------------------------------------------------------------------------
    // Tirs enemis
    // ------------------------------------------------------------------------

    initEnemyBulletsGroup: function() {
        this.enemyBullets = this.add.group();
        this.enemyBullets.enableBody = true;
        this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.enemyBullets.createMultiple(20, 'spore-01');

        this.enemyBullets.setAll('checkWorldBounds', true);
        this.enemyBullets.setAll('outOfBoundsKill', true);
    },

    createEnemyBullet: function(x, y) {
        // on récupère le premier "dead" de la pool
        var bullet = this.enemyBullets.getFirstDead();

        if (bullet) {
            // on reset sa position
            bullet.reset(x, y);
            bullet.anchor.setTo(0.5);
            bullet.body.setSize(30, 30, -5, 0);

            // on envoi la bullet sur le joueur
            this.physics.arcade.moveToObject(bullet, this.player, 300);
        }
        //enemy.body.width = 32;
        //enemy.body.height = 32;
    },

    enemyFiringHandler: function() {
        // si les bullets sont spawnables
        if (this.enemySpawnable) {

            // si le cooldown n'est pas passé, on annule le tir
            if (this.time.now < this.enemyFiringCooldown) {
                return false;
            }

            // on créé une liste qui contiendra les ennemis actifs en jeu
            var livingEnemies = [];

            // on ajoute les ennemis actifs dans la liste
            this.enemies.forEachAlive(function (enemy) {
                livingEnemies.push(enemy);
            });

            if (livingEnemies.length > 0) {

                // on récupère un ennemi aléatoire
                var random = this.rnd.integerInRange(0, livingEnemies.length - 1);
                var shooter = livingEnemies[random];

                // And fire the bullet from this enemy
                this.createEnemyBullet(shooter.body.x, shooter.body.y);

                this.enemyFiringCooldown = this.time.now + this.enemyFiringCooldownDelay;
            }
        }
    },

    // ------------------------------------------------------------------------
    // FX
    // ------------------------------------------------------------------------

    initExplosions: function() {
        this.explosions = this.add.group();
        this.explosions.createMultiple(10, 'explosion-01');
    },

    createExplosion: function(x, y) {
        // on récupère le premier "dead" de la pool
        var explosion = this.explosions.getFirstDead();
        explosion.anchor.setTo(0.5);
        explosion.reset(x, y);

        explosion.animations.add('explode', Phaser.ArrayUtils.numberArray(0, 73), 60, false);
        explosion.animations.play('explode', 64, false, true);
    },

    // ------------------------------------------------------------------------
    // Boss
    // ------------------------------------------------------------------------

    createBoss: function() {
        // on enleve le spawn d'ennemi
        this.enemySpawnable = false;

        // on remplace la barre de progression
        this.removeLevelProgressBar();

        // on create la bar de vie du boss
        this.createBossHealthBar();

        // création du boss
        this.boss = this.add.sprite(this.world.width - 200, this.world.centerY, 'boss-01', 20);

        this.boss.animations.add('turn', Phaser.ArrayUtils.numberArray(0, 39), 20, true);
        this.boss.animations.play('turn');

        this.boss.anchor.setTo(0.5);

        // Apparition
        this.add.tween(this.boss).from({ x: this.world.width + 200 }, 2000 , Phaser.Easing.Quadratic.Out, true, 1000);

        // on active la physique pour le joueur
        this.physics.arcade.enable(this.boss);

        // TODO: A tweaker
        this.boss.body.setSize(100, 60, 0, 0);

        this.time.events.add(Phaser.Timer.SECOND * 4, this.bossReadyToMove, this);

    },

    bossReadyToMove: function() {
        this.bossCanMove = true;
    },

    createBossHealthBar: function() {
        this.bossHealthBar.Label = this.add.bitmapText(this.world.centerX, 20, 'Upheaval', 'Boss Health', 12);
        this.bossHealthBar.Label.anchor.setTo(0.5);

        this.bossHealthBar.BG = this.add.sprite(this.world.centerX, 28, 'bar-512-red');
        this.bossHealthBar.BG.anchor.setTo(0.5, 0);

        this.bossHealthBar.Progress = this.add.sprite(this.world.centerX - 256, 28, 'bar-fill-512-red');
        this.bossHealthBar.Progress.anchor.setTo(0);

        // on créé un mask pour la barre de progression
        this.bossHealthBar.ProgressMask = this.make.graphics(0, 0);
        this.bossHealthBar.ProgressMask.beginFill(0xffffff);

        // on ajoute le mask en enfant
        this.bossHealthBar.Progress.addChild(this.bossHealthBar.ProgressMask);

        // puis on attribue le mask
        this.bossHealthBar.Progress.mask = this.bossHealthBar.ProgressMask;

        // on tween son apparaition
        this.add.tween(this.bossHealthBar.BG).from({ y: -32 }, 600, Phaser.Easing.Quadratic.In, true, 600);
        this.add.tween(this.bossHealthBar.Progress).from({ y: -32 }, 600, Phaser.Easing.Quadratic.In, true, 600);
        this.add.tween(this.bossHealthBar.Label).from({ y: -32 }, 600, Phaser.Easing.Quadratic.In, true, 800);
    },

    updateBossHealthBarMask: function(w) {
        this.bossHealthBar.ProgressMask.clear();
        this.bossHealthBar.ProgressMask.beginFill(0xffffff);
        this.bossHealthBar.ProgressMask.drawRect(0, 0, w, 24);
    },

    bossMovementsHandler: function() {
        if (this.bossCanMove) {
            // si le cooldown n'est pas passé, on annule ne bouge pas
            if (this.time.now < this.bossMovementCooldown) {
                return false;
            }

            // on génère un déplacement
            var bossTween = this.add.tween(this.boss).to({
                x: [
                    this.rnd.integerInRange(400, 950),
                    this.rnd.integerInRange(400, 950)
                ],
                y: [
                    this.rnd.integerInRange(50, 550),
                    this.rnd.integerInRange(50, 550)
                ]
            }, 2000, Phaser.Easing.Quadratic.InOut, false, 0);
            bossTween.interpolation(Phaser.Math.catmullRomInterpolation);
            bossTween.start();

            // on reset le cooldown
            this.bossMovementCooldown = this.time.now + this.bossMovementCooldownDelay;
        }
    },

    bossHit: function() {
        // on met à jour la vie du boss
        this.bossHealth -= 1;

        // on joue un son
        this.sounds.sfxSplash.play();

        // on joue une animation

        // on teste si le boss est toujours en vie
        if (this.bossHealth > 0) {
            // on update sa barre de vie
            this.updateBossHealthBarMask((this.bossHealth / this.bossHealthMax) * 512);
        } else {
            this.game.stateTransition.to('game-over');
        }
    },

    // ------------------------------------------------------------------------
    // Collisions
    // ------------------------------------------------------------------------

    enemyHitPlayerCollision: function(player, enemy) {
        // on tue l'ennemi
        this.enemyExplode(enemy);

        // on déclenche la gestion du touch by an ennemi
        this.hitByEnemy();
    },

    enemyBulletHitPlayerCollision: function(player, bullet) {
        // on tue l'ennemi
        bullet.kill();

        // on déclenche la gestion du touch by an ennemi
        this.hitByEnemy();
    },

    playerBulletHitEnemyCollision: function(enemy, bullet) {
        // on calcule le nouveau score
        this.enemyHit(enemy);

        // on tue l'ennemi
        this.enemyExplode(enemy);

        // on tue la bullet
        bullet.kill();
    },

    playerBulletHitBossCollision: function(boss, bullet) {
        // on touche le boss
        this.bossHit();

        // on tue la bullet
        bullet.kill();
    },

    bossHitPlayerCollision: function(boss, player) {
        // on déclenche la gestion du touch by le boss
        this.playerHitByBoss();
    },

    collisionsHandler: function() {
        // collision player <=> enemy
        this.physics.arcade.overlap(this.player, this.enemies, this.enemyHitPlayerCollision, null, this);

        // collision player <=> enemy bullet
        this.physics.arcade.overlap(this.player, this.enemyBullets, this.enemyBulletHitPlayerCollision, null, this);

        // collision enemy <=> player bullet
        this.physics.arcade.overlap(this.enemies, this.playerBullets, this.playerBulletHitEnemyCollision, null, this);

        // collision player bullet <=> boss
        this.physics.arcade.overlap(this.boss, this.playerBullets, this.playerBulletHitBossCollision, null, this);

        // collision boss <=> player
        this.physics.arcade.overlap(this.boss, this.player, this.bossHitPlayerCollision, null, this);
    },

    // ------------------------------------------------------------------------
    // Level progression
    // ------------------------------------------------------------------------

    updateLevelProgression: function() {
        // Si la progression est < à la longueur du niveau
        if (!this.bossTriggered) {
            if (this.levelProgression < this.levelLength) {
                this.levelProgression++;
                this.updateLevelProgressBarMask(Math.round((this.levelProgression / this.levelLength) * 512));
            } else {
                // on trig' le boss
                this.bossTriggered = true;
                // on initialise le boss
                this.createBoss();
            }
        }
    },

    // ------------------------------------------------------------------------
    // Phaser
    // ------------------------------------------------------------------------

    resetGame: function() {
        this.score = 0;
        this.lifes = 3;
    },

    init: function() {
        this.stars = [];

        this.enemySpawnable = false;

        this.playerSpaceship = this.spaceships[this.paramShip];
    },

    create: function() {
        // initialisation de la nebuleuse
        this.initNebulae();

        // initialisation du starfield
        this.createStarfield();

        // initialisation du joueur
        this.createPlayer();

        // initialisation des tirs joueur
        this.initPlayerBulletsGroup();

        // initialisation des types d'ennemis
        this.initEnemyTypes();

        // initialisation du groupe d'ennemis
        this.initEnemyGroup();

        // initialisation des tirs ennemis
        this.initEnemyBulletsGroup();

        // initialisation du groupe d'explosions
        this.initExplosions();

        // initialisation des controles
        this.initControls();

        // initialisation des sons
        this.initSounds();

        // on initialise le GUI
        this.initGUI();

        // reset du jeu
        this.resetGame();

        // on prepare le jeu ...
        this.getReadyInit();
    },

    render: function() {
        //this.game.debug.text("FPS : " + this.time.fps || '--', 20, this.world.height - 20, "#00ccff", "14px Courier");
        //this.game.debug.cameraInfo(this.camera, 20, 20);
        //this.game.debug.body(this.player);
        //this.enemies.forEach(this.game.debug.body, this.game.debug, "#ff9090", false);
        //this.playerBullets.forEach(this.game.debug.body, this.game.debug, "#90ff90", false);
    },

    update: function() {
        // on gère les mouvements du joueur
        this.playerMovementsHandler();

        // gestion des tirs joueurs
        this.playerFiringHandler();

        // déplacement du starfield
        this.updateStarField();

        // déplacement de la nébuleuse
        this.updateNebulae();

        // gestion du spawner de champignons
        this.enemySpawnerHandler();

        // gestion des tirs ennemis
        this.enemyFiringHandler();

        // gestion du boss
        if (this.bossTriggered) {
            this.bossMovementsHandler();
        }

        // on vérifie les collisions
        this.collisionsHandler();

        // on update la progression du niveau
        this.updateLevelProgression();
    }

}