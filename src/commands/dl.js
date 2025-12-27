const fetch = require('node-fetch');

module.exports = {
  name: "dl",
  aliases: ["download"],
  ownerOnly: false,
  groupOnly: false,

  run: async ({ sock, chatId, msg, args }) => {
    if (!args[0]) {
      return sock.sendMessage(
        chatId,
        { text: "❌ أرسل رابط تحميل\nمثال:\n.dl https://www.instagram.com/reel/xxxx" },
        { quoted: msg }
      );
    }

    const url = args[0];

    await sock.sendMessage(
      chatId,
      { text: "⏳ جارِ التحميل من أفضل مصدر متاح..." },
      { quoted: msg }
    );

    // 🧠 قائمة APIs الاحتياطية (بالترتيب)
    const apis = [
      // API 1 (شامل)
      (u) => `https://api.ryzendesu.vip/api/downloader?url=${encodeURIComponent(u)}`,

      // API 2 (بديل)
      (u) => `https://api.lolhuman.xyz/api/socialmedia?url=${encodeURIComponent(u)}&apikey=demo`,

      // API 3 (احتياطي أخير)
      (u) => `https://api.akuari.my.id/downloader?link=${encodeURIComponent(u)}`
    ];

    let lastError = null;

    for (let i = 0; i < apis.length; i++) {
      try {
        const res = await fetch(apis[i](url), { timeout: 20000 });
        const json = await res.json();

        // 🟢 محاولة استخراج فيديو
        const videoUrl =
          json?.data?.video ||
          json?.result?.video ||
          json?.video ||
          json?.url;

        if (videoUrl) {
          await sock.sendMessage(
            chatId,
            {
              video: { url: videoUrl },
              caption: "✅ تم التحميل بنجاح"
            },
            { quoted: msg }
          );
          return;
        }

        // 🟢 محاولة استخراج صور
        const images =
          json?.data?.images ||
          json?.result?.images ||
          json?.images;

        if (Array.isArray(images) && images.length > 0) {
          for (const img of images) {
            await sock.sendMessage(
              chatId,
              {
                image: { url: img },
                caption: "✅ تم التحميل بنجاح"
              },
              { quoted: msg }
            );
          }
          return;
        }

        throw "تنسيق غير مدعوم";

      } catch (err) {
        lastError = err;
        console.log(`❌ API ${i + 1} فشل`);
      }
    }

    // ❌ إذا فشلت كل APIs
    await sock.sendMessage(
      chatId,
      {
        text: "❌ فشل التحميل من جميع المصادر\nحاول لاحقًا أو تأكد من الرابط"
      },
      { quoted: msg }
    );
  }
};
