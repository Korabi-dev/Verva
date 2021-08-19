const discord = require("discord.js")
module.exports = {
    name: "messageCreate",
    /**
     * 
     * @param {discord.Message} message 
     * @param {discord.Client} client 
     * @param {discord.Guild} guild
     */
    run: async(message, client) => {
    if(message.channel.partial) message.channel.fetch();
    if(message.author.bot) return;
    const prefix = client.config.client_prefix
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
    if(command) return;
    if(message.channel.type == "DM"){
        const data = await client.functions.thread_get({user: message.author.id})
        var datetime = new Date().toString()
            const guild = await client.guild()
        if(data){
            const channel = guild.channels.cache.get(data.channel)
            if(channel){
            channel.send({embeds: [client.functions.embed(`${message.author.username}:`, `${message.content}`)]})
            data.messages.push(`${message.author.username} | ${datetime}: ${message.content}`)
            await data.save()
            } else{
              await message.reply({embeds: [client.functions.error("Thread channel was deleted, therefor this thread is now closed. Please dm me again if you need any more help.")]})
             await client.functions.thread_delete(client, {user: message.author.id}, client.user.tag)
            }
        }else {
            const newd = await client.functions.thread_create(client, {user: message.author.id, tag: message.author.username, _tag: message.author.tag})
                    await newd.save()
                const channel = guild.channels.cache.get(newd.channel)
                channel.send({embeds: [client.functions.embed(`${message.author.username}:`, `${message.content}`)]})
            newd.messages.push(`${message.author.username} | ${datetime}: ${message.content}`)
            await newd.save()
            message.reply({embeds: [client.functions.success("You have opened a thread, please wait for staff to reply.")]})
        }
    } 
    if(message.channel.type == "GUILD_TEXT"){
        const data = await client.functions.thread_get({channel: message.channel.id})
        if(data){
            const user = message.guild.members.cache.get(data.user)
            if(!user) return message.reply({embeds: [client.functions.success("This user is no longer in the server, I strongly advise closing this thread.")]})
            let sent = true
            user.send({embeds: [client.functions.embed(`${message.author.username}:`, `${message.content}`)]}).catch(e => {
                sent = false
            })
            if(sent == false) return message.reply({embeds: [client.functions.success("Dm failed to send, I strongly advise closing this thread.")]})
            data.messages.push(`${message.author.username} | ${datetime}: ${message.content}`)
            }
    }
    }
}