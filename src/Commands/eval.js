const discord = require("discord.js");
const { inspect } = require("util");
module.exports = {
    name: "eval",
    admin: true,    
    /**
     * 
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     * @param {String[]} args 
     * @param {String} evaled
     */
    run: async(client, message, args) => {
        if(!args[0]) return message.reply({embeds: [client.functions.error("You need to provide code for evaluation.")]})
        var evaled;
        var msg = await message.reply({embeds: [client.functions.embed("Evaluating...", "The provided code is being processed.")]})
        try{
            const start =  process.hrtime()
            evaled = eval(args.all)
            if (evaled instanceof Promise) {
                evaled = await evaled;
              }
              const stop = process.hrtime(start)
              const type = typeof evaled
              evaled = inspect(evaled)
              evaled = evaled.replace(client.config.client_token, "***********************************************************").replace(client.config.client_mongo, "*************************************************************")
              if(evaled.length > 3850){
                const attachement = new discord.MessageAttachment(Buffer.from(evaled), "Evaled.js")
                 await msg.edit({embeds: [], files: [attachement], content: `Evaluation took ${stop}s, the output is too long to be in an embed so its in the file below.`})
                 return;
              } else {
             await msg.edit({embeds: [client.functions.success(`**Evaluation Output:**\n\`\`\`js\n${evaled}\n\`\`\`\n\n**Evaluation Time:**\n\`${stop}s\`\n\n**Evaluation Output Type:**\n\`[${type[0].toUpperCase() + type.slice(1)}]\``)]})
              }
        } catch (e) {
            async function err (){
                await msg.edit({content: "\u200b", embeds: [client.functions.error(`The provided code was faulty, Error:\n\n\`\`\`js\n${require("util").inspect(e)}\n\`\`\``)]})
            }
            err()
        }
    }
}