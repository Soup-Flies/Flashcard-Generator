const BasicCard = require('./basiccard.js');
const ClozeCard = require('./clozecard.js');
const inquirer = require('inquirer');
const fs = require('fs');

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
      ]).then(ans => newCard(ans.type));
    } else if (ans.action === "View") {
      loadCards();
    } else {
      console.log("Bye Bye");
      setTimeout(() => process.exit(), 250);
    }
  })
};

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
    if (cardType === "Cloze" && !ans.text.includes(ans.answer)) {
      console.log(`\nPlease be sure to check that the Cloze removal is exact in the full text\n`);
      return newCard("Cloze");
    }
    (cardType === "Cloze" ? currentCard = new ClozeCard(ans.text, ans.answer) : currentCard = new BasicCard(ans.text, ans.answer))
    fs.appendFile('./flashcards.txt', `--${JSON.stringify(currentCard)}`, (err) => {
      if (err) throw err
      console.log(`Your card:
        ${JSON.stringify(currentCard)} has been saved`);
    });
    setTimeout(() => prompt(), 20);
  });
};

function loadCards() {
  fs.readFile('./flashcards.txt', 'utf8', (err,data) => {
    data = data.split('--');
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
    if (ans.userGuess.toLowerCase() === parseData.ans.toLowerCase()) {
      console.log("Correct!");
    } else {
      console.log(`Wrong, the answer was ${parseData.ans}`);
    }
  }).then(() => {
    if (count === data.length - 1) {
      console.log();
      setTimeout(() => prompt(), 20);
    } else {
      displayCards(count + 1, data);
    };
  });
}

prompt();
