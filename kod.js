
const blackbox = document.querySelector(".blackbox")
const youDied = document.querySelector(".you-died")
const pressEnter = document.querySelector(".press-enter")
const infoBox = document.querySelector(".info-box")
const generalInfo = document.querySelector(".general-info")
const winScreen = document.querySelector(".win")
const winText = document.querySelector(".win-text")
const pause = document.querySelector(".pause")


infoBox.addEventListener('click', ()=>{
    generalInfo.classList.toggle('general-info-click')
})
infoBox.addEventListener('blur', ()=>{
    generalInfo.classList.remove('general-info-click')
})

const cnv = document.getElementById("snake")
const ctx = cnv.getContext("2d")

//basic unit
const box = 32;

//images
const ground = new Image()
ground.src = "./img/ground.png"
const foodImg = new Image()
foodImg.src = "./img/food.png"

//audio
let dead = new Audio()
let eat = new Audio()
let up = new Audio()
let right = new Audio()
let left = new Audio()
let down = new Audio()
let winner = new Audio()

dead.src = "audio/dead.mp3"
eat.src = "audio/eat.mp3"
up.src = "audio/up.mp3"
right.src = "audio/right.mp3"
left.src = "audio/left.mp3"
down.src = "audio/down.mp3"
winner.src = "audio/winner.mp3"

//snake
const snake = []
snake[0] = {
    x: 9*box,
    y: 10*box
}
//food
const food = {
    x: Math.floor(Math.random()*15 + 2) * box,
    y: Math.floor(Math.random()*13 + 4) * box
}
if (food.x === 9*box || food.y === 10*box) {
    food.x = Math.floor(Math.random()*15 + 2) * box
    food.y = Math.floor(Math.random()*13 + 4) * box
}

//snake control
let d;
document.addEventListener('keydown', direction)
function direction(e){
    if(e.key === "ArrowUp" && d!="DOWN"){
        d = "UP"
        up.play()
    }else if(e.key === "ArrowRight" && d!="LEFT"){
        d = "RIGHT"
        right.play()
    }else if(e.key === "ArrowDown" && d!="UP"){
        d = "DOWN"
        down.play()
    }else if(e.key === "ArrowLeft" && d!="RIGHT"){
        d = "LEFT"
        left.play()
    }
}

//collision
function collision(head, array){
    for(let i=0; i<array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true
        }
    }
    return false
}


//score
let score = 0
let highScore = localStorage.getItem('highScore')
if(highScore===null) {
    localStorage.setItem('highScore', 0)
    highScore = localStorage.getItem('highScore')
}
let deadCount = localStorage.getItem('localDeadCount');
if(deadCount===null) {
    localStorage.setItem('localDeadCount', 0)
    deadCount = localStorage.getItem('localDeadCount')
}
let winCount = localStorage.getItem('localWinCount')
if(winCount===null) {
    localStorage.setItem('localWinCount', 0)
    winCount = localStorage.getItem('localWinCount')
}

//speed
let gameSpeed = 100;
let speedFlag = 0;
const speedFunction = (speedValue) =>{
    gameSpeed = speedValue
    clearInterval(game)
    game = setInterval(draw, gameSpeed)
}
document.addEventListener('keydown', (e)=>{
    if(e.key === "Enter"){
        pressEnter.style.visibility = 'hidden'
        snake.splice(1)
        score = 0;
        speedFlag = 1;
    }
})
//colors
const colorDefault = "rgb(230, 230, 0)"
const color0 = "rgb(0, 150, 50)"
const color1 = "rgb(0, 160, 160)"
const color2 = "rgb(40, 40, 160)"
const color3 = "rgb(200, 0, 150)"
const color4 = "rgb(230, 50, 0)"
let color = colorDefault;
//pause
const pauseSpeed = 90000000
let pauseFlag = 0
document.addEventListener('keydown', (e)=>{
    if(e.key === " "){
        if(pauseFlag === 0){
            pauseFlag = 1
            clearInterval(game)
            pause.style.visibility = 'visible'
            game = setInterval(draw, pauseSpeed)
        }
        else if(pauseFlag === 1){
            pauseFlag = 0
            clearInterval(game)
            pause.style.visibility = 'hidden'
            game = setInterval(draw, gameSpeed)
        }
    }
})

