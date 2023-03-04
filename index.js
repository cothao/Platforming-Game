const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight
class Player {
    constructor({position, width, height, velocity}) {
        this.position = position
        this.width = width
        this.height = height
        this.velocity = velocity
        this.gravity = 1.5
    }
    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
            this.position.x -= this.velocity.dx
            this.position.y += this.velocity.dy
        if (this.position.y + this.height + this.velocity.dy <= innerHeight) {
            this.velocity.dy += this.gravity; // increase gravity while the cube is in the air
        } else {
            this.velocity.dy = 0
        }
        
        this.draw()
    }
}

class Platform {
    constructor({position, width, height}) {
        this.position = position
        this.width = width
        this.height = height
    }

    draw() {
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
    }
}

const platforms = [
  new Platform({
    position: {
      x: 200,
      y: 100,
    },
    width: 200,
    height: 20,
  }),
  new Platform({
    position: {
        x: 300,
        y: 200
    },
    width: 200,
    height: 20
  })
];

const player = new Player({
    position: {
        x: 100,
        y: 100
    },
    width: 30,
    height: 30,
    velocity: {
        dx: 0,
        dy: 0
    }
})

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0

const animate = function() {
    window.requestAnimationFrame(animate)
    c.clearRect(0,0, innerWidth, innerHeight)
    console.log(player.velocity.dy)
    player.update()
    platforms.forEach(platform => {
        platform.update()
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
    })
    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.dx = -5
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.dx = 5
    } else { // if its NOT less then 400 and NOT more than 100, the velocity is 0 and the new code initiates
        player.velocity.dx = 0
        if (keys.right.pressed) {
            platforms.forEach((platform) => {
                platform.position.x -= 5
                scrollOffset += 5
            });
        } else if (keys.left.pressed) {
            platforms.forEach((platform) => {
                platform.position.x += 5
                scrollOffset -= 5
            });
        }
    }

    platforms.forEach(platform => {
    if (player.position.y + player.height <= platform.position.y && 
        player.position.y + player.height + player.velocity.dy >= platform.position.y &&  // this line is added to make sure that the cube will always land on the platform, adding the velocity makes sure that whenever the cube equals the height of the platform, adding velocity will always be MORE than the height, so it then goes down to 0
        player.position.x + player.width >= platform.position.x && 
        player.position.x <= platform.position.x + platform.width) {
        player.velocity.dy = 0
    }
})
    if (scrollOffset > 2000) {
        console.log('you win!')
    }
}

animate()

//EVENT LISTENERS
addEventListener('keydown', (e) => {
    switch (e.key) {
      case "a":
        keys.left.pressed = true
        console.log("left");
        break;
      case "s":
        console.log("down");
        break;
      case "d":
        keys.right.pressed = true
        break;
      case "w":
        player.velocity.dy -= 20
        console.log("up");
        break;
    }
})

addEventListener("keyup", (e) => {
  switch (e.key) {
    case "a":
        keys.left.pressed = false
      console.log(player.velocity.dx);
      break;
    case "s":
      console.log("down");
      break;
    case "d":
        keys.right.pressed = false;
      console.log(player.velocity.dx);
      break;
    case "w":
      console.log("up");
      break;
  }
});