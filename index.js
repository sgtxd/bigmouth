//copy and paste from kakao
const discord = require("discord.js");
const colors = require("colors");
const path = require("path");
const fs = require("fs");
const sql = require("better-sqlite3");
const bot = new discord.Client();

colors.setTheme({
    warn: `yellow`,
    error: `bgRed`,
    verbose: `cyan`
});

console.log(`sgtxd (C) 2021`.green);

if (fs.existsSync("./quotes.db")) {   //Check if the database file exists, if it dosent create a new file and create all tables.
    var db = new sql("./quotes.db");
    var i = db.prepare(`SELECT Count(*) FROM quotes;`).get()
    var quoteAmount = i['Count(*)'];
    console.log(quoteAmount)
} else {
    console.log("Couldn't find database, creating new one!".warn);
    var db = new sql("./quotes.db");
    db.prepare(`CREATE TABLE "quotes" ("id"	INTEGER UNIQUE,"trigger"	TEXT,"chance"	INTEGER,"quote"	TEXT,PRIMARY KEY("id"))`).run();
}

const evfile = fs.readdirSync(`./events/`).filter(file => file.endsWith(`js`));
for (const file of evfile) {
    let eventFunction = require(`./events/${file}`);
    if (!eventFunction) return;
    let eventName = file.split(".")[0];
    bot.on(eventName, (...args) => eventFunction.run(bot, discord, db, ...args, quoteAmount));
    console.log(`The event: "${eventName}" has been loaded`.verbose);
}
console.log("All commands and events that have been found are loaded!".verbose);

if (fs.existsSync("./config.json")) {
    let config = require("./config.json");
    if(config.login == false) return console.log("Login disabled due to config.".warn);
    if(config.token == "") { console.log("No token specified".error); process.exit(1); }
    try {
        bot.login(config.token);
    } catch (error) {
        console.error(`${error}`.error);
    }
} else {
    console.log("Creating new config.json".warn);
    let configFile = {
        "token": "",
        "login": false
    }

    let data = JSON.stringify(configFile);
    fs.writeFileSync(`./config.json`, data);
    console.log("Make sure the token field on the config.json is populated with the bot's token and login is set to true!".error);
    process.exit(1);
};