const discord = require("discord.js");

module.exports.run = async (bot, discord, db, message, quoteAmount) => {
    if (message.author.bot || message.channel.type !== 'text') return;
    let number = Math.random() * (100 - 1) + 1
    console.log(`${message.author.username} got a ${number}`)
    if(number <= 5) {
        console.log(`Reacting to ${message.author.username}!`)
        let array = shuffleArray(Array.from({length: quoteAmount}, (_, index) => index + 1));
        const msg = message.content.toLowerCase().replace(/[`~@#$%^&*()_|+\-=?;:'",.<> \{\}\[\]\\\/]/gi, "") //winelectionbidenidk
        for (x = 0; x < array.length; x++) {
            let quotesdb = db.prepare(`SELECT * FROM quotes WHERE id = ?`).get(array[x]);
            let triggerwords = quotesdb.trigger.split(",")
            if(triggerwords.some(el => msg.includes(el)) == true) {
                console.log(`Responding with ${quotesdb.quote}`)
                return message.channel.send(quotesdb.quote);
            }
        }

    } else {return}

    function shuffleArray(array) {
        let curId = array.length;
        // There remain elements to shuffle
        while (0 !== curId) {
          // Pick a remaining element
          let randId = Math.floor(Math.random() * curId);
          curId -= 1;
          // Swap it with the current element.
          let tmp = array[curId];
          array[curId] = array[randId];
          array[randId] = tmp;
        }
        return array;
      }

}