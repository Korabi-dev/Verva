// Definitions \\

const discord = require("discord.js");
const intents = discord.Intents.FLAGS
require("dotenv").config()
const client = new discord.Client({ intents: 32767, partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER'] });
const mongoose = require("mongoose")
client.functions = require("./functions")
client.commands = new discord.Collection()
client.events = new discord.Collection()
client.config = process.env
client.models = mongoose.models
client.guild = async function(){return await client.guilds.cache.get(client.config.client_main_guild)}
const fs = require("fs")
const path = require("path")

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
})

client.login(process.env.client_token)