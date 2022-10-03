const ramUrl = 'https://rickandmortyapi.com/api/'
const memoryModal = document.querySelector(".memoryModal")
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


// class Card {
//   constructor(shape, values) {
//     this.shape = shape;
//     this.values = values;
//   }
// }


let createCards = (arr) => {
    arr.forEach((imgCard) => {
      let htmlTemplate = `
        <div class ="card">
        <img class ="imageCard" src ="${imgCard.image}">
        </div>`
      memoryModal.insertAdjacentHTML("beforeend", htmlTemplate)
    })
  let cards = document.querySelectorAll(".card")
  console.log(cards)
    for (let i = 20; i > 0; i--) {
      let randomGeneratedIndex = Math.floor(Math.random() * 8);
      let randomGeneratedIndex2 = Math.floor(Math.random() * 8);
      let tempSavedItem = cards[randomGeneratedIndex];
      cards[randomGeneratedIndex] = cards[randomGeneratedIndex2];
      cards[randomGeneratedIndex2] = tempSavedItem;
    }
    // let cards = document.querySelectorAll(".card")
    cards.forEach((card, index) => card.addEventListener("click", function () {
      console.log("hi")
    }))
  }


async function fetchie() {
  let randomPage = Math.floor(Math.random() * 20)
  let response = await axios(ramUrl + `character?page=${randomPage}`)
  let imageArray = response.data.results
  let randomCut = Math.floor(Math.random() * 11)
  let eightCuts = imageArray.slice(randomCut, randomCut + 8);
  let cuts2 = eightCuts.concat(eightCuts)
  createCards(cuts2)
  console.log(cuts2)
}

fetchie()

// let memoryGame = () => [
//   apple += 1
// ]


// Generate an Array with each element x2
// randomize and print it as cards

