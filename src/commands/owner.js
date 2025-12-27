module.exports = {
  name: "owner",
  aliases: ["creator"],
  run: async ({ sock, chatId, msg, config }) => {
    const owners = config.OWNERS.length ? config.OWNERS.map(x => `@${x}`).join(", ") : "غير محدد";
    await sock.sendMessage(chatId, { text: `👑 المالك: ${owners}`, mentions: config.OWNERS.map(x => x + "@s.whatsapp.net") }, { quoted: msg });
  }
};
