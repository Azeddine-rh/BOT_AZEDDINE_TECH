const axios = require("axios");

module.exports = {
  name: "dl",
  aliases: ["تحميل"],
  ownerOnly: false,
  groupOnly: false,

  run: async ({ sock, chatId, msg, args }) => {
    const url = args[0];
    if (!url) {
      return sock.sendMessage(
        chatId,
        { text: "❌ أرسل رابط تحميل.\nمثال:\n.dl رابط" },
        { quoted: msg }
      );
    }

    await sock.sendMessage(chatId, { text: "⏳ جارِ التحميل..." }, { quoted: msg });

    const apis = [
      `https://api.ryzendesu.vip/api/downloader?url=${encodeURIComponent(url)}`,
      `https://api.akuari.my.id/downloader?link=${encodeURIComponent(url)}`
    ];

    for (const api of apis) {
      try {
        const res = await axios.get(api, { timeout: 20000 });
        const video =
          res.data?.data?.video ||
          res.data?.result?.video ||
          res.data?.video;

        if (video) {
          return sock.sendMessage(
            chatId,
            { video: { url: video }, caption: "✅ تم التحميل" },
            { quoted: msg }
          );
        }
      } catch {}
    }

    await sock.sendMessage(
      chatId,
      { text: "❌ فشل التحميل، الرابط غير مدعوم أو خاص." },
      { quoted: msg }
    );
  }
};
