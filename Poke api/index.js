#!/usr/bin/env node
const term = require("terminal-kit").terminal;
const chalk = require("chalk");
const boxen = require("boxen");
// All Pokemon types
const allTypes = [
  "grass",
  "fire",
  "water",
  "bug",
  "poison",
  "normal",
  "electric",
  "ground",
  "fairy",
  "fighting",
  "psychic",
  "rock",
  "ice",
  "dragon",
  "ghost",
];
function random(nb) {
  return Math.floor(Math.random() * nb);
}
function question() {
  term("Do you want to play the game? [Y|n]\n");
  term.yesOrNo({ yes: ["y", "ENTER"], no: ["n"] }, function (error, result) {
    if (result) {
      const axios = require("axios");
      // Get all the pokemon names of the first gen from api https://pokeapi.co/
      axios
        .get("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151")
        .then(function (response) {
          const allPokemon = response.data;
          let allNames = [];
          Object.keys(allPokemon).forEach((value) => {
            if (value == "results") {
              const cool = allPokemon[value];
              cool.forEach(({ name }) => {
                allNames.push(name);
              });
            }
          });
          const randNb = random(allNames.length);
          let progressBar,
            progress = 0;
          // Progress Bar
          function doProgress() {
            // Add random progress
            progress += Math.random() / 10;
            progressBar.update(progress);
            //Program starts when progress bar is finished
            if (progress >= 1) {
              // Cleanup and exit
              setTimeout(function () {
                term("\n");
                console.log("\n");
                // Get the Primary Type of the Pokemon chosen from the api
                // allNames[randNB] is a random pokemon from api.
                axios
                  .get("https://pokeapi.co/api/v2/pokemon/" + allNames[randNb])
                  .then(function (response) {
                    let pokemonType = [];
                    const types = response.data;
                    Object.keys(types).forEach((value) => {
                      if (value == "types") {
                        const type = types[value];
                        type.forEach((element) => {
                          pokemonType.push(element.type.name);
                        });
                      }
                    });
                    if (pokemonType.length >= 2) {
                      pokemonType.shift();
                    }
                    // Color for answers
                    function colorAnswer(expr) {
                      switch (expr) {
                        case "grass":
                          expr = chalk.green(expr);
                        case "fire":
                          expr = chalk.red(expr);
                        case "water":
                          expr = chalk.cyan(expr);
                        case "bug":
                          expr = chalk.green(expr);
                        case "poison":
                          expr = chalk.magenta(expr);
                        case "electric":
                          expr = chalk.yellow(expr);
                        case "ground":
                          expr = chalk.gray(expr);
                        case "fairy":
                          expr = chalk.magenta(expr);
                        case "psychic":
                          expr = chalk.magenta(expr);
                        case "rock":
                          expr = chalk.gray(expr);
                        case "ice":
                          expr = chalk.cyan(expr);
                        case "dragon":
                          expr = chalk.cyan(expr);
                        case "ghost":
                          expr = chalk.red(expr);
                      }
                      return expr;
                    }
                    //Clean the pokemon type from allTypes array to avoid double in the MQC.
                    for (let i = 0; i < allTypes.length; i++) {
                      if (allTypes[i] == pokemonType[0]) {
                        allTypes.splice(i, 1);
                      }
                    }
                    //Generate three random types from array allTypes
                    let threeDiffType = [];
                    while (threeDiffType.length < 3) {
                      var r = Math.floor(Math.random() * allTypes.length);
                      if (threeDiffType.indexOf(r) === -1)
                        threeDiffType.push(r);
                    }
                    //Function to put types at random place in an array
                    function shuffle(array) {
                      var currentIndex = array.length,
                        temporaryValue,
                        randomIndex;

                      // While there remain elements to shuffle...
                      while (0 !== currentIndex) {
                        // Pick a remaining element...
                        randomIndex = Math.floor(Math.random() * currentIndex);
                        currentIndex -= 1;

                        // And swap it with the current element.
                        temporaryValue = array[currentIndex];
                        array[currentIndex] = array[randomIndex];
                        array[randomIndex] = temporaryValue;
                      }

                      return array;
                    }
                    term.cyan(
                      "The pokemon chosen is...  " +
                        allNames[randNb].toUpperCase() +
                        "! Good luck !\n"
                    );
                    //Generate the Multiple Questions Choice
                    var items = [
                      colorAnswer(allTypes[threeDiffType[0]]),
                      colorAnswer(allTypes[threeDiffType[1]]),
                      colorAnswer(allTypes[threeDiffType[2]]),
                      colorAnswer(pokemonType[0]),
                    ];
                    shuffle(items);
                    term.singleColumnMenu(items, function (error, response) {
                      const NEWLINE = "\n";
                      // Right answer
                      const answer = response.selectedText;
                      if (answer.includes(pokemonType[0])) {
                        console.log(
                          chalk.green(
                            boxen(["SUCCESS !"].join(NEWLINE), {
                              padding: 1,
                              margin: 1,
                              borderStyle: "round",
                            })
                          )
                        );
                      }
                      // Wrong answer
                      else {
                        console.log(
                          chalk.red(
                            boxen(["LOSER !"].join(NEWLINE), {
                              padding: 1,
                              margin: 1,
                              borderStyle: "round",
                            })
                          )
                        );
                        console.log(
                          chalk.red(
                            "The correct answer was " +
                              colorAnswer(pokemonType[0]) +
                              ".\n"
                          )
                        );
                      }
                      process.exit();
                    });
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              }, 200);
            } else {
              setTimeout(doProgress, 100 + Math.random() * 400);
            }
          }
          progressBar = term.progressBar({
            width: 80,
            title: "Generate a random Pokemon:",
            eta: true,
            percent: true,
          });
          //Start of the game
          term.wrapColumn({ width: 80 });
          term.wrap.red(
            "Ok, so the game is about finding the PRIMARY type of the Pokemon that I will chose for you, let's see if you're a good Pokemon trainer !"
          );
          console.log("\n");
          setTimeout(doProgress, 5000);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      process.exit();
    }
  });
}
question();
