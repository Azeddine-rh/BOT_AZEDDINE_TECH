module.exports = {
  name: "info",
  aliases: [],
  run: async ({ sock, chatId, msg, db }) => {
    const up = Math.floor((Date.now() - db.stats.startedAt) / 1000);
    await sock.sendMessage(chatId, {
      text: `ℹ️ BOT_AZEDDINE_TECH\n📩 الرسائل: ${db.stats.messages}\n⚙️ الأوامر: ${db.stats.commands}\n⏱️ التشغيل: ${up}s`
    }, { quoted: msg });
  }
};
