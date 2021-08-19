const discord = require("discord.js")
module.exports = {
    name: "ping",
    /**
     * 
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        message.reply({embeds: [client.functions.embed("Pong", `The websocket ping is ${client.ws.ping} miliseconds.`)]})
    }
}