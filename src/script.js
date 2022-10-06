const catImage = "./img/nyanCat.gif"
const boo = "./img/boo.gif"
const sheep = "./img/rainSheep.gif"
const gameModal = document.querySelector(".gameModal")
const scoreBox = document.querySelector(".score")
const lifeBox = document.querySelector(".life")
let apple = 5
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
  // kill() {
  //   this.isAlive = false;
  //   setTimeout(() => { this.spawn(); }, 3000);
  //   this.el.style.opacity = 0;
  // }
  update() {
    const laser = this.hitDetection(this);
    if (laser && laser.isBoo && this.isAlive) {
      this.removeLaser(laser)
      this.lifeTracker()
      // this.kill()
    }
    const boo = this.kamikaze(this);
    if (boo) {
      this.removeBoo(boo)
      this.lifeTracker()
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
  }
  setDirectionLeft() {
    this.direction = 'left'
  }
  setDirectionRight() {
    this.direction = 'right'
  }

  moveVer() {
    if (kitty.y > this.y) {
      this.setY(this.y + 2)
    } else {
      this.setY(this.y - 2)
    }
  }
  moveDia() {
    if (kitty.x > this.x) {
      this.setX(this.x + 2)
    } else {
      this.setX(this.x - 2)
    }
  }
  update() {
    // if (this.direction === 'left') {
    //   this.setX(this.x - 2)
    // } else {
    //   this.setX(this.x + 2)
    // }
    // this.moveVer()
    // this.moveDia()
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
    const direction = this.isBoo ? 5 : - 5;
    this.setY(this.y + direction);
  }
}

//-----------------------Game Functions--------------------------------//
let score = 0
let life = 3
const lasers = []
const boos = []

const addtoScore = (amount) => {
  if (score < 17) {
    score += amount;
    scoreBox.textContent = `Kills: ${score}`;
  } else {
    score = 18
    apple += 1
    scoreBox.textContent = `Kills: ${score}`;
    console.log("WIN!")
    // clearInterval(interval)
  }
}

const lifeTracker = () => {
  if (life != 0) {
    life--;
    lifeBox.textContent = `life: ${life}`;

  } else {
    console.log("Game Over")
    // clearInterval(interval)
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

for (let i = 0; i < 2; i++) {
  const boo = new Boo({
    x: Math.random() * window.innerWidth,
    y: Math.random() * (window.innerHeight - 200),
    hitDetection,
    removeBoo,
    removeLaser,
    addtoScore,
  });
  boos.push(boo);
  console.log(boos)
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
  console.log("pew")
};

var booPew = setInterval(booLaser, 1000);

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

  boos.forEach((boo) => {
    boo.moveDia()
    boo.moveVer()
    boo.update();
    if (boo.x < 0) {
      boo.setDirectionRight()
    }
    if (boo.x > window.innerWidth - 50) {
      boo.setDirectionLeft();
    }

  });

}
setInterval(update, 20)