const request = require("request");
const chalk = require("chalk");
const yargs = require('yargs');
//const readline = require("readline-sync");
//const { argv, title } = require('process');
//const { string } = require('yargs');
const { time } = require("console");
const { join } = require("path");
const { command } = require("yargs");

yargs.version('1.1.0')

getLocationWeather = (woeid) => {
    request(
        `https://www.metaweather.com/api/location/${woeid}/`,
        { json: true },
        (error, res, body) => {
            if (error === null) {
                let weathers = body.consolidated_weather;
                console.log(body.consolidated_weather[0]);
                if (weathers.length !== 0) {
                    console.log(chalk.greenBright("==================================="));
                    console.log(chalk.green("Location  : ") + chalk.yellow(body.title));
                    weathers.forEach((element) => {
                        console.log(
                            chalk.greenBright("===================================")
                        );
                        console.log(
                            chalk.green("Date          : ") + element.applicable_date
                        );
                        console.log(
                            chalk.green("Weather       : ") + element.weather_state_name
                        );
                        console.log(
                            chalk.green("Min temp      : ") +
                            Math.round(element.min_temp * 100) / 100
                        );
                        console.log(
                            chalk.green("Max temp      : ") +
                            Math.round(element.max_temp * 100) / 100
                        );
                        console.log(
                            chalk.green("Visibility    : ") +
                            Math.round(element.visibility * 100) / 100
                        );
                        console.log(
                            chalk.green("Air pressure  : ") + element.air_pressure + " Pa"
                        );
                        console.log(
                            chalk.green("Humidity      : ") + element.humidity + "%"
                        );
                    });
                }
            }
        }
    );
};
getLocationWeatherAtDate = (woeid, date) => {
    var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    if (!(date_regex.test(testDate))) {
        return false;
    }
    request(
        `https://www.metaweather.com/api/location/${woeid}/`,
        { json: true },
        (error, res, body) => {
            if (error === null) {
                let weathers = body.consolidated_weather;
                console.log(body.consolidated_weather[0]);
                if (weathers.length !== 0) {
                    console.log(chalk.greenBright("==================================="));
                    console.log(chalk.green("Location  : ") + chalk.yellow(body.title));
                    weathers.forEach((element) => {
                        console.log(
                            chalk.greenBright("===================================")
                        );
                        console.log(
                            chalk.green("Date          : ") + element.applicable_date
                        );
                        console.log(
                            chalk.green("Weather       : ") + element.weather_state_name
                        );
                        console.log(
                            chalk.green("Min temp      : ") +
                            Math.round(element.min_temp * 100) / 100
                        );
                        console.log(
                            chalk.green("Max temp      : ") +
                            Math.round(element.max_temp * 100) / 100
                        );
                        console.log(
                            chalk.green("Visibility    : ") +
                            Math.round(element.visibility * 100) / 100
                        );
                        console.log(
                            chalk.green("Air pressure  : ") + element.air_pressure + " Pa"
                        );
                        console.log(
                            chalk.green("Humidity      : ") + element.humidity + "%"
                        );
                    });
                }
            }
        }
    );
};

searchLocation = (key, date = "") => {
    request(
        `https://www.metaweather.com/api/location/search/?query=${key}`,
        { json: true },
        (error, res, body) => {
            if (body.length === 0) {
                console.log(chalk.red("NOT FOUND"));
            } else if (body.length === 1) {
                if (date === "") {
                    getLocationWeather(body[0].woeid);
                } else {
                    getLocationWeatherAtDate(body[0].woeid, date);
                }
            } else if (body.length > 1) {
                const limit = 5;
                if (body.length > 5) {
                    fistText = body
                        .splice(0, limit)
                        .map((item) => {
                            return item.title;
                        })
                        .join(", ");
                    secondText = ` and ${body.length()} more ... `;
                    console.log(fistText + secondText);
                }
            }
        }
    );
};

yargs.command({
    command: "weather",
    describe: "search location",
    builder: {
        location: {
            decsribe: "location",
            demandOption: true,
            type: "string",
        },
        date: {
            decsribe: "Date",
            demandOption: false,
            type: "string",
        },
    },
    handler: (argv) => {
        searchLocation(argv.location);
    },
});

console.log(yargs.argv);

var date = new Date("2000-11-20");
console.log(date);