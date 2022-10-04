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
      // cat.style.left = `${(cat.offsetLeft) - 50}px`;
      cat.style.left = `${0}px`;
    }
  }
})
document.addEventListener('keydown', e => {
  if (500 > cat.offsetLeft) {
    if (e.code === 'KeyD') {
      // cat.style.left = `${(cat.offsetLeft) + 50}px`;
      cat.style.left = `${450}px`;
    }
  }
})


let catLaser = document.createElement("div")
let createCatLaser = () => {
  catLaser.classList.add("catLaser")
  cat.appendChild(catLaser)
  catLaser.style.top = '0px'
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    createCatLaser()
  }
})
let moveCatLaser = () => {
  catLaser.style.top = `-${gameModal.offsetHeight}px`;
}
setInterval(moveCatLaser, 1000)

let bossLaser = document.createElement("div")
let createBossLaser = () => {
  bossLaser.classList.add("bossLaser")
  boss.appendChild(bossLaser)
  bossLaser.style.top = '0px'
}
setInterval(createBossLaser, 1000)

let moveBossLaser = () => {
  bossLaser.style.top = `${gameModal.offsetHeight}px`;
}
setInterval(moveBossLaser, 1000)

let moveBoss = () => {
  boss.style.left = `${Math.floor(Math.random() * 500)}px`;
}
setInterval(moveBoss, 2000)

class catShip {
  constructor() {
    this.cat = document.createElement('img')
    this.cat.src = "https://64.media.tumblr.com/692589ab5105831fd3e3897553979fc4/tumblr_npyi0xoh601tl2vzco1_500.gifv"
    document.body.appendChild(this.cat)
    this.cat.className = 'cat'
  }
}

let kitty = new catShip()


