const BasicCard = require('./basiccard.js');
const ClozeCard = require('./clozecard.js');
const inquirer = require('inquirer');
const fs = require('fs');

//Initial menu of user input
function prompt() {
  inquirer.prompt([
    {
      name: "action",
      message: "Would you like to add a card or view current cards?",
      type: "list",
      choices: ["Add", "View", "Exit"]
    }
  ]).then((ans) => {
    if (ans.action === "Add") {
      inquirer.prompt([
        {
          name: "type",
          message: "What type of card would you like to create?",
          type: "list",
          choices: ["Cloze", "Basic"]
        }
        //Make a new card of the type that the user chose, using single line return from Arrow functions
      ]).then(ans => newCard(ans.type));
    } else if (ans.action === "View") {
      loadCards();
    } else {
      //Small pause after user chooses to quit, just for fun.
      console.log("Bye Bye");
      setTimeout(() => process.exit(), 250);
    }
  })
};

//Ask required further questions to continue building of the card the user is inputting
function newCard(cardType) {
  inquirer.prompt([
    {
      name: "text",
      message: (cardType === "Cloze" ? "What is your full text?" : "What is the back of the card? (The question)"),
      type: "input"
    },
    {
      name: "answer",
      message: (cardType === "Cloze" ? "What is your Cloze-Delete text?" : "What is the front of the card? (The Answer)"),
      type: "input"
    }
  ]).then(ans => {
    let currentCard;
    //Test if the user input is appropriate for a Cloze card
    if (cardType === "Cloze" && !ans.text.includes(ans.answer)) {
      console.log(`\nPlease be sure to check that the Cloze removal is exact in the full text\n`);
      return newCard("Cloze");
    }
    (cardType === "Cloze" ? currentCard = new ClozeCard(ans.text, ans.answer) : currentCard = new BasicCard(ans.text, ans.answer))
    //Save the output of the card created
    fs.appendFile('./flashcards.txt', `--${JSON.stringify(currentCard)}`, (err) => {
      if (err) throw err
      console.log(`Your card:
        ${JSON.stringify(currentCard)} has been saved`);
    });
    //The timeout fixes an issue with inquirer where console logs will stack on top of user input
    setTimeout(() => prompt(), 20);
  });
};

function loadCards() {
  fs.readFile('./flashcards.txt', 'utf8', (err,data) => {
    //Used -- as delimiter for the split to read from the returned data
    data = data.split('--');
    //Pass in initial index and current data to recursive question asking system
    displayCards(0, data);
  })
}

function displayCards(count, data) {
  var parseData = JSON.parse(data[count]);
  inquirer.prompt([
    {
      name: "userGuess",
      message: () => parseData.text,
      type: "input"
    }
  ]).then(ans => {
    //Use to Lowercase to deal with "false negatives"
    if (ans.userGuess.toLowerCase() === parseData.ans.toLowerCase()) {
      console.log("Correct!");
    } else {
      console.log(`Wrong, the answer was ${parseData.ans}`);
    }
  }).then(() => {
    if (count === data.length - 1) {
      setTimeout(() => prompt(), 20);
    } else {
      //Recursively call the function until count = data.length
      displayCards(count + 1, data);
    };
  });
}

prompt();
