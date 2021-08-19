const discord = require("discord.js")
module.exports = {
    name: "close",
    /**
     * 
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        const user = message.mentions.members?.first() || message.guild.members.cache.get(args[0])
        const channel = message.mentions.channels?.first() || message.guild.channels.cache.get(args[0])
        if(user){
            const data = await client.functions.thread_get({user: user.user.id})
            if(!data) return message.reply({embeds: [client.functions.error("This user does not have an open thread.")]})
            const c = await message.guild.channels.cache.get(data.channel)
            if(c){
                c.delete().catch(e => {
                    return;
                })
            }
            const u = await message.guild.members.cache.get(data.user)
                u.send({embeds: [client.functions.embed(":red_circle: Thread Closed", `Your thread has been closed by ${message.author.username}`).setColor("RED")]}).catch(e => {
                    return;
                })
            return await client.functions.thread_delete(client, {user: data.user}, message.author.username)
        }
        if(!user && channel){
            const data = await client.functions.thread_get({channel: channel.id})
            if(!data) return message.reply({embeds: [client.functions.error("That channel is not a thread channel.")]})
            const c = await message.guild.channels.cache.get(data.channel)
            if(c){
                c.delete().catch(e => {
                    return;
                })
            }
            const u = await message.guild.members.cache.get(data.user)
            
                u.send({embeds: [client.functions.embed(":red_circle: Thread Closed", `Your thread has been closed by ${message.author.username}`).setColor("RED")]}).catch(e => {
                    return;
                })
                return await client.functions.thread_delete(client, {user: data.user}, message.author.username)
            
        }
        if(!user && !channel){
            const data = await client.functions.thread_get({channel: message.channel.id})
            if(!data) return message.reply({embeds: [client.functions.error("This channel is not a thread channel, if you want to delete a specific thread use a user/channel like so: `v!close <user>` or `v!close <channel>`.")]})
            const c = await message.guild.channels.cache.get(data.channel)
            if(c){
                c.delete().catch(e => {
                    return;
                })
            }
            const u = await message.guild.members.cache.get(data.user)
            
                u.send({embeds: [client.functions.embed(":red_circle: Thread Closed", `Your thread has been closed by ${message.author.username}`).setColor("RED")]}).catch(e => {
                    return;
                })
                return await client.functions.thread_delete(client, {user: data.user}, message.author.username)
        
        }
    }
}