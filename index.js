const { Telegraf } = require('telegraf');
const config = require('./config');

const bot = new Telegraf(config.BOT_TOKEN);

// Importa los comandos
const startCommand = require('./commands/start');
const helpCommand = require('./commands/help');

// Configura los comandos
bot.start((ctx) => startCommand(ctx));
bot.help((ctx) => helpCommand(ctx));

// Lanza el bot
bot.launch()
  .then(() => console.log('TelmexioriBot está en línea!'))
  .catch((err) => console.error('Error al lanzar el bot:', err));

// Manejo de apagado del bot de forma segura
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
