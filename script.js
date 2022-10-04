const gameModal = document.querySelector(".gameModal")
const cat = document.querySelector(".cat")
const boss = document.querySelector(".boss")
// let healthMeter = 100
// let hungryMeter = 100
// let happyMeter = 100
// let apple = 5

// let sleep = () => {
//   healthMeter += 25
// }

// let play = () => {
//   happyMeter += 25
// }

// let eat = () => {
//   if (apple > 0) {
//     healthMeter += 25
//     apple -= 1
//   } else {
//     console.log("No Food left")
//   }
// }

// let canSleep = () => {
//   if (hungryMeter > 50 && happyMeter > 50) {
//     sleep()
//   } else {
//     console.log("Cant sleep, Need more Food and not happy!")
//   }
// }

// let gainApple = () => {
//   if (apple < 5) {
//     memoryGame()
//   } else {
//     console.log("Apple Basket is full")
//   }
// }

document.addEventListener('keydown', e => {
  if (0 < cat.offsetLeft) {
    if (e.code === 'KeyA') {
      cat.style.left = `${(cat.offsetLeft) - 50}px`;
      console.log(cat.offsetLeft)
    }
  }
})
document.addEventListener('keydown', e => {
  if (500 > cat.offsetLeft) {
    if (e.code === 'KeyD') {
      cat.style.left = `${(cat.offsetLeft) + 50}px`;
    }
  }
})

let laser = document.createElement("div")
let createLaser = () => {
  laser.classList.add("laser")
  cat.appendChild(laser)
  laser.style.top = '0px'
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    createLaser()
  }
})
let movelaser = () => {
  laser.style.top = `-${gameModal.offsetHeight}px`;
}
setInterval(movelaser, 1000)

let moveBoss = () => {
  boss.style.left = `${Math.floor(Math.random() * 500)}px`;
}
setInterval(moveBoss, 2000)
