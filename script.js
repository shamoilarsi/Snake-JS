const cvs = document.getElementById('canvas')
const ctx = cvs.getContext('2d')

function constrain(value, min, max) {
    return (value < min ? min : (value > max ? max : value))
}

function distanceBetweenPoints(p1, p2) {
    return (Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2))
}


let audio_food = new Audio()
audio_food.src = 'assets/food.wav'

let audio_dead = new Audio()
audio_dead.src = 'assets/dead.mp3'


let sidePadding = 50
let score = {
    score: 0,
    draw: function() {
        ctx.font = "30px Retro";
        ctx.fillStyle = '#FFF'
        ctx.fillText(this.score, 15, 30);
    }
}

let frame = 0
let updatedByKey = false
let gameOver = {
    status: false,
    draw: function() {
        ctx.font = "60px Retro";
        ctx.fillStyle = '#FFF'
        ctx.fillText("Game Over", cvs.width/2 - 120, cvs.height/2);
    }
}

window.addEventListener('keydown', (e) => {
    c = e.key.toLowerCase()
    if (!gameOver.status) {
        if (c == 'w' && Math.abs(movingDirection.y) != snake.body[0].s) {
            movingDirection.x = 0
            movingDirection.y = -snake.body[0].s
            snake.draw()
            updatedByKey = true
        }
        else if (c == 'a' && Math.abs(movingDirection.x) != snake.body[0].s) {
            movingDirection.x = -snake.body[0].s
            movingDirection.y = 0
            snake.draw()
            updatedByKey = true
        }
        else if (c == 's' && Math.abs(movingDirection.y) != snake.body[0].s) {
            movingDirection.x = 0
            movingDirection.y = snake.body[0].s
            snake.draw()
            updatedByKey = true
        }
        else if (c == 'd' && Math.abs(movingDirection.x) != snake.body[0].s) {
            movingDirection.x = snake.body[0].s
            movingDirection.y = 0
            snake.draw()
            updatedByKey = true
        }
    }
    else if(c == 'r'){
        location.reload()
    }
})

let movingDirection = {
    x: 15,
    y: 0
}

let background = {
    draw: () => {
        ctx.beginPath()
        ctx.fillStyle = '#000'
        ctx.rect(0, 0, cvs.width, cvs.height)
        ctx.fill()

        score.draw()
    }
}

let food = {
    x: 20,
    y: 50,
    radius: 5.5,
    foodEaten: true,
    draw: function () {
        this.update();

        ctx.beginPath()
        ctx.fillStyle = '#ff0000'
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.fill()
    },
    update: function () {
        if (this.foodEaten) {
            this.foodEaten = false
            let isOkay = true
            do {
                isOkay = true

                this.x = Math.ceil((Math.floor(Math.random() * (cvs.width - sidePadding * 2)) + sidePadding) / snake.body[0].s) * snake.body[0].s
                this.y = Math.ceil((Math.floor(Math.random() * (cvs.height - sidePadding * 2)) + sidePadding) / snake.body[0].s) * snake.body[0].s
                snake.body.forEach((node) => {
                    if (this.x == node.x && this.y == node.y) {
                        isOkay = false
                    }
                })
            } while (!isOkay)
        }
    }
}

class Snake {
    x = 20
    y = 20
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    s = 15
    draw = function () {
        ctx.beginPath()
        ctx.fillStyle = '#adff2f'
        ctx.rect(this.x - this.s / 2, this.y - this.s / 2, this.s, this.s)
        ctx.fill()
    }
}

let snake = {
    body: [],
    draw: function () {
        this.update()
        this.checkCollision()
        this.body.forEach((part, index, obj) => {
            part.draw()
        });
    },
    update: function () {
        if (this.body[0].x == food.x && this.body[0].y == food.y) {
            food.foodEaten = true
            audio_food.play()
            score.score++

            let l = this.body.length - 1

            let newCoordinates = {
                x: this.body[l].x - this.body[l - 1].x,
                y: this.body[l].y - this.body[l - 1].y
            }

            this.body.push(new Snake((this.body[l].x + newCoordinates.x), (this.body[l].y + newCoordinates.y)))
        }

        let i = this.body.length - 1
        while (i > 0) {
            this.body[i].x = this.body[i - 1].x
            this.body[i].y = this.body[i - 1].y
            i--
        }

        this.body[0].x += movingDirection.x
        this.body[0].y += movingDirection.y

        this.body[0].x = (this.body[0].x) % cvs.width
        this.body[0].y = (this.body[0].y) % cvs.height

        if (this.body[0].x < 0)
            this.body[0].x = cvs.width
        if (this.body[0].y < 0)
            this.body[0].y = cvs.height
    },
    checkCollision: function () {
        node = this.body[0]
        let counter = 0

        this.body.forEach((elem) => {
            if (node.x == elem.x && node.y == elem.y) {
                counter++
                if (counter == 2) {
                    gameOver.status = true
                    audio_dead.play()
                }
            }
        })
    },
    reset: function () {
        this.body.push(new Snake(30, 60))
        this.body.push(new Snake(30, 75))
        this.body.push(new Snake(30, 90))
    }
}

function draw() {
    if (frame % 10 == 0 && !updatedByKey) {
        background.draw()
        food.draw()
        snake.draw()
    }
    else if (updatedByKey) {
        updatedByKey = false
        frame = 5
    }
    
    if (!gameOver.status) {
        requestAnimationFrame(draw)
        frame++ 
    }
    else {
        gameOver.draw()
    }
}

snake.reset();
draw();