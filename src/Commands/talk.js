const discord = require("discord.js")
const { default: axios } = require("axios")
module.exports = {
    name: "talk",
    /**
     * 
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
    if(!args[0]) return message.reply({embeds: [client.functions.error("You need to provide a message")]})
        var reply = {message: "beep boop beep boop *robot go stupid*"}
        try{
            const { data } = await axios.get(client.config.chatbot_api + `?message=${args.all}`)
            reply = data
        }catch(e){
            console.log(e)
            reply = {message: "beep boop beep boop *robot go stupid*"}
        }
        
 message.reply({embeds: [client.functions.embed(`${client.user.username}:`, reply.message) ]})
    }
}