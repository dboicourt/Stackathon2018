let player;
let cursors;
let bullets;
let lastFired = 0;
let fire;
let planet;
let land;

class StartPlanet extends Phaser.Scene {
  constructor() {
    super({ key: "startPlanet" });
  }

  preload() {
    //image assets
    this.load.image("space", "assets/SpaceBackdrop.png");
    this.load.image("startPlanet", "assets/StartPlanet.png");
    this.load.image("bullet", "assets/bullet.png");
    this.load.image("ship", "assets/cargoShip.png", {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    //bullet

    let Bullet = new Phaser.Class({
      Extends: Phaser.Physics.Arcade.Image,

      initialize: function Bullet(scene) {
        Phaser.Physics.Arcade.Image.call(this, scene, 0, 0, "bullet");

        this.speed = 500;
        this.lifespan = 1000;

        this._temp = new Phaser.Math.Vector2();
      },

      fire: function(player) {
        this.lifespan = 1000;

        this.setActive(true);
        this.setVisible(true);
        this.setAngle(player.body.rotation);
        this.setPosition(player.x, player.y);
        this.body.reset(player.x, player.y);
        let angle = Phaser.Math.DegToRad(player.body.rotation);
        this.scene.physics.velocityFromRotation(
          angle - 1.56,
          this.speed,
          this.body.velocity
        );
        this.body.velocity.x *= 2;
        this.body.velocity.y *= 2;
      },

      update: function(time, delta) {
        this.lifespan -= delta;

        if (this.lifespan <= 0) {
          this.setActive(false);
          this.setVisible(false);
          this.body.stop();
        }
      }
    });

    this.add.image(400, 400, "space").setScrollFactor(0);
    planet = this.add.image(400, 400, "startPlanet");

    bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 30,
      runChildUpdate: true
    });

    //player ship
    player = this.physics.add.image(400, 500, "ship");
    player.body.maxVelocity.set(200);
    this.cameras.main.startFollow(player);

    //controls
    cursors = this.input.keyboard.createCursorKeys();
    fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    land = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  }

  update(time) {
    //controls for player ship
    if (cursors.left.isDown) {
      player.body.angularVelocity = -200;
    } else if (cursors.right.isDown) {
      player.body.angularVelocity = 200;
    } else {
      player.setAngularVelocity(0);
    }
    if (cursors.up.isDown) {
      this.physics.velocityFromRotation(
        player.rotation - 1.57,
        player.body.speed + 40,
        player.body.acceleration
      );
    } else {
      player.setAcceleration(0);
    }
    if (cursors.down.isDown) {
      player.setDrag(100);
      player.setAngularDrag(400);
    } else {
      player.setDrag(0);
      player.setAngularDrag(0);
    }

    //fire control
    if (fire.isDown && time > lastFired) {
      let bullet = bullets.get();

      if (bullet) {
        bullet.fire(player);

        lastFired = time + 400;
      }
    }

    //Check for planet landing

    function checkOverlap(spriteA, spriteB) {
      let boundsA = spriteA.getBounds();
      let boundsB = spriteB.getBounds();

      return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }

    if (
      checkOverlap(player, planet) &&
      player.body.speed < 0.5 &&
      land.isDown
    ) {
      this.scene.start("menu");
    }
  }
}

//***************************** Planet Menu********************* */

class Menu extends Phaser.Scene {
  constructor() {
    super({ key: "menu" });
  }

  preload() {
    this.load.image("planetMenuBG", "assets/planetMenuBG.png");
    this.load.image("planetMenu", "assets/planetMenu.png");
    this.load.image("planetMenuButton", "assets/menuButton.png");
  }

  create() {
    this.add.image(400, 400, "planetMenuBG");
    this.add.image(400, 400, "planetMenu");
    this.add.image(250, 495, "planetMenuButton");
    this.add.image(550, 425, "planetMenuButton");
    this.add.image(250, 425, "planetMenuButton");
    this.add.image(550, 495, "planetMenuButton");
    this.add.text(330, 280, "Astoria", {
      fontSize: "32px",
      fill: "#fff"
    });
    this.add.text(240, 330, "The Island Planet", {
      fontSize: "32px",
      fill: "#fff"
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  physics: {
    default: "arcade"
  },
  scene: [Menu]
};

let game = new Phaser.Game(config);
