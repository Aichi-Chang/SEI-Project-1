function main () {

  // *** SET UP *** ----------------------------------------------------------------------------------------------------

  const gridWidth = 20 
  const gridSize = gridWidth ** 2
  const grid = document.querySelector('.grid')
  const scoreTag =  document.querySelector('.score')
  const endgameScore = document.querySelector('.endgameScore')
  const startTag = document.querySelector('.start')
  // const pauseTag = document.querySelector('.pause')
  const resetTag = document.querySelector('.reset')
  const titleTag = document.querySelector('.titleSequence')
  const bodyTag = document.querySelector('body')
  const rules = document.querySelector('.rules')
  const alienWave = [1,1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,gridWidth,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1,gridWidth]
  
  let cells = []
  let aliens = [20,21,22,23,24,25,26,27,28,29,41,42,43,44,45,46,47,48,49,50,62,63,64,65,66,67,68,69,70,71,72]
  // aliensOrigin = [20,21,22,23,24,25,26,27,28,29,41,42,43,44,45,46,47,48,49,50,62,63,64,65,66,67,68,69,70,71,72],
  let alienArray = aliens.slice() // for reset, slice modifies existing array
  let currentAlienPos = 0
  let player = 390
  let loselive = false
  let playing = false
  let moveAliensId,
    dropBombsId,
    bulletId



  // title sequence set up ---------------------------------------------------------------------------------------------------

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
  // the player can use case a and case d to move left and right


  function addPlayer () {
    cells[player].classList.add('player')
  }   // set function to call out the player again when restart

  document.addEventListener('keydown', e => {
    if (alienArray.length === 0) {
      return  
    } else if (barWidth < 0) {
      return  // so player doesn't show up after winning or losing the game
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
      cells[alien].classList.remove('oneAlien')
      // cells[alien].classList.add('oneAlien') // loop through all aliens and clear the class
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
  


  // *** START GAME FUNCTION *** -------------------------------------------------------------------------------------------
  // once the player hit the start button, 
  // 3 lines of aliens will start moving to left as a group in EVERY 0.5 SECOND by grid

  function startGame () {
    
    playing = true  // change this to false when game ends

    cells.forEach(grid => {
      grid.classList.remove('oneAlien', 'player', 'bomb', 'bullet', 'explosion', 'playerCrush')
    })

    alienArray = aliens.slice()

    player =  390
    cells[player].classList.add('player')
    
    startTag.style.visibility = 'hidden'
    bodyTag.style.backgroundImage = "url('http://getwallpapers.com/wallpaper/full/b/8/f/840045-amazing-background-space-1920x1080-retina.jpg')"
    scoreTag.style.visibility = 'visible'
    progressBar.style.visibility = 'visible'
    titleTag.style.visibility = 'hidden'
    rules.style.visibility = 'hidden'
    scoreTag.innerHTML = 0
    
    currentAlienPos = 0

    threeLives()
    createAliens()
    moveAliensId = setInterval(moveAliens, 500)
    dropBombsId = setInterval(dropBombs, 500)
    addPlayer()
    moveAliens()
    dropBombs()
  }

  // *** Not in Use ***  interval manager
  // function alienIntervalManager (flag, animate, time) {
  //   if (flag) {
  //     moveAliensId = setInterval(animate, time)
  //   } else {
  //     clearInterval(moveAliensId)
  //   }
  // }
  // *** Not in Use ***


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
          lost()
        }
      }
    }, 300)
  }


  function bulletCrush () {
    let bulletPos = player

    let bulletId = setInterval(() => {

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


  
  // Life Bar ------------------------------------------------------------------------------------------------------
  // there will be a progress bar of 3 lives, once player lost one, it will go backwards


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
    loselive = false
  }
  


  // *** FIN ***  ---------------------------------------------------------------
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


// let line  = [0, 1, 2, 3, 4, 5]

// line.forEach(num => {
//   cells[num].classList.add('alien')
// })

// const goRight = setInterval(right, 500)

// function right () {
//   if (!line[5] === 9){
//     line = line.map(x => x + 1)
//     console.log(line)
//     line.some(num => {
//       cells[num].classList.add('alien')
//     })
//   }
//   if (line[5] === 9) {
//     clearInterval(goRight)
//   } 
// }

// setTimeout(() => {
//   const goLeft = setInterval(left, 1000)
//   function left () {
//     line = line.map(x => x - 1)
//     console.log(line)
//     line.some(num => {
//       cells[num].classList.add('alien')
//     })
//     if (line[0] === 0) {
//       clearInterval(goLeft)
//     }
//   }
// }, 2000)


// function bounce () {
//   const goRight = setInterval(right, 500)
//   const goLeft = setInterval(left, 1000)
// }