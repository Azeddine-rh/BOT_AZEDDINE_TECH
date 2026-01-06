module.exports = {
  name: "ping",
  aliases: ["info"],
  ownerOnly: false,
  groupOnly: false,

  run: async ({ sock, chatId, msg, command }) => {
    if (command === "ping") {
      const start = Date.now();
      const sent = await sock.sendMessage(chatId, { text: "🏓 PONG..." }, { quoted: msg });
      const ms = Date.now() - start;
      await sock.sendMessage(chatId, { text: `✅ السرعة: ${ms}ms` }, { quoted: msg });
      return;
    }

    // info
    const mem = process.memoryUsage();
    const usedMB = Math.round((mem.rss / 1024 / 1024) * 10) / 10;

    await sock.sendMessage(
      chatId,
      { text: `ℹ️ BOT_AZEDDINE_TECH\n- الذاكرة: ~${usedMB} MB\n- Node: ${process.version}` },
      { quoted: msg }
    );
  }
};
