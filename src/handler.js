'use strict'

const Discord = require('discord.js');

module.exports = async (event, context) => {
  try {
    let req = event.body;

    let result = await Send(req)
    let statuscode = 200;
    if (result.status != "success") {
      statuscode = 500;
      result.message = JSON.stringify(result.message);
    }
    console.log(result);

    return context
      .status(statuscode)
      .headers({
        "Content-type": "application/json; charset=utf-8"
      })
      .succeed(result)
  } catch (err) {
    console.log(err);
    return context
      .status(500)
      .headers({
        "Content-type": "application/json; charset=utf-8"
      })
      .succeed({ status: 'atcerror', message: err.toString() })
  }
}
async function Send(req) {
  return new Promise(resolve => {
    const bot = new Discord.Client();
    const TOKEN = req.credential.token;
    bot.login(TOKEN);
    bot.on('ready', () => {
      console.log(`Logged in as ${bot.user.tag}!`);
      bot.channels.cache.get(req.credential.channel).send(req.message).then(() => {
        resolve({ status: 'success', message: 'You successfully send this: ' + req.message });
      }).catch(err => {
        resolve({ status: 'serror', message: JSON.stringify(err) });
      });
    });
  });
}