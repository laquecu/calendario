const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const client = new Client();

// Mostrar el QR Code en la consola
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Detectar cuando el cliente está listo
client.on('ready', () => {
    console.log('WhatsApp Web client is ready!');
});

// Inicializar cliente
client.initialize();

// Función para enviar un mensaje de WhatsApp
const sendWhatsAppMessage = (number, message) => {
    // El número debe incluir el código de país, por ejemplo: "5491123456789"
    const chatId = `${number}@c.us`; // Formato que WhatsApp espera
    client.sendMessage(chatId, message).then(response => {
        console.log('Mensaje enviado correctamente:', response);
    }).catch(error => {
        console.error('Error al enviar el mensaje:', error);
    });
};

module.exports = { sendWhatsAppMessage, client };
