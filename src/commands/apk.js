const axios = require("axios");

module.exports = {
  name: "apk",
  aliases: [],
  ownerOnly: false,
  groupOnly: false,

  run: async ({ sock, chatId, msg, args }) => {
    const query = args.join(" ");
    if (!query) {
      return sock.sendMessage(
        chatId,
        { text: "❌ اكتب اسم التطبيق.\nمثال:\n.apk whatsapp" },
        { quoted: msg }
      );
    }

    const api = `https://api.akuari.my.id/search/apk?q=${encodeURIComponent(query)}`;

    try {
      const res = await axios.get(api);
      const app = res.data?.result?.[0];
      if (!app) throw "NO_APP";

      await sock.sendMessage(
        chatId,
        {
          document: { url: app.url },
          fileName: app.title + ".apk"
        },
        { quoted: msg }
      );
    } catch {
      await sock.sendMessage(chatId, { text: "❌ لم يتم العثور على التطبيق." }, { quoted: msg });
    }
  }
};
