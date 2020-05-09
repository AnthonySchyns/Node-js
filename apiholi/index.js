#!/usr/bin/env node
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
readline.question(`Which country ? `, (country) => {
  const ora = require("ora");

  const spinner = ora("Searching for data...").start();
  function data() {
    spinner.stop();
    const { getCode, getNames } = require("country-list");
    const allCountries = getNames();
    if (allCountries.includes(country)) {
      const code = getCode(country);
      const year = new Date().getFullYear();
      const chalk = require("chalk");
      const axios = require("axios");
      axios
        .get("https://date.nager.at/api/v2/publicholidays/" + year + "/" + code)
        .then(function (response) {
          // handle success
          const holidays = response.data;
          holidays.forEach(({ name, date }) => {
            console.log(chalk.yellow(name));
            console.log(chalk.blue(date));
            console.log("");
          });
        })
        .catch(function (error) {
          // handle error
          console.log("Sorry we don't have data for this country");
        });
    } else {
      console.log("Sorry this country doesn't exist");
    }
  }
  setTimeout(data, 5000);
  readline.close();
});
