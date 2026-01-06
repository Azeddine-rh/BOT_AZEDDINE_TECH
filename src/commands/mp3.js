const ytdl = require("ytdl-core");

module.exports = {
  name: "mp3",
  aliases: [],
  ownerOnly: false,
  groupOnly: false,

  run: async ({ sock, chatId, msg, args }) => {
    const url = args[0];
    if (!url || !ytdl.validateURL(url)) {
      return sock.sendMessage(
        chatId,
        { text: "❌ أرسل رابط يوتيوب صحيح." },
        { quoted: msg }
      );
    }

    await sock.sendMessage(chatId, { text: "⏳ جارِ التحويل إلى mp3..." }, { quoted: msg });

    await sock.sendMessage(
      chatId,
      {
        audio: { url },
        mimetype: "audio/mpeg"
      },
      { quoted: msg }
    );
  }
};
