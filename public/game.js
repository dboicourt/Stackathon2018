let playerItems = {
  wallet: 1000,
  cargo: [
    (food = {
      name: "Food",
      quantity: 0
    }),
    (metal = {
      name: "Metal",
      quantity: 0
    }),
    (medicine = {
      name: "Medicine",
      quantity: 0
    }),
    (components = {
      name: "Components",
      quantity: 0
    })
  ]
};

let player;
let cursors;
let bullets;
let lastFired = 0;
let fire;
let planet;
let land;
let button1;
let button2;
let button3;
let button4;
let button5;
let button6;
let button7;
let button8;
let button9;

class StartMenu extends Phaser.Scene {
  constructor() {
    super({ key: "startScreen" });
  }
  preload() {
    this.load.image("space", "assets/SpaceBackdrop.png");
    this.load.image("menu", "assets/cantinaMenu.png");
  }
  create() {
    this.add.image(400, 400, "space");
    this.add.image(400, 400, "menu");
    this.add.text(150, 160, "WELCOME TO THE VERSE", {
      fontSize: "42px",
      fill: "#fff"
    });
    this.add.text(260, 630, "Press Space to Start", {
      fontSize: "24px",
      fill: "#fff"
    });
    fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }
  update() {
    if (fire.isDown) {
      this.scene.start("startPlanet");
    }
  }
}

//******************************Space View******************** */

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
    player = this.physics.add.image(400, 400, "ship");
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
    if (button2.isDown) {
      this.scene.start("market");
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

let bigAlInventory = [
  (heavyCannon = {
    name: "Heavy Plasma Cannon",
    class: "fixedWeapon",
    price: 30000
  }),
  (lazTurret = {
    name: "Light Laser Turret",
    class: "turretWeapon",
    price: 45000
  }),
  (mediumHauler = {
    name: "YT1300 Medium Freighter",
    class: "ship",
    price: 7000000
  }),
  (lightFighter = {
    name: "Swordfish Light Fighter",
    class: "ship",
    price: 3250000
  })
];

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
    this.add.text(235, 130, "Big Al's Shipyard", {
      fontSize: "32px",
      fill: "#fff"
    });
    this.add.text(290, 180, `Account: $${playerItems.wallet}`, {
      fontSize: "24px",
      fill: "#fff"
    });
    let itemSpacing = 0;
    let itemNum = 1;
    bigAlInventory.forEach(item => {
      this.add.text(150, 240 + itemSpacing, `${itemNum}> ${item.name}`, {
        fontSize: "18px"
      });
      itemNum++;
      itemSpacing = itemSpacing + 35;
    });
    let priceSpacing = 0;
    bigAlInventory.forEach(item => {
      this.add.text(560, 240 + priceSpacing, `$${item.price}`, {
        fontSize: "18px"
      });
      priceSpacing = priceSpacing + 35;
    });
    this.add.image(400, 640, "planetMenuButton");
    this.add.text(340, 627, "9> Leave", {
      fontSize: "24px",
      fill: "#fff"
    });

    //controls

    button1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    button2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    button3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    button4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
    button9 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE);
  }
  update() {
    if (button1.isDown && playerItems.wallet < bigAlInventory[0].price) {
      this.add.text(302, 580, "Insufficient Funds", {
        fontSize: "18px",
        fill: "#f00"
      });
    }
    if (button2.isDown && playerItems.wallet < bigAlInventory[1].price) {
      this.add.text(302, 580, "Insufficient Funds", {
        fontSize: "18px",
        fill: "#f00"
      });
    }
    if (button3.isDown && playerItems.wallet < bigAlInventory[2].price) {
      this.add.text(302, 580, "Insufficient Funds", {
        fontSize: "18px",
        fill: "#f00"
      });
    }
    if (button4.isDown && playerItems.wallet < bigAlInventory[3].price) {
      this.add.text(302, 580, "Insufficient Funds", {
        fontSize: "18px",
        fill: "#f00"
      });
    }
    if (button9.isDown) {
      this.scene.start("menu");
    }
  }
}

//*********************************Market**************************** */

let shopInventory = [
  (food = {
    name: "Food",
    price: 150
  }),
  (metal = {
    name: "Metal",
    price: 350
  }),
  (medicine = {
    name: "Medicine",
    price: 575
  }),
  (components = {
    name: "Components",
    price: 435
  })
];

