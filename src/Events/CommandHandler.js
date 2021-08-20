const discord = require("discord.js")
module.exports = {
    name: "messageCreate",
    /**
     * 
     * @param {discord.Message} message 
     * @param {String[]} args
     * @param {discord.Client} client
     */
    run: async(message, client) => {
        var canrun = true
        const prefix = client.config.client_prefix
    if(!message.content.startsWith(prefix) || message.author.bot || /[a-zA-Z]/g.test(message.content) == false || message.channel.type == "DM") return;
    if(message.channel.partial) message.channel.fetch()
    const admins = process.env.admins.split(",")
    for(index in admins){
        admins[index] = admins[index].trim()
    }
    client.admins = admins
    message.author.admin = false
    message.member.admin = false
    if(admins.includes(message.author.id)){
        message.author.admin = true
        message.member.admin = false
    }
    if(client.user.id == "750717487196405811" && !message.author.admin) return;
    let [commandName, ...args] = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/);
      commandName = commandName.toLowerCase()
      args.all = message.cleanContent.slice(prefix.length + commandName.length);
      var command =
        client.commands.get(commandName) 
        if(!command){
        command = client.commands.find((cmd) => cmd.aliases?.includes(commandName));
        }
        if(!command) return;
        if(command.admin){
            if(!message.author.admin){
                canrun = false
                return message.reply({embeds: [client.functions.error(`You need to be a bot administrator to use this command.`)]})
            }
        }
        if(command.permissions) {
        for(p of command.permissions){
            if(!message.member.permissions.has(p) && !message.author.admin){
                canrun = false
                let msg = p.split("_")
                for(index in msg){
                    msg[index] = msg[index][0] + msg[index].toLowerCase().slice(1)
                }
                 return message.reply({embeds: [client.functions.error(`You need the \`${msg.join(" ")}\` permission.`)]})
            }
        }    
        }
        if(command.roles){
            for(r of command.roles){
                if(!message.member.roles.cache.get(r) && !message.author.admin){
                    canrun = false
                    return message.reply({embeds: [client.functions.error(`You need the <@&${r}> role.`)]})
                }
            }
        }
        try{
            if(canrun == true){
            await command.run(client, message, args)
            }
        } catch(e) {
            const options = {embeds: [client.functions.embed("Error", `Fatal error encountered.\n\nError:\n\`\`\`js\n${require("util").inspect(e)}\n\`\`\`\n\nCommand: ${command.name}`)]}
            message.reply(options)
            client.functions.log(client, options)
        }
    }
}
