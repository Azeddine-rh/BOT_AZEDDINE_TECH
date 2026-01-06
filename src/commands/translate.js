module.exports = {
  name: "tr",
  aliases: ["translate", "ترجمة"],
  ownerOnly: false,
  groupOnly: false,

  run: async ({ sock, chatId, msg, args }) => {
    const text = (args || []).join(" ").trim();
    if (!text) {
      return sock.sendMessage(
        chatId,
        { text: "❌ اكتب النص.\nمثال:\n.tr hello\nأو:\n.tr en|ar hello" },
        { quoted: msg }
      );
    }

    // صيغة اختيارية: en|ar نص...
    let from = "auto";
    let to = "ar";
    let realText = text;

    const first = (args[0] || "").trim();
    if (first.includes("|")) {
      const parts = first.split("|");
      if (parts[0]) from = parts[0];
      if (parts[1]) to = parts[1];
      realText = (args.slice(1) || []).join(" ").trim();
    }

    if (!realText) {
      return sock.sendMessage(chatId, { text: "❌ اكتب النص بعد اللغات." }, { quoted: msg });
    }

    await sock.sendMessage(chatId, { text: "⏳ جارِ الترجمة..." }, { quoted: msg });

    // LibreTranslate (قد يحدّ الطلبات أحيانًا)
    const body = {
      q: realText,
      source: from === "auto" ? "auto" : from,
      target: to,
      format: "text"
    };

    try {
      const res = await fetch("https://libretranslate.de/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(20000)
      });
      const json = await res.json();
      const out = json?.translatedText;

      if (!out) throw new Error("NO_TRANSLATION");

      await sock.sendMessage(chatId, { text: `✅ الترجمة:\n${out}` }, { quoted: msg });
    } catch {
      await sock.sendMessage(chatId, { text: "❌ فشلت الترجمة (قد يكون السيرفر مزدحم). جرّب لاحقًا." }, { quoted: msg });
    }
  }
};
