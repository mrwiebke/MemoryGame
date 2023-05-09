const gameContainer = document.getElementById("game-container");
const flipCount = document.querySelector('#flip-count')
const stopwatch = document.querySelector('#stopwatch')
const result = document.querySelector('#result')
const cardContainer = document.querySelector('#cardContainer')
let isFirstCard = false //when creating a variable with a boolean it is good practice to name it startin with 'is'
let isSecondCard = false
let countDisplay = 0
let winCount = 0
let noClicking = false

// Card faces
const dogCards = [
  { name: "dogOne", image: "dogOne.png" },
  { name: "dogTwo", image: "dogTwo.png" },
  { name: "dogThree", image: "dogThree.png" },
  { name: "dogFour", image: "dogFour.png" },
  { name: "dogFive", image: "dogFive.png" },
  { name: "dogSix", image: "dogSix.png" },
  { name: "dogSeven", image: "dogSeven.png" },
  { name: "dogEight", image: "dogEight.png" }
];

//to start the initial timer
const timeDisplay = document.querySelector('#time-display')
let startTime = 0
let elapsedTime = 0
let currentTime = 0
let intervalId;

gameContainer.addEventListener('click', () => {
  startTime = Date.now() - elapsedTime;
  intervalId = setInterval(updateTime, 1000 ) 
})

function updateTime() {
   elapsedTime = Date.now() - startTime
  let secs = pad(Math.floor((elapsedTime / 1000) % 60))
  let  mins = pad(Math.floor((elapsedTime / (1000 * 60)) % 60))
  let hrs = pad(Math.floor((elapsedTime / (1000 * 60 * 60)) % 60))

  stopwatch.textContent = `Time ${hrs}:${mins}:${secs}`

  function pad(unit) {
    return (("0") + unit).length > 2 ? unit : "0" + unit;
  }
}

// to start move counter
function flipCounter (){
  countDisplay++
  flipCount.textContent = `Cards Flipped: ${countDisplay}`
}

// this is to double the dog cards array 
const cardValues = dogCards.concat(dogCards)


// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(cardValues) {
  let counter = cardValues.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = cardValues[counter];
    cardValues[counter] = cardValues[index];
    cardValues[index] = temp;
  }
  return cardValues;
}

let shuffledCards = shuffle(cardValues);

// this function loops over the array of dog cards (not in cardValues)
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForCards(cardValues) {
  for (let i = 0; i < cardValues.length; i++) {

     //create a div that holds both the question mark card and the dog card div's
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("cardContainer")
    cardContainer.setAttribute("dataCardValue", `${cardValues[i].name}`)

     //create a secondDiv to hold the question mark card this one will be initially visible until you click
    const questionMarkDiv = document.createElement("div");
    questionMarkDiv.id="questionMarkCard"

    // to add image to question mark card
    const firstCardImage = document.createElement("img")
    firstCardImage.src = "questionMark.png"
    firstCardImage.id = "question"
    questionMarkDiv.append(firstCardImage)

    // create a div to hold the dog card
    const dogCardDiv = document.createElement("div");
    dogCardDiv.id = "dog"

    // give it a class attribute for the value we are looping over
    dogCardDiv.classList.add(cardValues[i].name);

    //add image to newDiv
    const newImage = document.createElement("img")
    newImage.src = `${(cardValues[i].name)}.png`
    newImage.id = "dogImage"
    dogCardDiv.append(newImage)

    // append the div to the element with an id of game
    gameContainer.append(cardContainer);
    cardContainer.append(dogCardDiv);
    cardContainer.append(questionMarkDiv);

  }
}

createDivsForCards(shuffledCards);

// Cards
const cards = document.querySelectorAll(".cardContainer")
cards.forEach((currentCard) => {
  currentCard.addEventListener("click", ()=> {
    if (noClicking) return;
    if(currentCard.classList.contains("noClick")) return;
    //if the card you clicked is not yet matched then flip the clicked card
    if (!currentCard.classList.contains('matched')) {
      currentCard.classList.add("flipped")
    };
    // if it is the first card (using !firstCard becuase the initial vale of firstCard is false. line 9) then the firstCard becomes the current selected card and the current card takes on the firstCardValue and add one to the flip counter for each time you select a card 
    if (!isFirstCard){
      isFirstCard = currentCard
      firstCardValue = currentCard.getAttribute(("dataCardValue"))
      currentCard.classList.add("noClick")
    }else if(currentCard.classList.contains("noClick")){
      console.log(`you cannot click ${currentCard}`)
      return;
    }else{ 
      flipCounter();
      isSecondCard = currentCard;
      let secondCardValue = currentCard.getAttribute(("dataCardValue"))
      currentCard.classList.add("noClick")
      // if both cards match add the class 'matched' so that they will be ignored in the next round
        if (firstCardValue == secondCardValue){
          isFirstCard.classList.add("matched");
          isSecondCard.classList.add("matched");
          isFirstCard = false
          winCount++
          if (winCount == Math.floor(cardValues.length / 2)) {
            result.innerHTML = `<h2>You Won</h2>
          <h4>Moves: ${countDisplay}</h4>`;
               gameContainer.classList.add("hide")
               flipCount.classList.add("hide")
               stopwatch.classList.add("hide")
          }
        } else {
          let [tempFirst, tempSecond] = [isFirstCard, isSecondCard];
            isFirstCard = false;
            isSecondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped", "noClick");
              tempSecond.classList.remove("flipped", "noClick");
            }, 1000);
        }
    };
  })
})
