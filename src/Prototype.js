const gameModal = document.querySelector(".gameModal")
// const cat = document.querySelector(".cat")
// const boss = document.querySelector(".boss")
const scoreBox = document.querySelector(".score")
const lifeBox = document.querySelector(".life")
const catImage = "./img/nyanCat.gif"
const boo = "https://66.media.tumblr.com/06ad37efe01d51ffc2f58363fe989653/tumblr_my74o3mTMV1rfjowdo1_500.gif"
const sheep = "https://64.media.tumblr.com/bc0b793c5949fbf57dc342422da1da28/tumblr_mmxhwa7Bmz1rfjowdo1_500.gif"
// let healthMeter = 100
// let hungryMeter = 100
// let happyMeter = 100
let apple = 5

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

//-----------------Keys-------------------------
const keys = {
  w: false,
  s: false,
  a: false,
  d: false,
  [' ']: false,
}
document.addEventListener('keydown', e => {
  keys[e.key] = true;
})
document.addEventListener('keyup', e => {
  keys[e.key] = false;
})
//----------------------Class----------------------------
class template {
  constructor({ tag = 'div', className = '' } = {}) {
    this.element = document.createElement(tag);
    gameModal.appendChild(this.element);
    this.element.className = 'template ' + className;
  }
  setX(x) {
    this.x = x;
    this.element.style.left = `${this.x}px`;
  }
  setY(y) {
    this.y = y;
    this.element.style.top = `${this.y}px`;
  }
}
// CatShip
class CatShip extends template {
  constructor({ lifeTracker, hitDetection, removeLaser }) {
    super({ tag: 'img', className: 'cat' });
    this.element.src = catImage;
    this.setX(window.innerWidth / 2);
    this.setY(window.innerHeight - 100);
    this.fireRate = true
    this.lifeTracker = lifeTracker
    this.hitDetection = hitDetection
    this.removeLaser = removeLaser
  }
  moveLeft() {
    this.setX(this.x - 5)
  }
  moveRight() {
    this.setX(this.x + 5)
  }
  moveUp() {
    this.setY(this.y - 5)
  }
  moveDown() {
    this.setY(this.y + 5)
  }
  shoot({ fireLaser }) {
    if (this.fireRate) {
      this.fireRate = false
      fireLaser({
        x: kitty.x + 15,
        y: kitty.y,
      })
      setTimeout(() => {
        this.fireRate = true
      }, 500)
    }
  }
  update() {
    const laser = this.hitDetection(this);
    if (laser && laser.isMon) {
      this.lifeTracker()
      this.removeLaser(laser)
    }
  }
}
//------------------------Cat Laser--------------------------
class CatLaser extends template {
  constructor({ x, y, isMon }) {
    super({ tag: 'img', className: 'laser' })
    this.element.src = sheep;
    this.setX(x);
    this.setY(y);
    this.isMon = isMon;
  }
  update() {
    const direction = this.isMon ? 5 : - 5;
    this.setY(this.y + direction);
  }
  remove() {
    this.element.remove();
    this.element = null;
  }
}
// -------------------------Boo---------------------------
class Monster extends template {
  constructor({
    x,
    y,
    hitDetection,
    removeMon,
    removeLaser,
    addtoScore,
  }) {
    super({ tag: 'img', className: 'monster' });
    this.element.src = boo;
    this.direction = 'left';

    this.hitDetection = hitDetection;
    this.removeMon = removeMon
    this.removeLaser = removeLaser
    this.addtoScore = addtoScore


    this.setX(x);
    this.setY(y);
  }
  setDirectionLeft() {
    this.direction = 'left'
  }
  setDirectionRight() {
    this.direction = 'right'
  }
  moveDown() {
    this.setY(this.y + 5)
  }
  update() {
    if (this.direction === 'left') {
      this.setX(this.x - 5)
    } else {
      this.setX(this.x + 5)
    }
    const laser = this.hitDetection(this);
    if (laser && !laser.isMon) {
      this.removeMon(this.element)
      this.removeLaser(laser)
      this.addtoScore(1)
    }
  }
  remove() {
    this.element.remove();
    this.element = null;
  }
}
//-----------------------Game Functions--------------------------------//
let score = 0
let life = 3
const booRow = 3
const booCol = 6
let interval = ""


const lasers = []
const spaceMons = []
const spaceMonsGrid = []

