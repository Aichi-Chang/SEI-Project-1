function main () {

  // Space Invaders Rules:

  // The player aims to shoot an invading alien armada, 
  // before it reaches the planet's surface using a mounted gun turret.

  // The player can only move left or right. 

  // The aliens also move from left to right, 
  // and also down each time the reach the side of the screen. 
  // The aliens also periodically drop bombs towards the player.

  // Once the player has destroyed a wave of aliens, the game starts again. 
  // The aim is to achieve the highest scoreTag possible 
  // before either being destroyed by the aliens, 
  // or allowing them to reach the planet's surface.

  // The player should be able to clear at least one wave of aliens
  // The player's scoreTag should be displayed at the end of the game

  
  // Pseudo Code:

  // *** SET UP & RESTART *** ------------------------------------------------------------------------------------------

  const gridWidth = 20 
  const gridSize = gridWidth ** 2
  const grid = document.querySelector('.grid')
  
  let cells = []

  let player = 390

  const width = 20
  let loselive = false
  let playing = false

  const scoreTag =  document.querySelector('.score')
  const endgameScore = document.querySelector('.endgameScore')
  const startTag = document.querySelector('.start')
  // const pauseTag = document.querySelector('.pause')
  const resetTag = document.querySelector('.reset')
  const titleTag = document.querySelector('.titleSequence')
  const bodyTag = document.querySelector('body')

  const alienWave = [1,1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,width,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1,width]
  
  let aliens = [20,21,22,23,24,25,26,27,28,29,41,42,43,44,45,46,47,48,49,50,62,63,64,65,66,67,68,69,70,71,72]
  // aliensOrigin = [20,21,22,23,24,25,26,27,28,29,41,42,43,44,45,46,47,48,49,50,62,63,64,65,66,67,68,69,70,71,72],
  let alienArray = aliens.slice() // to use for reset, slice modifies existing array

  let currentAlienPos = 0

  let moveAliensId,
    dropBombsId,
    bulletId

  

  // let bullet
  // let bulletId
  scoreTag.style.visibility = 'hidden'
  resetTag.style.visibility = 'hidden'
  bodyTag.style.backgroundImage = 'linear-gradient(200deg, rgba(47, 153, 146, 0.5), rgb(40, 45, 148, 0.5), rgb(146, 78, 230, 0.5))'
  
  // set up grids -------------------------------------------------------------------------------------------------------

  for (let i = 0; i < gridSize; i++) {
    const cell = document.createElement('div')
    grid.appendChild(cell)  // so we have easy access to the cells we created
    cells.push(cell)
    // console.log(cells)
  }
  

  // set up player -------------------------------------------------------------------------------------------------------
  // when game loaded, the gun turret shows up at the last line of the grid, 
  // the player cannot move up and down, but can move to left and right


  function addPlayer () {
    cells[player].classList.add('player')
  }

  document.addEventListener('keydown', e => {
    if (alienArray.length === 0) {
      return
    } else if (barWidth < 0) {
      return
    } else {
      switch (e.key) {
        case 'a': {
          if (player < 381) {
            return
          }
          cells[player].classList.remove('player')
          player = player - 1
          cells[player].classList.add('player')
          break
        }
        case 'd': {
          // player should be bigger than 89
          if (player === (gridSize - 1)) {
            return
          }
          cells[player].classList.remove('player')
          player = player + 1
          cells[player].classList.add('player')
          break
        } 
      }

      if (e.key === '/') {
        bulletCrush()
      } 

    }

  })
  

  // set up aliens -------------------------------------------------------------------------------------------------------
  // when game loaded, there will be 3 lines of aliens to start with
  // when the aliens bumped into the wall on the left, the whole group goes to the opposit direction
  // same rule apply to the other side of the wall
  // in every few seconds, the lines will drop down one grid
  

  function createAliens() {
    alienArray.forEach(alien => {
      // console.log(alien)
      cells[alien].classList.add('oneAlien')
    })
  }

  function moveAliens() {

    alienArray.forEach(alien => {
      cells[alien].classList.remove('oneAlien') // loop through all aliens and clear the class
    })

    alienArray = alienArray.map(alien => alien + alienWave[currentAlienPos]) // find new alien positions
    // console.log(alienArray)
    alienArray.forEach(alien => {
      cells[alien].classList.add('oneAlien')
    }) // add class oneAlien to alien's new position

    currentAlienPos++ // increase the number so aliens will start to move
    // console.log(currentAlienPos)

    if (currentAlienPos === alienWave.length) {
      currentAlienPos = 0
    }
    // console.log(alienArray)
  }

  // in EVERY MINUTE, another 3 lines of alien will follow droping down
  // the same rule applys to the rest of the aliens as well

  // *** Under Construction ***
  
  // function newAliens () {
  //   setTimeout(newAliens, 5000)
  //   alienArray = aliensOrigin
  //   console.log('hola')
  //   console.log(alienArray)
  // }

  // *** Under Construction ***
  


  function startGame () {
    
    playing = true

    cells.forEach(grid => {
      grid.classList.remove('oneAlien', 'player', 'bomb', 'bullet', 'explosion', 'playerCrush')
    })

    alienArray = aliens.slice()

    player =  390
    cells[player].classList.add('player')
    console.log(player)
    
    startTag.style.visibility = 'hidden'
    bodyTag.style.backgroundImage = "url('http://getwallpapers.com/wallpaper/full/b/8/f/840045-amazing-background-space-1920x1080-retina.jpg')"
    scoreTag.style.visibility = 'visible'
    progressBar.style.visibility = 'visible'
    titleTag.style.visibility = 'hidden'
    scoreTag.innerHTML = 0
    
    currentAlienPos = 0

    threeLives()
    createAliens()
    moveAliensId = setInterval(moveAliens, 300)
    dropBombsId = setInterval(dropBombs, 600)
    addPlayer()
    moveAliens()
    dropBombs()
    // bulletCrush()

    
  }


  // *** SHOOTING ***  ----------------------------------------------------------------------------------------------------
  // when player hit space key, the gun will shoot out a bullet towards the aliens
  // when bullet hits the alien, the bullet AND the alien will both disapear and player gets 1 score
  // IF the bullet doesn't hit any aliens, when it gets to the end, it will disapear, and nothing will happen
  // one of the aliens(random one) in the LAST line will drop a bumb down to the player by EVERY 0.5 SECOND


  function dropBombs () {
    let dropBomb = alienArray[Math.floor(Math.random() * alienArray.length)]

    let bombId = setInterval(() => {
      if (!playing) {
        clearInterval(bombId)
      }
      // this cause an erro cause alienArrey doesn't exist anymore once the aliens are all cleared !!!!!!!
      cells[dropBomb].classList.remove('bomb')
      dropBomb = dropBomb + gridWidth

      if (!cells[dropBomb]) {
        clearInterval(bombId)
        return false  // why??
      }
      cells[dropBomb].classList.add('bomb')

      if (cells[dropBomb].classList.contains('player')) {

        cells[dropBomb].classList.remove('bomb')
        clearInterval(bombId)       
        // cells[dropBomb].classList.remove('player')
        cells[dropBomb].classList.add('playerCrush')

        setTimeout(() => {
          cells[dropBomb].classList.remove('playerCrush')
        }, 300)

        loselive = true // if player got hit then decrease the life bar
        lives() // this function will decrease it by 34 each time
        
        scoreTag.innerHTML = Number(scoreTag.innerHTML) - 1
        if (Number(scoreTag.innerHTML < 0)) {
          scoreTag.innerHTML = 0
        }
      

        if (barWidth < 0) {
          progressBar.style.width = '0%'
          clearInterval(moveAliensId)
          clearInterval(dropBombsId)
          // clearInterval(bombId)
          // clearInterval(bulletId)
          lost()
        }
      }
    }, 300)

  }


  function bulletCrush () {
    let bulletPos = player
    // console.log(bulletPos)

    let bulletId = setInterval(() => {
      // console.log(bullet)
      if (!playing) {
        clearInterval(bulletId)
      }
      
      if (bulletPos - gridWidth >= 0) {
        // console.log(bullet - gridWidth)
        cells[bulletPos].classList.remove('bullet')
        bulletPos -= gridWidth
        cells[bulletPos].classList.add('bullet')
      } else {
        cells[bulletPos].classList.remove('bullet')
        // clearInterval(bulletId)
      }

      if (cells[bulletPos].classList.contains('oneAlien')) {
        clearInterval(bulletId)
        cells[bulletPos].classList.remove('bullet')
        
        const alienPos = alienArray.indexOf(bulletPos)
        alienArray.splice(alienPos, 1)
        cells[bulletPos].classList.remove('oneAlien')
        cells[bulletPos].classList.add('explosion')
        setTimeout(() => {
          cells[bulletPos].classList.remove('explosion')
        }, 200)
        
        scoreTag.innerHTML = Number(scoreTag.innerHTML) + 1
      }

      if (alienArray.length === 0) {
        clearInterval(moveAliensId)
        clearInterval(dropBombsId)
        // clearInterval(bulletId)
        win()
      }

      
      // IF bullet hit the bumb, they will both disapear
      // *** Under Construction ***
      // if (cells[bullet].classList.contains('bomb')) {
      //   clearInterval(bulletId)
      //   clearInterval(bombId)
      //   cells[bullet].classList.remove('bullet')
      //   cells[bullet].classList.remove('bomb')
        
      //   // when bimb hit the bullet, both should disapear
      //   // need to figure this out!
      // }
      // *** Under Construction ***
      
    }, 200)
    
  }

  // *** START GAME *** -----------------------------------------------------------------------------------
  // once the player hit the start button, 
  // 3 lines of aliens will start moving to left as a group in EVERY 0.5 SECOND by grid



  // *** Not in Use ***
  // function alienIntervalManager (flag, animate, time) {
  //   if (flag) {
  //     moveAliensId = setInterval(animate, time)
  //   } else {
  //     clearInterval(moveAliensId)
  //   }
  // }
  // *** Not in Use ***
  

  // scoreTag bar, life bar and start button -----------------------------------------------------------------------------------
  // there will be a scoreTag bar somewhere to show player's scoreTag, it starts from 0
  // there will be a progress bar of 3 lives, once player lost one, it will go backwards
  // there will be a button for START, when player hits start, aliens will start to move

  const progressBar = document.querySelector('.progress')
  const fullBlood = 100
  let barWidth = 0
  
  function threeLives () {

    const intervalId = setInterval(lifeFrame, 10)

    function lifeFrame () {
      if (barWidth >= fullBlood) {
        clearInterval(intervalId)
      } else {
        barWidth++
        progressBar.style.width = barWidth + '%'
        progressBar.style.backgroundColor = '#43ff43'
        // console.log(width)
      }
    }
  }

  function lives(){
    if (loselive === true){
      barWidth -= 34
      progressBar.style.width = barWidth + '%'
    }
    if (barWidth < 70) {
      progressBar.style.backgroundColor = '#eb8934'
    }
    if (barWidth < 40) {
      progressBar.style.backgroundColor = '#f53e2a'
    }
    // if (barWidth < 0) {
    //   loselive = false
    //   progressBar.style.width = '0%'
    //   clearInterval(moveAliensId)
    //   clearInterval(dropBombsId)
    //   // clearInterval(bombId)
    //   // clearInterval(bulletId)
    //   lost()
    // }
    loselive = false
  }
  


  // *** GAME OVER ***  ---------------------------------------------------------------
  // the player will loss one life, and once the player lost 3 lives, GAME OVER (condition 1)
  // IF the bumb doesn't hit the gun, when it gets to the end, it will disapear, and nothing will happen
  // when the front line of the aliens reaches the end of the last grid line, GAME OVER (condition 2)
  // IF there is an alien in the same grid as the gun turret, the gun disapears before showing game over

  
 
  
  function endOfGame () {
    playing = false
    cells.forEach(grid => {
      grid.classList.remove('oneAlien', 'player', 'bomb', 'bullet', 'explosion', 'playerCrush')
    })
    clearInterval(moveAliensId)
    clearInterval(dropBombsId)
    clearInterval(bulletId)

    progressBar.style.visibility = 'hidden'
    scoreTag.style.visibility = 'hidden'
    resetTag.style.visibility = 'visible' 
    
  }



  function win () {
    
    endgameScore.innerHTML = `Hoooooray! Your Score is ${scoreTag.innerHTML}`
    endgameScore.style.visibility = 'visible'
    endOfGame()
    
  }

  function lost () {
    endgameScore.innerHTML = `GAME OVER! Your Score is ${scoreTag.innerHTML}`
    endgameScore.style.visibility = 'visible'
    endOfGame()
    

  }
  


  // *** RESET ***  -----------------------------------------------------------------------------------------------
  // when the game is over, prompt out to confirm if player wants to play again
  // if yes, resrt back to the start of the game, 
  // 1.) scoreTagTag board is back to 0 
  // 2.) player's life back to 3
  // 3.) clear out all the aliens and the gun turret 
  // 4.) 3 lines of aliens in place
  // 4.) gun turret in place

  


  startTag.addEventListener('click', () => {
    // if (moveAliensId) return
    startGame()
    // grid.style.visibility = 'visible'

  })

  // pauseTag.addEventListener('click', () => {
  //   clearInterval(moveAliensId)
  //   startTag.style.visibility = 'visible'
  //   pauseTag.style.visibility = 'hidden'
  //   clearInterval(dropBombId)
  // })
  
  resetTag.addEventListener('click', () => {
    endgameScore.style.visibility = 'hidden'
    resetTag.style.visibility = 'hidden'
    startTag.style.visibility = 'visible'
    startGame()
  })


}

window.addEventListener('DOMContentLoaded', main)