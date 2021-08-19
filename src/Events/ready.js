const discord = require("discord.js")
module.exports = {
    name: "ready",
    /**
     * 
     * @param {discord.Client} client 
     * 
     */
    run: async(client) => {
      await  client.user.setPresence({activities: [{type:"LISTENING", name: "To Korabi's singing, send help."}], status: "online"})
    }
}