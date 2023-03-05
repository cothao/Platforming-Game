const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
class Player {
  constructor({ position, width, height, velocity, speed }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.velocity = velocity;
    this.gravity = 1.5;
    this.spriteMargin = 30;
    this.speed = speed;
    this.image = createImage("./img/IdleRight.png");
    this.frames = 0;
    this.speedFrame = 0;
    this.sprites = {
      stand: {
        right: createImage("./img/IdleRight.png"),
        frameCount: 10,
      },
      run: {
        right: createImage("./img/PlayerWalk.png"),
        left: createImage("./img/walkLeft.png"),
        frameCount: 8,
      },
      jump: {
        right: createImage("./img/jump.png"),
        left: createImage('./img/jumpLeft.png'),
        frameCount: 3,
      },
    };
    this.currentSprite = this.sprites.stand.right;
    this.frameCount = this.sprites.stand.frameCount;
  }
  draw() {
    c.drawImage(
      this.currentSprite,
      (this.currentSprite.width / this.frameCount) * this.frames, // positions of where we want to start cropping, just like fillrect
      0,
      this.currentSprite.width / this.frameCount, //the end point of cropping
      this.image.height, // the endpoint of cropping
      // TO CROP, PUSH POSITION AND SIZE DOWN
      this.position.x,
      this.position.y,
      this.width,
      this.height + this.spriteMargin
    );
  }

  update() {
    this.speedFrame++;
    if (this.speedFrame % 5 === 0) {
      this.frames++;
    }
    if (this.frames > 9 && this.currentSprite === this.sprites.stand.right) {
      this.frames = 0;
    } else if (
      this.frames > 7 &&
      this.currentSprite === this.sprites.run.right
    ) {
      this.frames = 0;
    } else if (
      this.frames > 7 &&
      this.currentSprite === this.sprites.run.left
    ) {
      this.frames = 0;
    } else if (
      this.frames > 2 &&
      this.currentSprite === this.sprites.jump.right || this.currentSprite === this.sprites.jump.left
    ) {
      this.frames = 0;
    }
    this.position.x -= this.velocity.dx;
    this.position.y += this.velocity.dy;
    if (this.position.y + this.height + this.velocity.dy <= canvas.height) {
      this.velocity.dy += this.gravity; // increase gravity while the cube is in the air
    }
    this.draw();
  }
}

class Platform {
  constructor({ position, width, height, image }) {
    this.position = position;
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }

  update() {
    this.draw();
  }
}

class GenericObject {
  constructor({ position, image }) {
    this.position = position;
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }

  update() {
    this.draw();
  }
}

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

/// WHERE EVERYTHING IS MADE
let scrollOffset = 0;

let platformImage;

let platforms = [];

let player;

let genericObjects = [];

let keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  lastKey: ''
};

function init() {
  platformImage = createImage("./img/platform.png");
  platformSmallTallImage = createImage("./img/platformSmallTall.png");

  platforms = [
    new Platform({
      position: {
        x:
          platformImage.width * 4 +
          300 -
          1 +
          platformImage.width -
          platformSmallTallImage.width, // multiply by each platform generated
        y: 270,
      },
      width: createImage("./img/platformSmallTall.png").width,
      height: createImage("./img/platformSmallTall.png").height,
      image: createImage("./img/platformSmallTall.png"),
    }),
    new Platform({
      position: {
        x: -1,
        y: 470,
      },
      width: 200,
      height: 20,
      image: createImage("./img/platform.png"),
    }),
    new Platform({
      position: {
        x: platformImage.width - 3, // makes sure that the images are always that much apart from eachother
        y: 470,
      },
      width: 200,
      height: 20,
      image: platformImage,
    }),
    new Platform({
      position: {
        x: platformImage.width * 2 + 100, // multiply by each platform generated
        y: 470,
      },
      width: 200,
      height: 20,
      image: platformImage,
    }),
    new Platform({
      position: {
        x: platformImage.width * 3 + 300, // multiply by each platform generated
        y: 470,
      },
      width: 200,
      height: 20,
      image: platformImage,
    }),
    new Platform({
      position: {
        x: platformImage.width * 4 + 300 - 1, // multiply by each platform generated
        y: 470,
      },
      width: 200,
      height: 20,
      image: platformImage,
    }),
    new Platform({
      position: {
        x: platformImage.width * 5 + 700 - 1, // multiply by each platform generated
        y: 470,
      },
      width: 200,
      height: 20,
      image: platformImage,
    }),
  ];

  player = new Player({
    position: {
      x: 100,
      y: 100,
    },
    width: 180,
    height: 150,
    velocity: {
      dx: 0,
      dy: 0,
    },
    speed: 10,
  });

  genericObjects = [
    new GenericObject({
      position: {
        x: -1,
        y: -1,
      },
      width: createImage("./img/background.png").width,
      height: createImage("./img/background.png").height,
      image: createImage("./img/background.png"),
    }),
    new GenericObject({
      position: {
        x: -1,
        y: -1,
      },
      width: createImage("./img/hills.png").width,
      height: createImage("./img/hills.png").height,
      image: createImage("./img/hills.png"),
    }),
  ];

  scrollOffset = 0;
}

