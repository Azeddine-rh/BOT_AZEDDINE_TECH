const fetch = require('node-fetch');

module.exports = {
  name: "ig",
  aliases: ["instagram"],
  ownerOnly: false,
  groupOnly: false,

  run: async ({ sock, chatId, msg, args }) => {
    // تحقق من وجود الرابط
    if (!args[0]) {
      return sock.sendMessage(
        chatId,
        {
          text: "❌ أرسل رابط إنستغرام\nمثال:\n.ig https://www.instagram.com/reel/xxxx"
        },
        { quoted: msg }
      );
    }

    const url = args[0];

    // تحقق من صحة الرابط
    if (!url.includes("instagram.com")) {
      return sock.sendMessage(
        chatId,
        { text: "❌ الرابط غير صالح (يجب أن يكون من إنستغرام)" },
        { quoted: msg }
      );
    }

    try {
      // رسالة انتظار
      await sock.sendMessage(
        chatId,
        { text: "⏳ جارِ التحميل من إنستغرام..." },
        { quoted: msg }
      );

      // API مجاني (قد يتوقف أحيانًا)
      const api = `https://api.ryzendesu.vip/api/downloader/ig?url=${encodeURIComponent(url)}`;
      const res = await fetch(api);
      const data = await res.json();

      if (!data || !data.data || data.data.length === 0) {
        throw new Error("No media found");
      }

      // إرسال الصور / الفيديوهات
      for (const media of data.data) {
        if (media.type === "video") {
          await sock.sendMessage(
            chatId,
            {
              video: { url: media.url },
              caption: "✅ تم التحميل من إنستغرام"
            },
            { quoted: msg }
          );
        } else {
          await sock.sendMessage(
            chatId,
            {
              image: { url: media.url },
              caption: "✅ تم التحميل من إنستغرام"
            },
            { quoted: msg }
          );
        }
      }

    } catch (error) {
      console.error(error);
      await sock.sendMessage(
        chatId,
        { text: "❌ حدث خطأ أثناء التحميل، حاول لاحقًا" },
        { quoted: msg }
      );
    }
  }
};