class Market extends Phaser.Scene {
  constructor() {
    super({ key: "market" });
  }
  preload() {
    this.load.image("planetMenuBG", "assets/planetMenuBG.png");
    this.load.image("cantinaMenu", "assets/cantinaMenu.png");
    this.load.image("planetMenuButton", "assets/menuButton.png");
  }
  create() {
    this.add.image(400, 400, "planetMenuBG");
    this.add.image(400, 400, "cantinaMenu");
    this.add.text(265, 130, "Astoria Market", {
      fontSize: "32px",
      fill: "#fff"
    });
    this.add.text(290, 180, `Account: $${playerItems.wallet}`, {
      fontSize: "24px",
      fill: "#fff"
    });
    let cargoSpacing = 0;
    let cargoNum = 1;
    playerItems.cargo.forEach(item => {
      this.add.text(150, 240 + cargoSpacing, `${cargoNum}> ${item.name}`, {
        fontSize: "18px",
        fill: "#fff"
      });
      this.add.text(560, 240 + cargoSpacing, `${item.quantity}`, {
        fontSize: "18px",
        fill: "#fff"
      });
      cargoNum++;
      cargoSpacing = cargoSpacing + 35;
    });

    this.add.text(
      150,
      380,
      "--------------------------------------------------"
    );

    let inventorySpacing = 0;
    let invNum = 5;
    shopInventory.forEach(item => {
      this.add.text(150, 420 + inventorySpacing, `${invNum}> ${item.name}`, {
        fontSize: "18px",
        fill: "#fff"
      });
      this.add.text(560, 420 + inventorySpacing, `$${item.price}`, {
        fontSize: "18px",
        fill: "#fff"
      });
      invNum++;
      inventorySpacing = inventorySpacing + 35;
    });
    this.add.image(400, 640, "planetMenuButton");
    this.add.text(340, 627, "9> Leave", {
      fontSize: "24px",
      fill: "#fff"
    });
    //controls
    button1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    button2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    button3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    button4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
    button5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
    button6 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
    button7 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN);
    button8 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT);
    button9 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE);
  }

  update() {
    //sell items
    if (button1.isDown && playerItems.cargo[0].quantity < 1) {
      this.add.text(302, 580, "Insufficient Cargo", {
        fontSize: "18px",
        fill: "#f00"
      });
    } else if (button1.isDown) {
      playerItems.wallet = playerItems.wallet + shopInventory[0].price;
      playerItems.cargo[0].quantity--;
      this.scene.start("market");
    }
    if (button2.isDown && playerItems.cargo[1].quantity < 1) {
      this.add.text(302, 580, "Insufficient Cargo", {
        fontSize: "18px",
        fill: "#f00"
      });
    } else if (button2.isDown) {
      playerItems.wallet = playerItems.wallet + shopInventory[1].price;
      playerItems.cargo[1].quantity--;
      this.scene.start("market");
    }
    if (button3.isDown && playerItems.cargo[2].quantity < 1) {
      this.add.text(302, 580, "Insufficient Cargo", {
        fontSize: "18px",
        fill: "#f00"
      });
    } else if (button3.isDown) {
      playerItems.wallet = playerItems.wallet + shopInventory[2].price;
      playerItems.cargo[2].quantity--;
      this.scene.start("market");
    }
    if (button4.isDown && playerItems.cargo[3].quantity < 1) {
      this.add.text(302, 580, "Insufficient Cargo", {
        fontSize: "18px",
        fill: "#f00"
      });
    } else if (button4.isDown) {
      playerItems.wallet = playerItems.wallet + shopInventory[3].price;
      playerItems.cargo[3].quantity--;
      this.scene.start("market");
    }

    //buy items

    if (button5.isDown && playerItems.wallet < shopInventory[0].price) {
      this.add.text(302, 580, "Insufficient Funds", {
        fontSize: "18px",
        fill: "#f00"
      });
    } else if (button5.isDown) {
      playerItems.wallet = playerItems.wallet - shopInventory[0].price;
      playerItems.cargo[0].quantity++;
      this.scene.start("market");
    }
    if (button6.isDown && playerItems.wallet < shopInventory[1].price) {
      this.add.text(302, 580, "Insufficient Funds", {
        fontSize: "18px",
        fill: "#f00"
      });
    } else if (button6.isDown) {
      playerItems.wallet = playerItems.wallet - shopInventory[1].price;
      playerItems.cargo[1].quantity++;
      this.scene.start("market");
    }
    if (button7.isDown && playerItems.wallet < shopInventory[2].price) {
      this.add.text(302, 580, "Insufficient Funds", {
        fontSize: "18px",
        fill: "#f00"
      });
    } else if (button7.isDown) {
      playerItems.wallet = playerItems.wallet - shopInventory[2].price;
      playerItems.cargo[2].quantity++;
      this.scene.start("market");
    }
    if (button8.isDown && playerItems.wallet < shopInventory[3].price) {
      this.add.text(302, 580, "Insufficient Funds", {
        fontSize: "18px",
        fill: "#f00"
      });
    } else if (button8.isDown) {
      playerItems.wallet = playerItems.wallet - shopInventory[3].price;
      playerItems.cargo[3].quantity++;
      this.scene.start("market");
    }
    //return to last scene

    if (button9.isDown) {
      this.scene.start("menu");
    }
  }
}
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  physics: {
    default: "arcade"
  },
  scene: [StartMenu, Market, Shipyard, Cantina, StartPlanet, Menu]
};

let game = new Phaser.Game(config);