//drawing function
function draw(){
    //draw board
    ctx.drawImage(ground, 0, 0)

    //draw snake body
    for(let i=0; i<snake.length; i++){
        ctx.fillStyle = (i===0)? color: "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box)
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box)
    }
    //draw food
    ctx.drawImage(foodImg, food.x, food.y)

    
    //old head position
    let snakeX = snake[0].x
    let snakeY = snake[0].y
    

    //direction
    if (d=="UP") snakeY -= box
    if (d=="RIGHT") snakeX += box
    if (d=="DOWN") snakeY += box
    if (d=="LEFT") snakeX -= box


    //eating
    if(snakeX == food.x && snakeY == food.y){
        score++
        if(score>highScore){
            localStorage.setItem('highScore', score)
        }
        eat.play()
//          food.x = Math.floor(Math.random()*17 + 1) * box
//          food.y = Math.floor(Math.random()*15 + 3) * box
        food.x = Math.floor(Math.random()*5 + 4) * box
        food.y = Math.floor(Math.random()*3 + 7) * box
        for(let i=0, n=snake.length; i<n; i++){
            if (food.x === snake[i].x && food.y === snake[i].y) {
                food.x = Math.floor(Math.random()*17 + 1) * box
                food.y = Math.floor(Math.random()*15 + 3) * box
        }}
        }else{
            snake.pop()
        }


    //add new head
    let newHead = {
        x: snakeX,
        y: snakeY
    }

    //changing speed
    if(speedFlag){
        if(score == 0 && gameSpeed != 150){
            color = color0
            speedFunction(150)
        }
        else if(score == 1 && gameSpeed != 100){
            speedFunction(100)
            color = color1
        }
        else if(score == 4 && gameSpeed != 75){
            speedFunction(75)
            color = color2
        }
        else if(score == 7 && gameSpeed != 50){
            speedFunction(50)
            color = color3
        }
        else if(score == 9 && gameSpeed != 40){
            speedFunction(40)
            color = color4
        }
    }

    //game over
    if(snakeX < box || snakeX > 17*box || snakeY < 3*box || snakeY > 17*box || collision(newHead, snake)){
        deadCount++;
        localStorage.setItem('localDeadCount', deadCount)
        clearInterval(game)
        dead.play();
        youDied.classList.add("dead")
        blackbox.style.opacity = 1;
        infoBox.style.zIndex = 0;
        addEventListener('keydown', (e)=>{
            if(e.key === "Enter") window.location.reload();
        });
        addEventListener('keydown', (e)=>{
            if(e.key === " ") window.location.reload();
        });
        document.removeEventListener('keydown', direction);
        (()=>{
            setTimeout(()=>{
                window.location.reload();
            },7000)
        })()
    }

    //victory
    if (speedFlag && score === 10){
        speedFlag = 0
        winner.play();
        winCount++;
        infoBox.style.zIndex = 0;
        winScreen.style.opacity = 1;
        winScreen.style.transitionDelay = ".5s"
        winText.style.opacity = 1;
        winText.style.transitionDelay = "1.5s"
        localStorage.setItem('localWinCount', winCount);
        addEventListener('keydown', (e)=>{
            if(e.key === "Enter") window.location.reload();
        });
        addEventListener('keydown', (e)=>{
            if(e.key === " ") window.location.reload();
        });
        (()=>{
            setTimeout(()=>{
                clearInterval(game)
            },gameSpeed)
        })();
        (()=>{
            setTimeout(()=>{
                window.location.reload();
            },50000)
        })()
        
    }



    snake.unshift(newHead)


    ctx.fillStyle = "white"
    ctx.font = "35px aial"
    ctx.fillText(score, 2*box, 1.6*box)
    ctx.fillText(`High Score: ${localStorage.getItem('highScore')}`, 4*box, 1.6*box)
    ctx.fillText(`Times Won: ${localStorage.getItem('localWinCount')}`, 12*box, 1.6*box)

}


let game = setInterval(draw, gameSpeed)