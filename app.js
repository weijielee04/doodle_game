document.addEventListener('DOMContentLoaded', () => { // this is to ensure that the html is loaded before the java script file is load and process // select a element in the html file which in this case is the div called 'grid'
    const doodler = document.createElement('div') // creating a new div element in the html file called doodler
    const restartbtn = document.createElement('button')
    let doodlerLeftSpace = 50;
    let startPoint = 150
    let doodlerBottomSpace = startPoint;
    let isGameOver = true;
    let platformCount =5;
    let platforms = []
    let upTimeId;
    let downTimeId;
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerID
    let rightTimeID
    let score =0
    const seconds = 30;
    let scoreDisplay;
    const grid = document.getElementById('grid');
    const menu = document.getElementById('menu');
    const startbtn = document.getElementById('start');
    const scorebtn = document.getElementById('score');
    const settingbtn = document.getElementById('setting');
    const jumpSound = new Audio('./assests/cartoon-jump-6462.mp3');
    jumpSound.preload = 'auto';
    const gameOverSound = new Audio('./assests/kl-peach-game-over-iii-142453.mp3');
    gameOverSound.preload = 'auto';
    const Startaudio = new Audio ('./assests/game-start-6104.mp3');

    startbtn.onclick = function () {
        menu.style.display = 'none';
        grid.style.display = 'block';
        isGameOver = false;
        jumpSound.play().then(() => {
            jumpSound.pause();
            jumpSound.currentTime = 0;
        });

        gameOverSound.play().then(() => {
            gameOverSound.pause();
            jumpSound.currentTime = 0;
        });
        Startaudio.play();

        start();
    }

    scorebtn.onclick = () => {
        alert('High score feature coming soon!');
    }

    settingbtn.onclick = () => {
        alert('Settings page not implemented yet.');
    }



    function createDoodler(){
        grid.appendChild(doodler) // append the new created div element into the grid div
        doodler.classList.add('doodler'); // adding the class 'doodler' in the css file into this const doodler element.
        doodlerLeftSpace = platforms[0].left 
        doodler.style.left = doodlerLeftSpace +'px'; // changing the style of the class doodler to 50px to the left
        doodler.style.bottom = doodlerBottomSpace +'px';
    }

    class Platform {
        constructor(newPlatBottom){
            this.bottom = newPlatBottom // the bottom of the new platform is based on the element NewPlaformBottom
            this.left = Math.random()*315 // this is to determine the left and right location of the plaform which in this case is random because using math.random and * 315 is because the plaform itself is contain the spcaing of 85px and the total spacing of the game is 400px width so 400-85 is 315px.
            this.visual = document.createElement('div'); // creating a new div element called this.visual

            const visual = this.visual 
            visual.classList.add('platform'); // adding the css file class 'platform' style into the visaul element
            visual.style.left = this.left + 'px'; // adding each left location style into the plaform
            visual.style.bottom = this.bottom + 'px'; // adding each bottom location style into the plaform based on the newPlatBottom 

            grid.appendChild(visual)
        }
    }



    function createPlatforms(){
        for (let i = 0; i < platformCount; i++){ // there is 5 plaform need to printed in the screen
            let platGap = 600 / platformCount // the screen have total of height 600px so the space in between will be 600 divided by 5 
            let newPlatBottom = 100 + i * platGap // setting the newPlaformBottom to the value of 100 + 1*120  (this is the location where the new plaform going to be located)
            let newPlatform = new Platform (newPlatBottom) //creating the new platform in the location indicated in the newPlatform
            platforms.push(newPlatform) // the new created plaform will then we added into the plaforms array.
        }
    }

    function movePlatforms(){
        if (doodlerBottomSpace >200){ // if the doodler reach the space of 200px or above then the platform will be moving 4 px down
            platforms.forEach(platform => {
                platform.bottom -=4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + "px"

                if (platform.bottom < 10){
                    let firstPlaform = platforms[0].visual
                    firstPlaform.classList.remove('platform')
                    platforms.shift()
                    score ++

                    let newPlaform = new Platform(600)
                    platforms.push(newPlaform)
                }


            })
        }
    }

    function jump(){
        clearInterval(downTimeId)
        isJumping = true
        upTimeId = setInterval( function() {
            doodlerBottomSpace += 10
            doodler.style.bottom = doodlerBottomSpace + 'px'
            console.log(doodlerBottomSpace)
            if (doodlerBottomSpace > startPoint +200 || doodlerBottomSpace > 580){
                fall()
            }
        },seconds)
        jumpSound.currentTime = 0; // rewind to start
        jumpSound.play();
    }

    function fall(){
        clearInterval(upTimeId)
        isJumping = false
        downTimeId = setInterval (function () {
            doodlerBottomSpace -=5
            doodler.style.bottom = doodlerBottomSpace +'px'
            if(doodlerBottomSpace <=0){
                gameOver()
                gameOverSound.currentTime = 0;
                gameOverSound.play();
            }
            platforms.forEach(platform => {
                if ( 
                    (doodlerBottomSpace >= platform.bottom) && 
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    ((doodlerLeftSpace + 60 ) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left +85)) &&
                    !isJumping
                ) {
                    console.log('landed')
                    startPoint = doodlerBottomSpace
                    jump()
                }
            })

        },seconds)

    }

    restartbtn.onclick = function () {
        isGameOver = false
        if (scoreDisplay) scoreDisplay.remove()
        restartbtn.remove()
        platforms = []
        doodlerBottomSpace = startPoint
        doodlerLeftSpace = 50
        score = 0
        
        Startaudio.play();
        start()
    }

    function gameOver(){
        console.log("Game Over")
        isGameOver = true

        while (grid.firstChild){
            grid.removeChild(grid.firstChild)
        }

        scoreDisplay = document.createElement('h2') // use global variable
        scoreDisplay.classList.add('score-display')
        scoreDisplay.textContent =  score
        grid.appendChild(scoreDisplay)

        restartbtn.textContent = 'Try Again';
        restartbtn.classList.add('restart-button')
        grid.appendChild(restartbtn)

        clearInterval(upTimeId)
        clearInterval(downTimeId)
        clearInterval(leftTimerID)
        clearInterval(rightTimeID)
    }


    function control(e) {
        if (e.key === "ArrowLeft"){
            moveLeft()
        } else if (e.key === "ArrowRight"){
            moveRight()
        } else if (e.key === "ArrowUp"){
            moveStraight()
        }
    }

    function moveLeft(){
        if (isGoingRight){
            clearInterval(rightTimeID)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerID = setInterval(function () {
            if( doodlerLeftSpace >= 0 ){
                doodlerLeftSpace -=5
                doodler.style.left = doodlerLeftSpace + "px"
            }else moveRight()   
        },20)
    }

    function moveRight(){
        if(isGoingLeft){
            clearInterval(leftTimerID)
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimeID = setInterval (function () {
            if(doodlerLeftSpace <= 340 ){
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace +'px'
            }else moveLeft()
        }, 20)
    }

    function moveStraight() {
        isGoingLeft = false
        isGoingRight = false
        clearInterval (leftTimerID)
        clearInterval (rightTimeID)
    }


    function start(){
        if (!isGameOver){
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms,30) 
            jump()
            document.addEventListener('keyup',control)
        }
        else{
            restart()
        }
    }



})