const discord = require("discord.js")
const noblox = require("noblox.js")
module.exports = {
    name: "shout",
    roles: ["878257030836674570"],
    admin: true,
    /**
     * 
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        if(!args[0]) return message.reply({embeds: [client.functions.error("You must provide a shout.")]})
    const row = new discord.MessageActionRow().addComponents(new discord.MessageButton().setCustomId(`accept`).setStyle("SUCCESS").setLabel("Proceed"), new discord.MessageButton().setCustomId(`Cancel-${message.author.id}`).setStyle("DANGER").setLabel("Cancel"))
        const msg = await message.reply({embeds: [client.functions.embed(`Confirmation`, `Are you sure you want to set the group shout to "${args.all}"? You have 1 minute`).setColor("YELLOW")], components: [row]})
        const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });
        let done = false
        collector.on('collect', async i => {
	        if (i.user.id == message.author.id || !client.admins.includes(i.user.id)) {
                if(i.customId == "accept"){
                    noblox.shout(client.config.roblox_group, args.all).catch(e => {
                        return message.reply({embeds: [client.functions.error("Error occured while posting shout.")]})
                    })
                client.functions.log(client, {embeds: [client.functions.embed("Group Shout Changed", `The group shout was set to "${args.all}". Shout changed by ${message.author.tag} (${message.author.id})`)]})
                i.message.edit({embeds: [client.functions.success(`Group shout was set to "${args.all}".`)], components: []}) 
                } else {
                await i.message.edit({embeds: [client.functions.embed("Confirmation", `Group shout change canceled.`)], components: []})
                }
                done = true
	        } else {
	        	i.reply({ embeds: [client.functions.error("You can't click this.")], ephemeral: true });
    	}
            });
        collector.on("end", async collected => {
            if(done == false){
          await  msg.edit({embeds: [client.functions.error("Confirmation Period Ran Out.")], components: []})
            }
        })
    }
}