// const gameModal = document.querySelector(".gameModal")
// const cat = document.querySelector(".cat")
// const boss = document.querySelector(".boss")
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

class template  {
  constructor({tag = 'div', className = ''} = {}) {
    this.element = document.createElement(tag);
    document.body.appendChild(this.element);
    this.element.className = `template` + className;
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

class catShip extends template {
  constructor() {
    this.element = document.createElement('img');
    this.element.src = "https://64.media.tumblr.com/692589ab5105831fd3e3897553979fc4/tumblr_npyi0xoh601tl2vzco1_500.gifv";
    document.body.appendChild(this.element);
    this.element.className = 'cat';
    this.setX(window.innerWidth / 2);
    this.setY(window.innerHeight - 100);
    this.fireRate = true
  }
  setX(x) {
    this.x = x;
    this.element.style.left = `${this.x}px`;
  }
  setY(y) {
    this.y = y;
    this.element.style.top = `${this.y}px`;
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
        x: kitty.x + 25,
        y: kitty.y,
      })
      setTimeout(() => {
        this.fireRate = true
      }, 500)
    }
  }
}

class catLaser {
  constructor({ x, y }) {
    this.element = document.createElement('div');
    document.body.appendChild(this.element);
    this.element.className = 'catLaser';
    this.setX(x);
    this.setY(y);
  }
  setX(x) {
    this.x = x;
    this.element.style.left = `${this.x}px`;
  }
  setY(y) {
    this.y = y;
    this.element.style.top = `${this.y}px`;
  }
  updateUp() {
    this.setY(this.y - 5);
  }
  remove() {
    this.element.remove();
    this.element = null;
  }
}
const kitty = new catShip()
const lasers = []
const fireLaser = ({ x, y }) => {
  lasers.push(
    new catLaser({
      x,
      y,
    }))
}
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
};
setInterval(update, 20)
