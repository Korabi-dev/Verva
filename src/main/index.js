// Definitions \\

const discord = require("discord.js");
require("dotenv").config()
const client = new discord.Client({ intents: 32767, partials: ['CHANNEL'] });// ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER']
const mongoose = require("mongoose")
const app = require("express")()
client.functions = require("./functions")
client.commands = new discord.Collection()
client.events = new discord.Collection()
client.config = process.env
client.models = mongoose.models
client.guild = async function(){return await client.guilds.cache.get(client.config.client_main_guild)}
const fs = require("fs")
const path = require("path")
const noblox = require('noblox.js')

// Critical events and functions\\

mongoose.connect(process.env.client_mongo, {useFindAndModify: true, useNewUrlParser: true, useUnifiedTopology: true})
client.on("ready", () => {
    var commands = 1
    var events = 1
    const commandfiles = fs.readdirSync("src/Commands").filter(f => f.endsWith(".js") || f.endsWith(".ts"))
    for(file of commandfiles){
        const command = require("../Commands/" + file)
        if(!command.name) command.name = file.replace(".js", "").replace(".ts", "").trim()
        command.name = command.name.toLowerCase()
        if(client.commands.get(command.name)) return console.log(`Duplicate command detected and not loaded. Path: ${path.join(__dirname + "/src/Commands/" + file)}`)
        if(!command.run || typeof command.run !== "function") return console.log(`Invalid run function detected, command not loaded. Path: ${path.join(__dirname + "/src/Commands/" + file)}`)
        client.commands.set(command.name, command)
        console.log(`Loaded Command ${command.name} successfully. #${commands}`)
        ++commands
    }
    const eventfiles = fs.readdirSync("src/Events").filter(f => f.endsWith(".js") || f.endsWith(".ts"))
    for(file of eventfiles){
        const event = require('../Events/' + file)
        if(!event.name) return console.log(`Unnamed event detected and not loaded. Path: ${path.join(__dirname + "/src/Events/" + file)}`)
        if(!event.run || typeof event.run !== "function") return console.log(`Invalid run function detected, event not loaded. Path: ${path.join(__dirname + "/src/Events/" + file)}`)
        client.on(event.name, async(...args) => {
            try{
                await event.run(...args, client)
            }catch(e){
                console.log(`Event ${file.name} had an error, Path: ${path.join(__dirname + "/src/Events/" + file)}\n\n${require("util").inspect(e, {depth:2})}`)
            }
        })
        console.log(`Loaded Event ${event.name} successfully. #${events}`)
        ++events
    }
    console.log(`${client.user.username} is online.`)
    client.user.setActivity({type: "COMPETING", name: "being prettier than you 🥺"})
async function startApp () {
    const currentUser = await noblox.setCookie(process.env.roblox_cookie) 
    console.log(`Logged in as ${currentUser.UserName} on roblox.`)
}
startApp()
})
app.get("/demote", async(req, res) => {
    try{
    const admins = ["669882318"]
    const demoter = req.query.demoter?.toString()
    const demotee = await (await noblox.getIdFromUsername(req.query.demotee?.toString())).toString()
    if(!demoter || !demotee) return res.send("Insufficient arguments.")
    const auth = req.query.auth?.toString()
    if(auth !== client.config.roblox_auth || !auth) return res.send("No authorization.")
    if(admins.includes(demotee.toString())) return res.send("This user can't be demoted, please do it manually.")
    const demoter_rank = await noblox.getRankInGroup(client.config.roblox_group, Number(demoter)).catch(e => {return e})
    const demotee_rank = await noblox.getRankInGroup(client.config.roblox_group, Number(demotee)).catch(e => {return e})
    if(demotee_rank == 0) return res.send("Demotee is not in the group.")
    if(demoter_rank == 0) return res.send("Demoter not in the group.")
    if(demotee_rank >= demoter_rank) return res.send("Your rank is too low to perform this action.")
    let demoted = true
await noblox.demote(client.config.roblox_group, Number(demotee)).catch(e => {
demoted = false
 return res.send(e.message, false, true)
})
if(demoted == true){
    client.functions.log(client, {embeds: [client.functions.embed("Demoted", `${await noblox.getUsernameFromId(Number(demotee))} was demoted to rank ${await noblox.getRankNameInGroup(client.config.roblox_group, Number(demotee))} by ${await noblox.getUsernameFromId(Number(demoter))}.`)]})
    return res.send(`${await noblox.getUsernameFromId(Number(demotee))} was demoted to rank ${await noblox.getRankNameInGroup(client.config.roblox_group, Number(demotee))}.`)
}
}catch(e){
    console.log(e)
    return res.send("There was an unknown error while performing this action, Please contact Korabi or an SR.")
}
})
app.get("/promote", async(req, res) => {
    try {
    const admins = ["669882318"]
    const demoter = req.query.demoter?.toString()
    const demotee = await (await noblox.getIdFromUsername(req.query.demotee?.toString())).toString()
    if(!demoter || !demotee) return res.send("Insufficient arguments.")
    const auth = req.query.auth?.toString()
    if(auth !== client.config.roblox_auth || !auth) return res.send("No authorization.")
    if(admins.includes(demotee.toString())) return res.send("This user can't be promoted, please do it manually.")
    const demoter_rank = await noblox.getRankInGroup(client.config.roblox_group, Number(demoter)).catch(e => {return e})
    const demotee_rank = await noblox.getRankInGroup(client.config.roblox_group, Number(demotee)).catch(e => {return e})
    if(demotee_rank == 0) return res.send("Promotee is not in the group.")
    if(demoter_rank == 0) return res.send("Promoter not in the group.")
    if(demotee_rank >= demoter_rank || demoter_rank - demotee_rank <= 1) return res.send("Your rank is too low to perform this action.")
    let demoted = true
await noblox.promote(client.config.roblox_group, Number(demotee)).catch(e => {
demoted = false
 return res.send(e.message, false, true)
})
if(demoted == true){
    client.functions.log(client, {embeds: [client.functions.embed("Promoted", `${await noblox.getUsernameFromId(Number(demotee))} was promoted to rank ${await noblox.getRankNameInGroup(client.config.roblox_group, Number(demotee))} by ${await noblox.getUsernameFromId(Number(demoter))}.`)]})
    return res.send(`${await noblox.getUsernameFromId(Number(demotee))} was promoted to rank ${await noblox.getRankNameInGroup(client.config.roblox_group, Number(demotee))}.`)
}
    }catch(e){
        console.log(e)
        return res.send("There was an unknown error while performing this action, Please contact Korabi or an SR.")
    }
})
app.listen(process.env.PORT)
client.login(process.env.client_token)