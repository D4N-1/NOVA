// Modulos = npm: packages / Librerias
// Libreria de librerias = FrameWork


import {
  useMultiFileAuthState, // Usar multiples archivos de estado de autenticacion
  makeWASocket, // Crear el nova
  downloadMediaMessage, // Descargar media del mensaje
  getContentType, // Saber que TIPO de mensaje es
  downloadContentFromMessage // Descargar media del mensaje
} from "baileys";

import pino from "pino"
import codigo from "qrcode"

let ruta = await useMultiFileAuthState("./auth") // \ = Win   |  / = JS


let nova = makeWASocket({ // Hacer un socket de WA
    auth: ruta.state,
    logger: pino({level: "silent"}) // Logger = log = console.log()
    // silent / crtical / error / info / debug / trace
})



nova.ev.on("creds.update", ruta.saveCreds)


nova.ev.on("connection.update", async(data) => {
    console.log(data)

    // Si QR es undefined, no seguir, de lo contrario, seguir
    if (data.qr == undefined) return

    console.log("❇️ SI HAY QR")
    console.log(await codigo.toString(data.qr, {type:"terminal", small: true}))
    
})


nova.ev.on("messages.upsert", async(data) => { // update + insert

    let mensaje = data?.messages?.[0]?.message?.videoMessage?.caption || data?.messages?.[0]?.message?.imageMessage?.caption ||
    data?.messages?.[0]?.message?.extendedTextMessage?.text || data?.messages?.[0]?.message?.conversation || ""

    let autorNombre = data?.messages?.[0]?.pushName
    let autor = data?.messages?.[0]?.key.participant || data?.messages?.[0]?.key.participantAlt

    let hora = new Date(data?.messages?.[0]?.messageTimestamp * 1000).toLocaleString()

    let tipo = getContentType(data.messages?.[0]?.message)

    let canal = data.messages[0].key.remoteJid

    if (tipo == "videoMessage" && data.messages?.[0]?.message.videoMessage.gifPlayback) tipo = "gifMessage"

    switch(tipo){
        case "conversation":
            tipo = "📄"
            break;
        case "imageMessage":
            tipo = "📷"
            break;
        case "videoMessage":
            tipo = "📽️"
            break;
        case "stickerMessage":
            tipo = "📔"
            break;
        case "extendedTextMessage":
            tipo = "📄"
            break;
        case "gifMessage":
            tipo = "📟"
            break;
    }

    console.info(`\n─────────────── [ INFO ] ───────────────`);
    console.log(`[${tipo}] 🆔  ${canal} / ${autor} :: ${mensaje}`); 
    console.log(`${autorNombre} - ⏳${hora}`);


    if (contenido == "hola"){
        nova.sendMessage(canal, { text: "¡Hola!, soy Nova, ¿En que puedo ayudarte hoy?"});
    }

    if (contenido == "ayuda"){
        nova.sendMessage(canal, {text: "¿En que puedo ayudarte hoy?"});
    }

    if (contenido == "comandos"){
        nova.sendMessage(canal, {text :"¡Aqui esta mi lista de comandos:!"})
    }

})


