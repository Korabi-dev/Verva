const discord = require("discord.js")
const noblox = require("noblox.js")
module.exports = {
    name: "promote",
    roles: ["878257030836674570"],
    admin: true,
    /**
     * 
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        var canrun = true
        if(!args[0]) return message.reply({embeds: [client.functions.error("You must provide a roblox username.")]})
        const id = await noblox.getIdFromUsername(args[0]).catch(e => {
            canrun = false
            return message.reply({embeds: [client.functions.error("Something went wrong when checking if the username is valid.")]})
        })
        if(!id) return message.reply({embeds: [client.functions.error("The username you provided was invalid.")]})
        var rank = await noblox.getRankInGroup(client.config.roblox_group, id).catch(e => {
            canrun = false
            return message.reply({embeds: [client.functions.error("Something went wrong when checking if the user is in the group.")]})
        })
        if(rank == 0){
            canrun = false
            return message.reply({embeds: [client.functions.error("This user is not in the group.")]})
        }
        await noblox.promote(client.config.roblox_group, id).catch(e => {
            canrun = false
            return message.reply({embeds: [client.functions.error("Could not promote this user, their rank is probably higher than mine or is ranked just below me.")]})
        })
        if(canrun == true){
            client.functions.log(client, {embeds: [client.functions.embed("User Promoted.", `User ${await noblox.getUsernameFromId(id)} is now at rank "${await noblox.getRankNameInGroup(client.config.roblox_group, id)}". Promoted by ${message.author.tag} (${message.author.id})`)]})
            return message.reply({embeds: [client.functions.success(`User ${await noblox.getUsernameFromId(id)} has been promoted.`)]})
        }
    }
}