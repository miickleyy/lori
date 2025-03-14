const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
  // Obtiene el número que se envió con el comando
  const text = ctx.message.text.split(' ')[1]; // El comando y el número llegan en el mismo mensaje

  if (!text) {
    return ctx.reply('Debes ingresar el número Telmex a consultar, por ejemplo: /telmex 8991412429');
  }

  // URLs con el número ingresado
  const infoUrl = `https://transactconfig2.telmex.com/OP/iniCM?t=${text}`;
  const patrocinableUrl = `https://serviciosenlineatest.telmexusa.com/mexicoenlineausa/Home/ValidarCuentaPatrocinable?telMX=${text}`;

  try {
    // Headers de un navegador Android 10
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.152 Mobile Safari/537.36'
    };

    // Realizamos la primera solicitud para la información básica
    const { data } = await axios.get(infoUrl, { headers });
    const $ = cheerio.load(data);

    // Extraemos los datos deseados
    const numero = $('#telefono').text().trim();
    const fechaCorte = $('#fechaVencimiento').text().trim();
    const saldoTotal = $('#saldoActual').text().trim();
    const saldoVencido = $('#saldoVencido').text().trim();

    // Segunda solicitud para obtener el titular
    const { data: patrocinableData } = await axios.get(patrocinableUrl);
    const titular = patrocinableData.Titular || 'No disponible';
    const saldo = patrocinableData.Saldo !== undefined ? `$${patrocinableData.Saldo}` : 'No disponible';
    const fechaVencimiento = patrocinableData.FechaVencimiento || 'No disponible';
    const patrocinable = patrocinableData.Patrocinable ? 'Sí' : 'No';

    // Construimos el mensaje de respuesta
    const respuesta = `
📞 *Número Telmex*: ${numero}
👤 *Titular*: ${titular}
📅 *Fecha de Corte*: ${fechaCorte}
💸 *Pagar Saldo Total*: ${saldoTotal}
⚠️ *Pagar Saldo Vencido*: ${saldoVencido}

🌐 *Patrocinable*: ${patrocinable}
💵 *Saldo*: ${saldo}
📆 *Fecha de Vencimiento*: ${fechaVencimiento}
    `;

    ctx.reply(respuesta, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('Error:', err.message);
    ctx.reply('Ocurrió un error al obtener la información.');
  }
};
      
