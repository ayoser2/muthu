//═══════════════════════════════════════════════════════// 
 // 
 //                              𝙶𝙾𝙹𝙾-𝚂𝙰𝚃𝙾𝚁𝚄 𝓫𝔂 𝓷𝓮𝔁𝓾𝓼𝓝𝔀 
 //𝙰𝙳𝙾𝙿𝚃𝙴𝙳 𝙵𝚁𝙾𝙼  𝚂𝙲𝚁𝙸𝙿𝚃 𝙾𝙵 𝙲𝙷𝙴𝙴𝙼𝚂𝙱𝙾𝚃 𝚅2 𝙱𝚈 𝙳𝙶𝚇𝚎𝚘𝚗  
 // 
 //════════════════════════════// 
  
 require('./settings') 
 const { default: NexusNwIncConnect, useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@adiwajshing/baileys") 
 const { state, saveState } = useSingleFileAuthState(`./${sessionName}.json`) 
 const pino = require('pino') 
 const { Boom } = require('@hapi/boom') 
 const fs = require('fs') 
 const yargs = require('yargs/yargs') 
 const chalk = require('chalk') 
 const FileType = require('file-type') 
 const path = require('path') 
 const PhoneNumber = require('awesome-phonenumber') 
 const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif') 
 const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require('./lib/myfunc') 
  
 var low 
 try { 
   low = require('lowdb') 
 } catch (e) { 
   low = require('./lib/lowdb') 
 } 
  
 const { Low, JSONFile } = low 
 const mongoDB = require('./lib/mongoDB') 
  
 global.api = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '') 
  
 const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) }) 
  
 global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse()) 
 global.db = new Low( 
   /https?:\/\//.test(opts['db'] || '') ? 
     new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ? 
       new mongoDB(opts['db']) : 
       new JSONFile(`database/database.json`) 
 ) 
 global.db.data = { 
     users: {}, 
     chats: {}, 
     database: {}, 
     game: {}, 
     settings: {}, 
     others: {}, 
     sticker: {}, 
     ...(global.db.data || {}) 
 } 
  
 // save database every 30seconds 
 if (global.db) setInterval(async () => { 
     if (global.db.data) await global.db.write() 
   }, 30 * 1000) 
  
 async function startRedDragonMdNx() { 
     const RedDragonMdNx = NexusNwIncConnect({ 
         logger: pino({ level: 'silent' }), 
         printQRInTerminal: true, 
         browser: ['Gojo Satoru\Nexus','Safari','1.0.0'], 
         auth: state 
     }) 
  
     store.bind(RedDragonMdNx.ev) 
      
     // anticall auto block 
     RedDragonMdNx.ws.on('CB:call', async (json) => { 
     const callerId = json.content[0].attrs['call-creator'] 
     if (json.content[0].tag == 'offer') { 
     let pa7rick = await RedDragonMdNx.sendContact(callerId, global.owner) 
     RedDragonMdNx.sendMessage(callerId, { text: `Automatic Block System!\nDon't Call Bot!\nPlease Ask Or Contact The Owner To Unblock You!`}, { quoted : pa7rick }) 
     await sleep(8000) 
     await RedDragonMdNx.updateBlockStatus(callerId, "block") 
     } 
     }) 
  
     RedDragonMdNx.ev.on('messages.upsert', async chatUpdate => { 
         //console.log(JSON.stringify(chatUpdate, undefined, 2)) 
         try { 
         mek = chatUpdate.messages[0] 
         if (!mek.message) return 
         mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message 
         if (mek.key && mek.key.remoteJid === 'status@broadcast') return 
         if (!RedDragonMdNx.public && !mek.key.fromMe && chatUpdate.type === 'notify') return 
         if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return 
         m = smsg(RedDragonMdNx, mek, store) 
         require("./team")(RedDragonMdNx, m, chatUpdate, store) 
         } catch (err) { 
             console.log(err) 
         } 
     }) 
      
     // Group Update 
     RedDragonMdNx.ev.on('groups.update', async pea => { 
        //console.log(pea) 
     // Get Profile Picture Group 
        try { 
        ppgc = await RedDragonMdNx.profilePictureUrl(pea[0].id, 'image') 
        } catch { 
        ppgc = 'https://shortlink.RedDragonMdNxarridho.my.id/rg1oT' 
        } 
        let wm_fatih = { url : ppgc } 
        if (pea[0].announce == true) { 
        RedDragonMdNx.send5ButImg(pea[0].id, `「 Group Settings Changed 」\n\nThe Group Has Been Closed By Admin, Now Only Admin Can Send Messages !`, `Group Settings Change Message`, wm_fatih, []) 
        } else if(pea[0].announce == false) { 
        RedDragonMdNx.send5ButImg(pea[0].id, `「 Group Settings Changed 」\n\nThe Group Has Been Opened By Admin, Now Participants Can Send Messages !`, `Group Settings Change Message`, wm_fatih, []) 
        } else if (pea[0].restrict == true) { 
        RedDragonMdNx.send5ButImg(pea[0].id, `「 Group Settings Changed 」\n\nGroup Info Has Been Restricted, Now Only Admin Can Edit Group Info !`, `Group Settings Change Message`, wm_fatih, []) 
        } else if (pea[0].restrict == false) { 
        RedDragonMdNx.send5ButImg(pea[0].id, `「 Group Settings Changed 」\n\nGroup Info Has Been Opened, Now Participants Can Edit Group Info !`, `Group Settings Change Message`, wm_fatih, []) 
        } else { 
        RedDragonMdNx.send5ButImg(pea[0].id, `「 Group Settings Changed 」\n\nGroup Subject Has Been Changed To *${pea[0].subject}*`, `Group Settings Change Message`, wm_fatih, []) 
      } 
     }) 
  
     RedDragonMdNx.ev.on('group-participants.update', async (anu) => { 
         console.log(anu) 
         try { 
             let metadata = await RedDragonMdNx.groupMetadata(anu.id) 
             let participants = anu.participants 
             for (let num of participants) { 
                 // Get Profile Picture User 
                 try { 
                     ppuser = await RedDragonMdNx.profilePictureUrl(num, 'image') 
                 } catch { 
                     ppuser = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg' 
                 } 
  
                 //Get Profile Picture Group\\ 
                 try { 
                     ppgroup = await RedDragonMdNx.profilePictureUrl(anu.id, 'image') 
                 } catch { 
                     ppgroup = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg' 
                 } 
  
 //welcome\\ 
         let nama = await RedDragonMdNx.getName(num) 
 memb = metadata.participants.length 
  
 Kon = await getBuffer(`https://hardianto.xyz/api/welcome3?profile=${encodeURIComponent(ppuser)}&name=${encodeURIComponent(nama)}&bg=https://telegra.ph/file/8bbe8a7de5c351dfcb077.jpg&namegb=${encodeURIComponent(metadata.subject)}&member=${encodeURIComponent(memb)}`) 
  
 Tol = await getBuffer(`https://hardianto.xyz/api/goodbye3?profile=${encodeURIComponent(ppuser)}&name=${encodeURIComponent(nama)}&bg=https://telegra.ph/file/8bbe8a7de5c351dfcb077.jpg&namegb=${encodeURIComponent(metadata.subject)}&member=${encodeURIComponent(memb)}`) 
                 if (anu.action == 'add') { 
                     RedDragonMdNx.sendMessage(anu.id, { image: Kon, contextInfo: { mentionedJid: [num] }, caption: ` 
 ⭐✑ Hi👋 @${num.split("@")[0]}, 
 ⭐✑ Welcome To ${metadata.subject} 
  
 ⭐✑ Description: ${metadata.desc} 
  
 ⭐✑ Welcome To Our Comfortable Happy😋, Sometimes Loud😜, Usually Messy🤥, Full Of Love🥰, HOME😌!!`} ) 
                 } else if (anu.action == 'remove') { 
                     RedDragonMdNx.sendMessage(anu.id, { image: Tol, contextInfo: { mentionedJid: [num] }, caption: `⭐✑ @${num.split("@")[0]} Left ${metadata.subject} 
  
 ⭐✑ I'm Not Sure If It Was A Goodbye Charm, But It Was Fun While It Lasted 😌✨` }) 
                 } 
             } 
         } catch (err) { 
             console.log(err) 
         } 
     }) 
          
     //Setting\\ 
     RedDragonMdNx.decodeJid = (jid) => { 
         if (!jid) return jid 
         if (/:\d+@/gi.test(jid)) { 
             let decode = jidDecode(jid) || {} 
             return decode.user && decode.server && decode.user + '@' + decode.server || jid 
         } else return jid 
     } 
      
     RedDragonMdNx.ev.on('contacts.update', update => { 
         for (let contact of update) { 
             let id = RedDragonMdNx.decodeJid(contact.id) 
             if (store && store.contacts) store.contacts[id] = { id, name: contact.notify } 
         } 
     }) 
  
     RedDragonMdNx.getName = (jid, withoutContact  = false) => { 
         id = RedDragonMdNx.decodeJid(jid) 
         withoutContact = RedDragonMdNx.withoutContact || withoutContact  
         let v 
         if (id.endsWith("@g.us")) return new Promise(async (resolve) => { 
             v = store.contacts[id] || {} 
             if (!(v.name || v.subject)) v = RedDragonMdNx.groupMetadata(id) || {} 
             resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international')) 
         }) 
         else v = id === '0@s.whatsapp.net' ? { 
             id, 
             name: 'WhatsApp' 
         } : id === RedDragonMdNx.decodeJid(RedDragonMdNx.user.id) ? 
             RedDragonMdNx.user : 
             (store.contacts[id] || {}) 
             return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international') 
     } 
      
     RedDragonMdNx.sendContact = async (jid, kon, quoted = '', opts = {}) => { 
         let list = [] 
         for (let i of kon) { 
             list.push({ 
                     displayName: await RedDragonMdNx.getName(i + '@s.whatsapp.net'), 
                     vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${ownername}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click To Chat\nitem2.EMAIL;type=INTERNET:${sc}\nitem2.X-ABLabel:Script\nitem3.URL:${myweb}\nitem3.X-ABLabel:Script\nitem4.ADR:;;${region};;;;\nitem4.X-ABLabel:Region\nEND:VCARD` 
             }) 
         } 
         RedDragonMdNx.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted }) 
     } 
      
     RedDragonMdNx.setStatus = (status) => { 
         RedDragonMdNx.query({ 
             tag: 'iq', 
             attrs: { 
                 to: '@s.whatsapp.net', 
                 type: 'set', 
                 xmlns: 'status', 
             }, 
             content: [{ 
                 tag: 'status', 
                 attrs: {}, 
                 content: Buffer.from(status, 'utf-8') 
             }] 
         }) 
         return status 
     } 
          
     RedDragonMdNx.public = true 
  
     RedDragonMdNx.serializeM = (m) => smsg(RedDragonMdNx, m, store) 
  
     RedDragonMdNx.ev.on('connection.update', async (update) => { 
         const { connection, lastDisconnect } = update             
         if (connection === 'close') { 
         let reason = new Boom(lastDisconnect?.error)?.output.statusCode 
             if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); RedDragonMdNx.logout(); } 
             else if (reason === DisconnectReason.connectionClosed) { console.log("🐦Connection closed, reconnecting...."); startRedDragonMdNx(); } 
             else if (reason === DisconnectReason.connectionLost) { console.log("🐦Connection Lost from Server, reconnecting..."); startRedDragonMdNx(); } 
             else if (reason === DisconnectReason.connectionReplaced) { console.log("🐦Connection Replaced, Another New Session Opened, Please Close Current Session First"); RedDragonMdNx.logout(); } 
             else if (reason === DisconnectReason.loggedOut) { console.log(`🐦Device Logged Out, Please Scan Again And Run.`); RedDragonMdNx.logout(); } 
             else if (reason === DisconnectReason.restartRequired) { console.log("🐦Restart Required, Restarting..."); startRedDragonMdNx(); } 
             else if (reason === DisconnectReason.timedOut) { console.log("🐦Connection TimedOut, Reconnecting..."); startRedDragonMdNx(); } 
             else RedDragonMdNx.end(`🐦Unknown DisconnectReason: ${reason}|${connection}`) 
         } 
         console.log('Connected...', update) 
     }) 
  
     RedDragonMdNx.ev.on('creds.update', saveState) 
  
     // Add Other 
     /** Send Button 5 Image 
      * 
      * @param {*} jid 
      * @param {*} text 
      * @param {*} footer 
      * @param {*} image 
      * @param [*] button 
      * @param {*} options 
      * @returns 
      */ 
     RedDragonMdNx.send5ButImg = async (jid , text = '' , footer = '', img, but = [], options = {}) =>{ 
         let message = await prepareWAMessageMedia({ image: img }, { upload: RedDragonMdNx.waUploadToServer }) 
         var template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({ 
         templateMessage: { 
         hydratedTemplate: { 
         imageMessage: message.imageMessage, 
                "hydratedContentText": text, 
                "hydratedFooterText": footer, 
                "hydratedButtons": but 
             } 
             } 
             }), options) 
             RedDragonMdNx.relayMessage(jid, template.message, { messageId: template.key.id }) 
     } 
  
     /** 
      *  
      * @param {*} jid  
      * @param {*} buttons  
      * @param {*} caption  
      * @param {*} footer  
      * @param {*} quoted  
      * @param {*} options  
      */ 
     RedDragonMdNx.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => { 
         let buttonMessage = { 
             text, 
             footer, 
             buttons, 
             headerType: 2, 
             ...options 
         } 
         RedDragonMdNx.sendMessage(jid, buttonMessage, { quoted, ...options }) 
     } 
      
     /** 
      *  
      * @param {*} jid  
      * @param {*} text  
      * @param {*} quoted  
      * @param {*} options  
      * @returns  
      */ 
     RedDragonMdNx.sendText = (jid, text, quoted = '', options) => RedDragonMdNx.sendMessage(jid, { text: text, ...options }, { quoted }) 
  
     /** 
      *  
      * @param {*} jid  
      * @param {*} path  
      * @param {*} caption  
      * @param {*} quoted  
      * @param {*} options  
      * @returns  
      */ 
     RedDragonMdNx.sendImage = async (jid, path, caption = '', quoted = '', options) => { 
         let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0) 
         return await RedDragonMdNx.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted }) 
     } 
  
     /** 
      *  
      * @param {*} jid  
      * @param {*} path  
      * @param {*} caption  
      * @param {*} quoted  
      * @param {*} options  
      * @returns  
      */ 
     RedDragonMdNx.sendVideo = async (jid, path, caption = '', quoted = '', gif = false, options) => { 
         let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0) 
         return await RedDragonMdNx.sendMessage(jid, { video: buffer, caption: caption, gifPlayback: gif, ...options }, { quoted }) 
     } 
  
     /** 
      *  
      * @param {*} jid  
      * @param {*} path  
      * @param {*} quoted  
      * @param {*} mime  
      * @param {*} options  
      * @returns  
      */ 
     RedDragonMdNx.sendAudio = async (jid, path, quoted = '', ptt = false, options) => { 
         let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0) 
         return await RedDragonMdNx.sendMessage(jid, { audio: buffer, ptt: ptt, ...options }, { quoted }) 
     } 
  
     /** 
      *  
      * @param {*} jid  
      * @param {*} text  
      * @param {*} quoted  
      * @param {*} options  
      * @returns  
      */ 
     RedDragonMdNx.sendTextWithMentions = async (jid, text, quoted, options = {}) => RedDragonMdNx.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted }) 
  
     /** 
      *  
      * @param {*} jid  
      * @param {*} path  
      * @param {*} quoted  
      * @param {*} options  
      * @returns  
      */ 
     RedDragonMdNx.sendImageAsSticker = async (jid, path, quoted, options = {}) => { 
         let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0) 
         let buffer 
         if (options && (options.packname || options.author)) { 
             buffer = await writeExifImg(buff, options) 
         } else { 
             buffer = await imageToWebp(buff) 
         } 
  
         await RedDragonMdNx.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted }) 
         return buffer 
     } 
  
     /** 
      *  
      * @param {*} jid  
      * @param {*} path  
      * @param {*} quoted  
      * @param {*} options  
      * @returns  
      */ 
     RedDragonMdNx.sendVideoAsSticker = async (jid, path, quoted, options = {}) => { 
         let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0) 
         let buffer 
         if (options && (options.packname || options.author)) { 
             buffer = await writeExifVid(buff, options) 
         } else { 
             buffer = await videoToWebp(buff) 
         } 
  
         await RedDragonMdNx.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted }) 
         return buffer 
     } 
          
     /** 
      *  
      * @param {*} message  
      * @param {*} filename  
      * @param {*} attachExtension  
      * @returns  
      */ 
     RedDragonMdNx.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => { 
         let quoted = message.msg ? message.msg : message 
         let mime = (message.msg || message).mimetype || '' 
         let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0] 
         const stream = await downloadContentFromMessage(quoted, messageType) 
         let buffer = Buffer.from([]) 
         for await(const chunk of stream) { 
             buffer = Buffer.concat([buffer, chunk]) 
         } 
         let type = await FileType.fromBuffer(buffer) 
         trueFileName = attachExtension ? (filename + '.' + type.ext) : filename 
         // save to file 
         await fs.writeFileSync(trueFileName, buffer) 
         return trueFileName 
     } 
  
     RedDragonMdNx.downloadMediaMessage = async (message) => { 
         let mime = (message.msg || message).mimetype || '' 
         let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0] 
         const stream = await downloadContentFromMessage(message, messageType) 
         let buffer = Buffer.from([]) 
         for await(const chunk of stream) { 
             buffer = Buffer.concat([buffer, chunk]) 
         } 
          
         return buffer 
      }  
      
     /** 
      *  
      * @param {*} jid  
      * @param {*} path  
      * @param {*} filename 
      * @param {*} caption 
      * @param {*} quoted  
      * @param {*} options  
      * @returns  
      */ 
     RedDragonMdNx.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => { 
         let types = await RedDragonMdNx.getFile(path, true) 
            let { mime, ext, res, data, filename } = types 
            if (res && res.status !== 200 || file.length <= 65536) { 
                try { throw { json: JSON.parse(file.toString()) } } 
                catch (e) { if (e.json) throw e.json } 
            } 
        let type = '', mimetype = mime, pathFile = filename 
        if (options.asDocument) type = 'document' 
        if (options.asSticker || /webp/.test(mime)) { 
         let { writeExif } = require('./lib/exif') 
         let media = { mimetype: mime, data } 
         pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] }) 
         await fs.promises.unlink(filename) 
         type = 'sticker' 
         mimetype = 'image/webp' 
         } 
        else if (/image/.test(mime)) type = 'image' 
        else if (/video/.test(mime)) type = 'video' 
        else if (/audio/.test(mime)) type = 'audio' 
        else type = 'document' 
        await RedDragonMdNx.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options }) 
        return fs.promises.unlink(pathFile) 
        } 
  
     /** 
      *  
      * @param {*} jid  
      * @param {*} message  
      * @param {*} forceForward  
      * @param {*} options  
      * @returns  
      */ 
     RedDragonMdNx.copyNForward = async (jid, message, forceForward = false, options = {}) => { 
         let vtype 
                 if (options.readViewOnce) { 
                         message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined) 
                         vtype = Object.keys(message.message.viewOnceMessage.message)[0] 
                         delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined)) 
                         delete message.message.viewOnceMessage.message[vtype].viewOnce 
                         message.message = { 
                                 ...message.message.viewOnceMessage.message 
                         } 
                 } 
  
         let mtype = Object.keys(message.message)[0] 
         let content = await generateForwardMessageContent(message, forceForward) 
         let ctype = Object.keys(content)[0] 
                 let context = {} 
         if (mtype != "conversation") context = message.message[mtype].contextInfo 
         content[ctype].contextInfo = { 
             ...context, 
             ...content[ctype].contextInfo 
         } 
         const waMessage = await generateWAMessageFromContent(jid, content, options ? { 
             ...content[ctype], 
             ...options, 
             ...(options.contextInfo ? { 
                 contextInfo: { 
                     ...content[ctype].contextInfo, 
                     ...options.contextInfo 
                 } 
             } : {}) 
         } : {}) 
         await RedDragonMdNx.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id }) 
         return waMessage 
     } 
  
     RedDragonMdNx.cMod = (jid, copy, text = '', sender = RedDragonMdNx.user.id, options = {}) => { 
         //let copy = message.toJSON() 
                 let mtype = Object.keys(copy.message)[0] 
                 let isEphemeral = mtype === 'ephemeralMessage' 
         if (isEphemeral) { 
             mtype = Object.keys(copy.message.ephemeralMessage.message)[0] 
         } 
         let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message 
                 let content = msg[mtype] 
         if (typeof content === 'string') msg[mtype] = text || content 
                 else if (content.caption) content.caption = text || content.caption 
                 else if (content.text) content.text = text || content.text 
                 if (typeof content !== 'string') msg[mtype] = { 
                         ...content, 
                         ...options 
         } 
         if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant 
                 else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant 
                 if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid 
                 else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid 
                 copy.key.remoteJid = jid 
                 copy.key.fromMe = sender === RedDragonMdNx.user.id 
  
         return proto.WebMessageInfo.fromObject(copy) 
     } 
  
  
     /** 
      *  
      * @param {*} path  
      * @returns  
      */ 
     RedDragonMdNx.getFile = async (PATH, save) => { 
         let res 
         let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0) 
         //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer') 
         let type = await FileType.fromBuffer(data) || { 
             mime: 'application/octet-stream', 
             ext: '.bin' 
         } 
         filename = path.join(__filename, '../src/' + new Date * 1 + '.' + type.ext) 
         if (data && save) fs.promises.writeFile(filename, data) 
         return { 
             res, 
             filename, 
             size: await getSizeMedia(data), 
             ...type, 
             data 
         } 
  
     } 
  
     return RedDragonMdNx 
 } 
  
 startRedDragonMdNx() 
  
  
 let file = require.resolve(__filename) 
 fs.watchFile(file, () => { 
         fs.unwatchFile(file) 
         console.log(chalk.redBright(`Update ${__filename}`)) 
         delete require.cache[file] 
         require(file) 
 })