init();

const animate = function () {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  genericObjects.forEach((genericObject) => {
    genericObject.update();
  });
  platforms.forEach((platform) => {
    platform.update();
    //         if (keys.right.pressed && player.position.x < 400) {
    //     player.velocity.dx = -5
    // } else if (keys.left.pressed && player.position.x > 100) {
    //     player.velocity.dx = 5
    // } else { // if its NOT less then 400 and NOT more than 100, the velocity is 0 and the new code initiates
    //     player.velocity.dx = 0
    //     if (keys.right.pressed) {
    //         platform.position.x -= 5
    //     } else if (keys.left.pressed) {
    //         platform.position.x += 5
    //     }
    // }

    // if (player.position.y + player.height <= platform.position.y &&
    //     player.position.y + player.height + player.velocity.dy >= platform.position.y &&  // this line is added to make sure that the cube will always land on the platform, adding the velocity makes sure that whenever the cube equals the height of the platform, adding velocity will always be MORE than the height, so it then goes down to 0
    //     player.position.x + player.width >= platform.position.x &&
    //     player.position.x <= platform.position.x + platform.width) {
    //     player.velocity.dy = 0
    // }
  });
  player.update(); // always call player LAST so that it overlaps everything

  if (keys.right.pressed && player.position.x < 400) {
    // if my position is between a certain gap, than I am free to move, otherwise parallax screen initiates
    player.velocity.dx = -player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.dx = player.speed;
  } else {
    // if its NOT less then 400 and NOT more than 100, the velocity is 0 and the new code initiates
    player.velocity.dx = 0;
    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66; // make slower for nice parallax speed
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
    }
  }

  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.dy >=
        platform.position.y && // this line is added to make sure that the cube will always land on the platform, adding the velocity makes sure that whenever the cube equals the height of the platform, adding velocity will always be MORE than the height, so it then goes down to 0
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.dy = 0;
    }
  });
  if (scrollOffset > platformImage.width * 5 + 400 - 1) {
    console.log("you win!");
  }

  if (player.position.y > canvas.height) {
    init(); // we wrapped everything we have made inside of a function called init, which will reset all positions when we die
  }

  if (keys.right.pressed) {
    player.currentSprite = player.sprites.run.right;
    player.frameCount = player.sprites.run.frameCount;
  } else if (keys.left.pressed) {
    player.currentSprite = player.sprites.run.left;
    player.frameCount = player.sprites.run.frameCount;
  } else {
    player.currentSprite = player.sprites.stand.right;
    player.frameCount = player.sprites.stand.frameCount;
  }
  if (player.velocity.dy < 0 && keys.lastKey === 'd') {
      player.currentSprite = player.sprites.jump.right
      player.frameCount = player.sprites.jump.frameCount
  }
    if (player.velocity.dy < 0 && keys.lastKey === "a") {
      player.currentSprite = player.sprites.jump.left;
      player.frameCount = player.sprites.jump.frameCount;
    }
};

animate();
//EVENT LISTENERS
addEventListener("keydown", (e) => {
  switch (e.key) {
    case "a":
      keys.left.pressed = true;
        keys.lastKey = e.key;
      break;
    case "s":
      break;
    case "d":
      keys.right.pressed = true;
        keys.lastKey = e.key;
      break;
    case "w":
      player.velocity.dy -= 25;
      break;
  }
});

addEventListener("keyup", (e) => {
  switch (e.key) {
    case "a":
      keys.left.pressed = false;
        keys.lastKey = e.key
      break;
    case "s":
      break;
    case "d":
      keys.right.pressed = false;
        keys.lastKey = e.key;
      break;
    case "w":
      break;
  }
});
