// Modulos = npm: packages / Librerias
// Libreria de librerias = FrameWork


import {
  useMultiFileAuthState, // Usar multiples archivos de estado de autenticacion
  makeWASocket, // Crear el nova
  downloadMediaMessage, // Descargar media del mensaje
  getContentType, // Saber que TIPO de mensaje es
  downloadContentFromMessage // Descargar media del mensaje
} from "@itsukichan/baileys";

import pino from "pino"
import codigo from "qrcode"
import fs from "fs"
import path from "path"

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

    let message = data?.messages[0]

    let mensaje = message?.message?.videoMessage?.caption || message?.message?.imageMessage?.caption ||
    message?.message?.extendedTextMessage?.text || message?.message?.conversation || ""

    let autorNombre = message?.pushName
    let autor = message?.key.participant || message?.key.participantAlt

    let hora = new Date(message?.messageTimestamp * 1000).toLocaleString()

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

    if (autorNombre == undefined || autor == undefined) return

    console.info(`\n─────────────── [ INFO ] ───────────────`);
    console.log(`[${tipo}] 🆔  ${canal} / ${autor} :: ${mensaje}`); 
    console.log(`${autorNombre} - ⏳${hora}`);


    switch (mensaje){

        case "Hola":
            await nova.sendMessage(canal, { text: `Hola, como estas ${autorNombre}?`}) // Enviar texto
            break;
        
        case "Ayuda":
            await nova.sendMessage(canal, { text: `¿En que te puedo ayudar hoy ${autorNombre}?`}, {quoted: message}) // Responder
            break;
        
        case "Mencion":
            await nova.sendMessage(canal, { text: `@${autor.split("@")[0]}`, mentions: [autor]}) // Mencion
            break;
        
        case "Cancha":

            await nova.sendMessage(canal, { caption: "Aqui tienes la imagen de la cancha", image: fs.readFileSync("./imagenes/cancha uni.jpg")}, { quoted: message})
            break;

        case "Video":

            await nova.sendMessage(canal, { caption: "Aqui tienes tu video", video: fs.readFileSync("./video/VR.mp4")})
            break;

        case "Audio":
            console.log("Si se recibio la peticion de audio")
            await nova.sendMessage(canal, { audio: {url: path.resolve("audio", "zi.mp3")} })
            break;
    }


    if(contenido == "documento"){
        let bufer =fs.readFileSync("./recursos/vans.txt","utf-8")
        nova.sendMessage(canal,{document:bufer,text:'innovacion'})
        
    }

})


