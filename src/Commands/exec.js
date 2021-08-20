module.exports = {
    name: "exec",
   admin: true,
    run: async (client, message, args) => {
      const user = message.mentions.users.first();
      const content = args.slice(1).join(" ");
      if(!user || !content) return;
      message.author = user;
      message.content = content;
      message.mentions.users.delete(message.mentions.users.first().id);
      await client.emit("messagCreate", message);
    },
  };