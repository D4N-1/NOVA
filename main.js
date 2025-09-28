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

let ruta = await useMultiFileAuthState("./auth")

console.log(ruta)

let nova = makeWASocket({
    auth: ruta.state,
    logger: pino({level: "silent"})
})

nova.ev.on("creds.update", ruta.saveCreds)


nova.ev.on("connection.update", async(data) => {
    console.log(data)

    // Si QR es undefined, no seguir, de lo contrario, seguir
    if (data.qr == undefined) return

    console.log("❇️ SI HAY QR")
    console.log(await codigo.toString(data.qr, {type:"terminal", small: true}))
    
})


nova.ev.on("messages.upsert", async(data) => {

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



    if (mensaje == "4") nova.sendMessage(autor, { text: "En tu cola mi aparato"}) // Envia mensaje siple
    
    

    if (mensaje == "13") {
        let respuestas = [
            "Aquí tiene pa que me la bese",
            "entre más me la beses más me crece",
            "busca un cura pa que me la rece",
            "y trae un martillo pa que me la endereces",
            "por el chiquito se te aparece toas las veces",
            "cuando te estreses aquí te tengo éste pa que te desestreses",
            "con este tallo el jopo se te esflorece",
            "se cumple el ciclo hasta que anochece",
            "de tanto entablar la raja del jopo se te desaparece"
        ]

        // Math.floor(Math.random() * 100) + 1
        nova.sendMessage(autor, { text: respuestas[ Math.floor(Math.random() * respuestas.length) ]})
    }

    if(mensaje== "5" ){
        nova.sendMessage(autor, {text:"por el 4 letras te la inco"})
    }


})


