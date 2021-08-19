const discord = require("discord.js")
module.exports = {
    name: "purge",
    permissions: ["MANAGE_MESSAGES"],
    /**
     * 
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
if(!args[0] || isNaN(args[0]) || Number(args[0]) > 100 || Number(args[0]) < 1) return message.reply({embeds: [client.functions.error("You need to provide a valid number of messages from 1 up to to 100.")]})
message.delete()
message.channel.bulkDelete(Number(args[0]))
    }
}