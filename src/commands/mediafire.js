const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  name: "mediafire",
  aliases: ["mediafiredl"],
  ownerOnly: false,
  groupOnly: false,

  run: async ({ sock, chatId, msg, args }) => {
    const url = (args && args[0]) ? args[0].trim() : "";
    if (!url || !/mediafire\.com/i.test(url)) {
      return sock.sendMessage(
        chatId,
        { text: "❌ أرسل رابط MediaFire صحيح.\nمثال:\n.mediafire https://www.mediafire.com/file/..." },
        { quoted: msg }
      );
    }

    await sock.sendMessage(chatId, { text: "⏳ جارِ استخراج رابط التحميل..." }, { quoted: msg });

    try {
      const res = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "text/html"
        },
        timeout: 30000
      });

      const $ = cheerio.load(res.data);
      const link = $("a#downloadButton").attr("href");
      const infoText = $("a#downloadButton").text() || "";
      const size = infoText.replace(/Download/i, "").replace(/[()\n]/g, "").trim();

      if (!link) {
        return sock.sendMessage(chatId, { text: "❌ لم أستطع استخراج رابط التحميل (قد يكون محمي)." }, { quoted: msg });
      }

      const fileName = (link.split("/").pop() || "file").split("?")[0];

      // حد بسيط (واتساب/بايليز أحيانًا يرفض الملفات الكبيرة)
      // لو الحجم بالـ MB ونقدر نقرأه:
      const mbMatch = /([\d.]+)\s*MB/i.exec(size);
      if (mbMatch && Number(mbMatch[1]) >= 100) {
        return sock.sendMessage(chatId, { text: `⚠️ الملف كبير (${size}). جرّب ملف أصغر من 100MB.` }, { quoted: msg });
      }

      await sock.sendMessage(
        chatId,
        {
          document: { url: link },
          fileName,
          mimetype: "application/octet-stream",
          caption: `✅ MediaFire\nالاسم: ${fileName}\nالحجم: ${size || "غير معروف"}`
        },
        { quoted: msg }
      );
    } catch (e) {
      await sock.sendMessage(chatId, { text: "❌ فشل التحميل من MediaFire." }, { quoted: msg });
    }
  }
};
