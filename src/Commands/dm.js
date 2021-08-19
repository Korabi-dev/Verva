const discord = require("discord.js")
module.exports = {
    name: "dm",
    permissions: ["MANAGE_MESSAGES"],
    /**
     * 
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        const user = message.mentions.members?.first() || message.guild.members.cache.get(args[0])
        if(!user) return message.reply({embeds: [client.functions.error("You need to mention a user/user id")]})
        if(!args[1]) return message.reply({embeds: [client.functions.error("You need to provide something to dm this user")]})
        var sent = true
        const str = args.slice(1).join(" ")
        user.send({embeds: [client.functions.embed(`Message from ${message.author.username}`, str)]}).catch(e => {
            sent = false
            return message.reply({embeds: [client.functions.error("Could not send a dm to this user.")]})
        }).then(m => {
            if(sent == true){
           message.reply({embeds: [client.functions.success(`DM sent to ${user.user.username}`)]})
            }
        })
    }
}