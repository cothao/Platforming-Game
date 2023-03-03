const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight
class Player {
    constructor({position, width, height}) {
        this.position = position
        this.width = width
        this.height = height
    }
    draw() {
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {

        this.draw()
    }
}

const player = new Player({
    position: {
        x: 100,
        y: 100
    },
    width: 100,
    height: 100
})

const animate = function() {
    window.requestAnimationFrame(animate)

    player.update()
}

animate()