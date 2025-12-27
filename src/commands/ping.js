module.exports = {
  name: "ping",
  aliases: [],
  run: async ({ sock, chatId, msg }) => {
    await sock.sendMessage(chatId, { text: "🏓 Pong!" }, { quoted: msg });
  }
};
