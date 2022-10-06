const catImage = "./img/nyanCat.gif"
const boo = "./img/boo.gif"
const sheep = "./img/rainSheep.gif"
const gameModal = document.querySelector(".gameModal")
const scoreBox = document.querySelector(".score")
const lifeBox = document.querySelector(".life")
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
//---------------------------Classes--------------------------
class Template {
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
  remove() {
    this.element.remove();
    this.element = null;
  }
}
//-------------------------Ship-------------------------------
class Ship extends Template {
  constructor({
    lifeTracker,
    hitDetection,
    removeLaser,
    kamikaze,
    removeBoo,
  }) {
    super({ tag: 'img', className: 'cat' });
    this.element.src = catImage;
    this.fireRate = true;
    this.isAlive = true;
    this.lifeTracker = lifeTracker;
    this.hitDetection = hitDetection;
    this.removeLaser = removeLaser;
    this.spawn();
    this.kamikaze = kamikaze
    this.removeBoo = removeBoo
  }
  spawn() {
    this.isAlive = true;
    this.element.style.opacity = 1;
    this.setX(window.innerWidth / 2);
    this.setY(window.innerHeight - 80);
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
    if (this.fireRate && this.isAlive) {
      this.fireRate = false
      fireLaser({
        x: kitty.x + 15,
        y: kitty.y,
      })
      setTimeout(() => {
        this.fireRate = true
      }, 1000)
    }
  }
  kill() {
    this.isAlive = false;
    this.element.style.opacity = 0;
    if (life > 0) {
      setTimeout(() => { this.spawn(); }, 1000);
    }
  }
  update() {
    const laser = this.hitDetection(this);
    if (laser && laser.isBoo && this.isAlive) {
      this.removeLaser(laser)
      this.lifeTracker()
      this.kill()
    }
    const boo = this.kamikaze(this);
    if (boo && this.isAlive) {
      this.removeBoo(boo)
      this.lifeTracker()
      this.kill()
      if (boos.length <= 0) {
        clearInterval(booPew)
      }
    }
  }
}
// -------------------------Boo---------------------------
class Boo extends Template {
  constructor({
    x,
    y,
    hitDetection,
    removeBoo,
    removeLaser,
    addtoScore,
    isHoming
  }) {
    super({ tag: 'img', className: 'boo' });
    this.element.src = boo;
    this.direction = 'left';
    this.hitDetection = hitDetection;
    this.removeBoo = removeBoo
    this.removeLaser = removeLaser
    this.addtoScore = addtoScore
    this.setX(x);
    this.setY(y);
    this.isHoming = isHoming;
  }
  setDirectionLeft() {
    this.direction = 'left'
  }
  setDirectionRight() {
    this.direction = 'right'
  }
  moveVer() {
    if (kitty.y > this.y) {
      this.setY(this.y + 1)
    } else {
      this.setY(this.y - 1)
    }
  }
  moveDia() {
    if (kitty.x > this.x) {
      this.setX(this.x + 1)
    } else {
      this.setX(this.x - 1)
    }
  }
  moveDown() {
    this.setY(this.y + 25)
  }

  update() {
    if (!this.isHoming) {
      if (this.direction === 'left') {
        this.setX(this.x - 3)
      } else {
        this.setX(this.x + 3)
      }
    } else {
      this.moveDia()
      this.moveVer()
    }
    const laser = this.hitDetection(this);
    if (laser && !laser.isBoo) {
      this.removeBoo(this)
      this.removeLaser(laser)
      this.addtoScore(1)
      if (boos.length <= 0) {
        clearInterval(booPew)
      }
    }

  }
}
//------------------------Laser--------------------------
class Laser extends Template {
  constructor({ x, y, isBoo }) {
    super({ tag: 'img', className: 'laser' })
    this.element.src = sheep;
    this.setX(x);
    this.setY(y);
    this.isBoo = isBoo;
  }

  update() {
    const directionY = this.isBoo ? 5 : - 5;
    this.setY(this.y + directionY);
  }
}

//-----------------------Game Functions--------------------------------//
let score = 0
let life = 3
const lasers = []
const boos = []

const addtoScore = (amount) => {
  if (boos.length > 0) {
    score += amount;
    scoreBox.textContent = `Kills: ${score}`;
    console.log(boos.length)
  } else {
    score += amount;
    scoreBox.textContent = `Kills: ${score}`;
    console.log("Win!")
  }
}


const lifeTracker = () => {
  if (life != 0) {
    life--;
    lifeBox.textContent = `Life: ${life}`;
  } else {
    console.log("Game Over")
  }
}

const fireLaser = ({ x, y, isBoo = false }) => {
  lasers.push(
    new Laser({
      x,
      y,
      isBoo
    }))
}
const removeBoo = (boo) => {
  boos.splice(boos.indexOf(boo), 1);
  boo.remove();
}

const removeLaser = (laser) => {
  lasers.splice(lasers.indexOf(laser), 1);
  laser.remove();
}

const collision = (object1, object2) => {
  const rect1 = object1.element.getBoundingClientRect();
  const rect2 = object2.element.getBoundingClientRect();
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom)
}

const kamikaze = (object) => {
  for (let boo of boos) {
    if (collision(object, boo)) {
      return boo
    }
  }
  return null;
}
const hitDetection = (object) => {
  for (let laser of lasers) {
    if (collision(object, laser)) {
      return laser
    }
  }
  return null;
}

const kitty = new Ship({
  lifeTracker,
  removeLaser,
  hitDetection,
  kamikaze,
  removeBoo
})

for (let i = 0; i < 10; i++) {
  const boo = new Boo({
    x: Math.random() * window.innerWidth,
    y: Math.random() * (window.innerHeight - 200),
    hitDetection,
    removeBoo,
    removeLaser,
    addtoScore,
    isHoming: true,
  });
  boos.push(boo);
}

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 3; j++) {
    const boo = new Boo({
      x: i * 100 + 50,
      y: j * 50,
      hitDetection,
      removeBoo,
      removeLaser,
      addtoScore,
      isHoming: false,
    });
    boos.push(boo);
  }
}

const getRandomBoo = (arr) => {
  return arr[parseInt(Math.random() * arr.length)]
}

const booLaser = () => {
  const randomBoo = getRandomBoo(boos);
  fireLaser({
    x: randomBoo.x,
    y: randomBoo.y,
    isBoo: true,
  });
};

let booPew = setInterval(booLaser, 1000);

//-----------------------------Game Update Logic----------------
const update = () => {
  if (keys[`w`] && kitty.y > 0 && kitty.isAlive) {
    kitty.moveUp()
  }
  if (keys[`s`] && kitty.isAlive && kitty.y < window.innerHeight - 100) {
    kitty.moveDown()
  }
  if (keys[`a`] && kitty.isAlive && kitty.x > 0) {
    kitty.moveLeft()
  }
  if (keys[`d`] && kitty.isAlive && kitty.x < window.innerWidth - 50) {
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

  boos.forEach((boo) => {
    boo.update();
    if (boo.x < 0) {
      boo.setDirectionRight()
      boo.moveDown()
    }
    if (boo.x > window.innerWidth - 50) {
      boo.setDirectionLeft();
      boo.moveDown()
    }

  });

}
setInterval(update, 20)