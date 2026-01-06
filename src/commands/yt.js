const ytdl = require("ytdl-core");

module.exports = {
  name: "yt",
  aliases: ["youtube"],
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

    await sock.sendMessage(chatId, { text: "⏳ جارِ التحميل..." }, { quoted: msg });

    await sock.sendMessage(
      chatId,
      {
        video: { url },
        caption: "✅ فيديو يوتيوب"
      },
      { quoted: msg }
    );
  }
};
