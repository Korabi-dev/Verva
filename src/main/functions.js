require("dotenv").config()
const { MessageEmbed, MessageAttachment, Guild } = require("discord.js")
const mongoose = require("mongoose")
const models = require("./database")
/**
 * @param {Guild} guild
 */
module.exports = {
    embed: function(t, d){
        const embed = new MessageEmbed().setColor(process.env.embed_color)
        if(t) embed.setTitle(t.toString().trim())
if(d) embed.setDescription(d.toString())
return embed
    },
    log: async function(client, ...options){
        const channel = await client.channels.cache.get(process.env.client_logs)
        channel.send(...options)
    },
    error: function(d, t){
        const embed = new MessageEmbed().setColor("DARK_RED").setTitle(":x: Error")
         if(t) embed.setTitle(t.toString().trim())
         if(d) embed.setDescription(d.toString())
return embed
    },
    success: function(d, t){
        const embed = new MessageEmbed().setColor("GREEN").setTitle("✅ Success")
         if(t) embed.setTitle(t.toString().trim())
         if(d) embed.setDescription(d.toString())
return embed
    },
    thread_get: async function(options){
       return await models.threads.findOne(options)
},
    thread_delete: async function(client, options, closed){
        const data = await mongoose.models.threads.findOne({user: options.user})
        if(!data) throw new Error("No thread found")
        const channel = client.channels.cache.get(data.channel)
        const embed = client.functions.embed("Thread Closed", `Thread Owner: <@${data.user}>\nClosed by: ${closed}\nThread Participants:\n${data.participants.join("\n")}`).setTimestamp()
        const messages = new MessageAttachment(Buffer.from(`Messages:\n\n\n${data.messages.join("\n\n")}`), "Thread_Messages.txt")
        client.functions.log(client, {embeds: [embed], files: [messages]})
       await data.delete()
        try{
        await channel.delete()
        }catch(e){
            return;
        }
       return true
    },
thread_create: async function(client, options){
let data = await models.threads.findOne({user: options.user})
if(data) throw new Error("Thread already existant")
const guild = await client.guild()
const channel = await guild.channels.create(`Thread-${options.tag}`, {
    topic: `A thread made to help ${options._tag}`,
    nsfw: false,
    parent: guild.channels.cache.get(process.env.client_threads_category),
    reason: `${options._tag} opened a thread.`
})
const newd = new models.threads({
    user: options.user,
    channel: channel.id
})
await newd.save()
client.functions.log(client, {embeds: [client.functions.embed("Thread Opened", `Opened by: ${options._tag}`).setTimestamp()]})
channel.send({content: "<@&877679062015934564>,", embeds: [client.functions.embed("Help needed", `${options._tag} has required help.`)]})
return newd
}
}