// const gameModal = document.querySelector(".gameModal")
// const cat = document.querySelector(".cat")
// const boss = document.querySelector(".boss")
const catImage = "https://www.icegif.com/wp-content/uploads/nyan-cat-icegif-13.gif"
const boo = "https://66.media.tumblr.com/06ad37efe01d51ffc2f58363fe989653/tumblr_my74o3mTMV1rfjowdo1_500.gif"
const sheep = "https://64.media.tumblr.com/bc0b793c5949fbf57dc342422da1da28/tumblr_mmxhwa7Bmz1rfjowdo1_500.gif"
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
//----------------------Class----------------------------
class template {
  constructor({ tag = 'div', className = '' } = {}) {
    this.element = document.createElement(tag);
    document.body.appendChild(this.element);
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
class CatShip extends template {
  constructor() {
    super({ tag: 'img', className: 'cat' });
    this.element.src = catImage;
    this.setX(window.innerWidth / 2);
    this.setY(window.innerHeight - 100);
    this.fireRate = true
  }
  moveLeft() {
    this.setX(this.x - 5)
  }
  moveRight() {
    this.setX(this.x + 5)
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
}
class CatLaser extends template {
  constructor({ x, y }) {
    super({ tag: 'img', className: 'catLaser' })
    this.element.src = sheep;
    this.setX(x);
    this.setY(y);
  }
  updateUp() {
    this.setY(this.y - 5);
  }
  remove() {
    this.element.remove();
    this.element = null;
  }
}
class Monster extends template {
  constructor({ x, y }) {
    super({ tag: 'img', className: 'monster' })
    this.element.src = boo;
    this.setX(x);
    this.setY(y);
    this.direction = 'left'
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
  }
}
//-----------------------Monsters--------------------------------//
//Create Monster
const spaceMons = []
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 6; c++) {
    const spaceMon = new Monster({
      x: c * 100 + 350,
      y: r * 50 + 50.
    });
    spaceMons.push(spaceMon);
  }
}
//-----------------Monster Movement--------------------
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
//------------------Cat----------------------------
const kitty = new CatShip()
const lasers = []
const fireLaser = ({ x, y }) => {
  lasers.push(
    new CatLaser({
      x,
      y,
    }))
}
//-----------------Keys-------------------------
const keys = {
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

//-----------------------------Game Update Logic----------------
const update = () => {
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
  lasers.forEach(laser => {
    laser.updateUp();
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
  if (rightMon.x > window.innerWidth - 80) {
    spaceMons.forEach(spaceMon => {
      spaceMon.setDirectionLeft();
      spaceMon.moveDown();
    })
  }
};
setInterval(update, 20)