const addtoScore = (amount) => {
  if (score < 17) {
    score += amount;
    scoreBox.textContent = `Kills: ${score}`;
  } else {
    score = 18
    apple += 1
    scoreBox.textContent = `Kills: ${score}`;
    console.log("WIN!")
    clearInterval(interval)
  }
}

const lifeTracker = () => {
  if (life != 0) {
    life--;
    lifeBox.textContent = `life: ${life}`;

  } else {
    console.log("Game Over")
    clearInterval(interval)
  }

}

const fireLaser = ({ x, y, isMon = false }) => {
  lasers.push(
    new CatLaser({
      x,
      y,
      isMon
    }))
}
const removeMon = (spaceMon) => {
  spaceMon.isMon = false;
  spaceMons.slice(spaceMons.indexOf(spaceMon), 1);
  spaceMon.remove();

}

const removeLaser = (laser) => {
  lasers.splice(lasers.indexOf(laser), 1);
  laser.remove();
}

const isHit = (object1, object2) => {
  const rect1 = object1.element.getBoundingClientRect();
  const rect2 = object2.element.getBoundingClientRect();
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom)
}

const hitDetection = (object) => {
  for (let laser of lasers) {
    if (isHit(object, laser)) {
      return laser
    }
  }
  return null;
}

const kitty = new CatShip({
  removeLaser,
  hitDetection,
  lifeTracker
})

for (let r = 0; r < booRow; r++) {
  const spaceMonsC = []
  for (let c = 0; c < booCol; c++) {
    const spaceMon = new Monster({
      x: c * 100 + 400,
      y: r * 50,
      hitDetection,
      removeMon,
      removeLaser,
      addtoScore,
    });
    spaceMons.push(spaceMon);
    spaceMonsC.push(spaceMon);
  }
  spaceMonsGrid.push(spaceMonsC)
}

const getBotMon = () => {
  const botMons = [];
  for (let c = 0; c < booCol; c++) {
    for (let r = booRow - 1; r >= 0; r--) {
      if (spaceMonsGrid[r][c]) {
        botMons.push(spaceMonsGrid[r][c]);
        break;
      }
    }
  }
  return botMons
}

const getRandomMon = (arr) => {
  return arr[parseInt(Math.random() * arr.length)]
}

const booLaser = () => {
  botMon = getBotMon()
  ranMon = getRandomMon(botMon)
  fireLaser({
    x: ranMon.x,
    y: ranMon.y,
    isMon: true,
  })
}

setInterval(booLaser, 1000)

const getLeftMon = () => {
  return spaceMons.reduce((minSpaceMon, currentspaceMon) => {
    return currentspaceMon.x < minSpaceMon.x
      ? currentspaceMon : minSpaceMon;
  })
}
const getRightMon = () => {
  return spaceMons.reduce((maxSpaceMon, currentspaceMon) => {
    return currentspaceMon.x > maxSpaceMon.x
      ? currentspaceMon : maxSpaceMon;
  })
}

//-----------------------------Game Update Logic----------------
const update = () => {
  if (keys[`w`] && kitty.y > 0) {
    kitty.moveUp()
  }
  if (keys[`s`] && kitty.y < window.innerHeight - 100) {
    kitty.moveDown()
  }
  if (keys[`a`] && kitty.x > 0) {
    kitty.moveLeft()
  }
  if (keys[`d`] && kitty.x < window.innerWidth - 50) {
    kitty.moveRight()
  }
  if (keys[` `]) {
    kitty.shoot({
      fireLaser
    })
  }
  kitty.update()

  lasers.forEach(laser => {
    laser.update();
    if (laser.y < 0) {
      laser.remove()
      lasers.splice(lasers.indexOf(laser), 1);
    }
  });
  spaceMons.forEach(spaceMon => {
    spaceMon.update()
  })
  const leftMon = getLeftMon();
  if (leftMon.x < 0) {
    spaceMons.forEach(spaceMon => {
      spaceMon.setDirectionRight();
      spaceMon.moveDown();
    })
  }
  const rightMon = getRightMon();
  if (rightMon.x > window.innerWidth - 50) {
    spaceMons.forEach(spaceMon => {
      spaceMon.setDirectionLeft();
      spaceMon.moveDown();
    })
  }
};
interval = setInterval(update, 20)




