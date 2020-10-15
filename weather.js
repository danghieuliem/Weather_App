const request = require("request");
const chalk = require("chalk");
const yargs = require('yargs');
const moment = require('moment');
//const readline = require("readline-sync");
//const { argv, title } = require('process');
//const { string } = require('yargs');
const { time } = require("console");
const { join } = require("path");
const { command } = require("yargs");
const { isUndefined } = require("util");

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
            console.log(chalk.greenBright("DONE !"));
        }
    );
};
getLocationWeatherAtDate = (woeid, date, location) => {
    request(
        `https://www.metaweather.com/api/location/${woeid}/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/`,
        { json: true },
        (error, res, body) => {
            if (error === null) {
                if (body.length !== 0) {
                    let element = body[body.length - 1];
                    console.log(chalk.greenBright("==================================="));
                    console.log(chalk.green("Location  : ") + chalk.yellow(location));
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
                }
            }
            console.log(chalk.greenBright("DONE !"));
        }
    );
};
searchLocation = (key, date) => {
    console.log(chalk.yellow("search Location ...."));
    request(
        `https://www.metaweather.com/api/location/search/?query=${key}`,
        { json: true },
        (error, res, body) => {
            if (body.length === 0) {
                console.log(chalk.red("NOT FOUND"));
            } else if (body.length === 1) {
                console.log(chalk.greenBright("Was found location !"));
                console.log(chalk.yellow("Geting location weather ....."));
                if (date === null) {
                    getLocationWeather(body[0].woeid);
                } else {
                    getLocationWeatherAtDate(body[0].woeid, date,body[0].title);
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
                    secondText = ` and ${body.length} more ... \nPlease enter location correctly!`;
                    console.log("Was found : "+ chalk.redBright(fistText + secondText));
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
            describe: "location",
            demandOption: true,
            type: "string",
        },
        date: {
            describe: "Date",
            demandOption: false,
            type: "string",
        },
    },
    handler: (argv) => {
        let strdate = argv.date;
        if (isUndefined(strdate)) {
            searchLocation(argv.location, null);
        }
        else if (moment(strdate, "DD/MM/YYYY", true).isValid() === true) {
            let date = new Date(`${strdate.slice(6, 10)}/${strdate.slice(3, 5)}/${strdate.slice(0, 3)}`);
            searchLocation(argv.location, date);
        } else {
            console.log(chalk.red("Date is not invalid. Date format is DD/MM/YYYY"));
        }
    },
});
yargs.argv;