const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  name: "mediafire",
  aliases: [],
  ownerOnly: false,
  groupOnly: false,

  run: async ({ sock, chatId, msg, args }) => {
    const url = args[0];
    if (!url || !url.includes("mediafire.com")) {
      return sock.sendMessage(
        chatId,
        { text: "❌ أرسل رابط MediaFire صحيح." },
        { quoted: msg }
      );
    }

    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    const link = $("#downloadButton").attr("href");

    if (!link) {
      return sock.sendMessage(chatId, { text: "❌ فشل استخراج الرابط." }, { quoted: msg });
    }

    await sock.sendMessage(
      chatId,
      {
        document: { url: link },
        fileName: "mediafire_file"
      },
      { quoted: msg }
    );
  }
};
