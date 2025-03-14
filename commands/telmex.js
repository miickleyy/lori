const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
  // Obtiene el número que se envió con el comando
  const text = ctx.message.text.split(' ')[1]; // El comando y el número llegan en el mismo mensaje

  if (!text) {
    return ctx.reply('Debes ingresar el número Telmex a consultar, por ejemplo: /telmex 8991412429');
  }

  // URL con el número ingresado
  const url = `https://transactconfig2.telmex.com/OP/iniCM?t=${text}`;

  try {
    // Headers de un navegador Android 10
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.152 Mobile Safari/537.36'
    };

    // Realizamos la solicitud GET a la URL con los headers
    const { data } = await axios.get(url, { headers });

    // Usamos Cheerio para cargar el HTML
    const $ = cheerio.load(data);

    // Extraemos los datos deseados
    const numero = $('#telefono').text().trim();
    const fechaCorte = $('#fechaVencimiento').text().trim();
    const saldoTotal = $('#saldoActual').text().trim();
    const saldoVencido = $('#saldoVencido').text().trim();

    // Construimos el mensaje de respuesta
    const respuesta = `
📞 *Número Telmex*: ${numero}
📅 *Fecha de Corte*: ${fechaCorte}
💸 *Pagar Saldo Total*: ${saldoTotal}
⚠️ *Pagar Saldo Vencido*: ${saldoVencido}
    `;

    ctx.reply(respuesta, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('Error:', err.message);
    ctx.reply('Ocurrió un error al obtener la información.');
  }
};
