module.exports = {
  name: "wiki",
  aliases: ["wikipedia", "ويكي"],
  ownerOnly: false,
  groupOnly: false,

  run: async ({ sock, chatId, msg, args }) => {
    const q = (args || []).join(" ").trim();
    if (!q) {
      return sock.sendMessage(chatId, { text: "❌ اكتب كلمة للبحث.\nمثال:\n.wiki المغرب" }, { quoted: msg });
    }

    await sock.sendMessage(chatId, { text: "⏳ جارِ البحث..." }, { quoted: msg });

    try {
      const api = `https://ar.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`;
      const res = await fetch(api, { signal: AbortSignal.timeout(15000) });
      const j = await res.json();

      if (!j || j?.type === "https://mediawiki.org/wiki/HyperSwitch/errors/not_found") {
        return sock.sendMessage(chatId, { text: "❌ لا توجد نتيجة واضحة. جرّب كلمة أخرى." }, { quoted: msg });
      }

      const title = j.title || q;
      const extract = (j.extract || "").trim();
      const link = j?.content_urls?.desktop?.page || "";

      const out = `📚 *${title}*\n\n${extract || "لا يوجد وصف."}\n\n${link ? "🔗 " + link : ""}`.replace(/\*/g, "");
      await sock.sendMessage(chatId, { text: out }, { quoted: msg });
    } catch {
      await sock.sendMessage(chatId, { text: "❌ فشل البحث في ويكيبيديا." }, { quoted: msg });
    }
  }
};
