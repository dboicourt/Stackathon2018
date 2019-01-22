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

let button1;
let button2;
let button3;
let button4;

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
    this.add.text(170, 413, "1> Cantina", {
      fontSize: "24px",
      fill: "#fff"
    });
    this.add.text(470, 413, "2> Market", {
      fontSize: "24px",
      fill: "#fff"
    });
    this.add.text(170, 485, "3> Shipyard", {
      fontSize: "24px",
      fill: "#fff"
    });
    this.add.text(470, 485, "4> Lift Off", {
      fontSize: "24px",
      fill: "#fff"
    });

    //controls
    button1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    button2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    button3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    button4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
  }
  update() {
    if (button1.isDown) {
      this.scene.start("cantina");
    }
    if (button3.isDown) {
      this.scene.start("shipyard");
    }
    if (button4.isDown) {
      this.scene.start("startPlanet");
    }
  }
}

//********************************** Cantina *********************** */

class Cantina extends Phaser.Scene {
  constructor() {
    super({ key: "cantina" });
  }
  preload() {
    this.load.image("planetMenuBG", "assets/planetMenuBG.png");
    this.load.image("cantinaMenu", "assets/cantinaMenu.png");
    this.load.image("planetMenuButton", "assets/menuButton.png");
  }
  create() {
    this.add.image(400, 400, "planetMenuBG");
    this.add.image(400, 400, "cantinaMenu");
    this.add.text(260, 130, "The Foggy Cove", {
      fontSize: "32px",
      fill: "#fff"
    });
    this.add.text(
      140,
      180,
      'You step into "The Foggy Cove", which could be\nmore accurately described as "The Soggy Cove".\nThis dive is the closest watering hole to both\nthe spaceport and the tide water. The smell of\nsalt and stale ion emissions fill the air as you\nsurvey a motley gathering of strung out spacers.\n\nAs you make your way to the bar you draw the gaze\nof various denizens scattered haphazardly around\nthe room. Some hostile, some indifferent, either\nway you pointedly avoid eye contact as you make\nyour way towards a seat.',
      {
        fontSize: "18px",
        fill: "#fff"
      }
    );
    this.add.image(550, 640, "planetMenuButton");
    this.add.image(250, 640, "planetMenuButton");
    this.add.text(490, 627, "2> Leave", {
      fontSize: "24px",
      fill: "#fff"
    });

    //controls

    button1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    button2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
  }
  update() {
    if (button2.isDown) {
      this.scene.start("menu");
    }
  }
}

//****************************Shipyard*************************** */

class Shipyard extends Phaser.Scene {
  constructor() {
    super({ key: "shipyard" });
  }
  preload() {
    this.load.image("planetMenuBG", "assets/planetMenuBG.png");
    this.load.image("cantinaMenu", "assets/cantinaMenu.png");
    this.load.image("planetMenuButton", "assets/menuButton.png");
  }
  create() {
    this.add.image(400, 400, "planetMenuBG");
    this.add.image(400, 400, "cantinaMenu");
  }
  update() {}
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  physics: {
    default: "arcade"
  },
  scene: [Cantina, StartPlanet, Menu, Shipyard]
};

let game = new Phaser.Game(config);
