module.exports = {
  name: "dl",
  aliases: ["download", "تحميل"],
  ownerOnly: false,
  groupOnly: false,

  run: async ({ sock, chatId, msg, args }) => {
    const url = (args && args[0]) ? args[0].trim() : "";
    if (!url) {
      return sock.sendMessage(
        chatId,
        { text: "❌ أرسل رابط.\nمثال:\n.dl https://www.instagram.com/reel/xxxx" },
        { quoted: msg }
      );
    }

    await sock.sendMessage(chatId, { text: "⏳ جارِ التحميل... (مصادر احتياطية)" }, { quoted: msg });

    // مصادر احتياطية (قد تعمل/تفشل حسب الرابط وحماية المنصة)
    // ملاحظة: نحن لا نستخدم node-fetch. Node 18 لديه fetch مدمج.
    const sources = [
      // Scrappy API (IG/FB/TikTok في الغالب)
      {
        name: "scrappy-instagram",
        match: (u) => /instagram\.com/i.test(u),
        build: (u) => `https://fantox001-scrappy-api.vercel.app/instadl?url=${encodeURIComponent(u)}`,
        pick: (j) => j?.videoUrl || j?.result?.video || j?.data?.video
      },
      {
        name: "scrappy-facebook",
        match: (u) => /(facebook\.com|fb\.watch)/i.test(u),
        build: (u) => `https://fantox001-scrappy-api.vercel.app/fbdl?url=${encodeURIComponent(u)}`,
        pick: (j) => j?.videoUrl || j?.result?.video || j?.data?.video
      },

      // Ryzen downloader (شامل)
      {
        name: "ryzen",
        match: (_u) => true,
        build: (u) => `https://api.ryzendesu.vip/api/downloader?url=${encodeURIComponent(u)}`,
        pick: (j) => j?.data?.video || j?.data?.url || j?.result?.video || j?.video || j?.url
      },

      // Vreden (يستخدمه البعض للـ IG)
      {
        name: "vreden-ig",
        match: (u) => /instagram\.com/i.test(u),
        build: (u) => `https://api.vreden.my.id/api/igdl?url=${encodeURIComponent(u)}`,
        pick: (j) => j?.result?.video
      },

      // Akuari (احتياطي)
      {
        name: "akuari",
        match: (_u) => true,
        build: (u) => `https://api.akuari.my.id/downloader?link=${encodeURIComponent(u)}`,
        pick: (j) => j?.respon?.[0]?.url || j?.url || j?.video
      }
    ];

    const tryOne = async (src) => {
      const controller = AbortSignal.timeout(20000);
      const res = await fetch(src.build(url), { signal: controller });
      const json = await res.json().catch(() => null);

      if (!json) return null;

      // فيديو
      const videoUrl = src.pick(json);
      if (videoUrl && typeof videoUrl === "string") {
        return { kind: "video", url: videoUrl, source: src.name };
      }

      // صور
      const images = json?.data?.images || json?.result?.images || json?.images || json?.result?.[0]?.images;
      if (Array.isArray(images) && images.length) {
        return { kind: "images", urls: images, source: src.name };
      }

      return null;
    };

    let lastFail = "";
    for (const src of sources) {
      if (!src.match(url)) continue;
      try {
        const out = await tryOne(src);
        if (!out) throw new Error("NO_MEDIA");

        if (out.kind === "video") {
          await sock.sendMessage(
            chatId,
            { video: { url: out.url }, caption: `✅ تم التحميل\nالمصدر: ${out.source}` },
            { quoted: msg }
          );
          return;
        }

        if (out.kind === "images") {
          for (const u of out.urls.slice(0, 10)) {
            await sock.sendMessage(chatId, { image: { url: u }, caption: `✅ تم التحميل\nالمصدر: ${out.source}` }, { quoted: msg });
          }
          return;
        }
      } catch (e) {
        lastFail = `${src.name}`;
        // ننتقل للمصدر التالي
      }
    }

    await sock.sendMessage(
      chatId,
      { text: `❌ فشل التحميل.\nقد يكون الرابط محمي/خاص.\nآخر مصدر جُرّب: ${lastFail || "غير معروف"}` },
      { quoted: msg }
    );
  }
};
