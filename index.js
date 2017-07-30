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
      viewCards();
    } else {
      console.log("Bye Bye");
      setTimeout(() => process.exit(), 250);
    }
  })
};

function newCard(cardType) {
  let currentCard;
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
    (cardType === "Cloze" ? currentCard = new ClozeCard(ans.text, ans.answer) : currentCard = new BasicCard(ans.text, ans.answer))
    console.log(currentCard);
  });
};
