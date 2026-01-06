module.exports = {
  name: "ayah",
  aliases: ["aya", "آية"],
  ownerOnly: false,
  groupOnly: false,

  run: async ({ sock, chatId, msg, args }) => {
    const raw = (args && args[0]) ? args[0].trim() : "";
    if (!raw || !raw.includes("|")) {
      return sock.sendMessage(
        chatId,
        { text: "❌ اكتب بهذا الشكل:\n.ayah 2|255\n(السورة|الآية)" },
        { quoted: msg }
      );
    }

    const [surah, ayah] = raw.split("|").map(x => (x || "").trim());
    if (!surah || !ayah) {
      return sock.sendMessage(chatId, { text: "❌ صيغة غير صحيحة." }, { quoted: msg });
    }

    await sock.sendMessage(chatId, { text: "⏳ جارِ جلب الآية..." }, { quoted: msg });

    try {
      const api = `https://api.alquran.cloud/v1/ayah/${encodeURIComponent(surah)}:${encodeURIComponent(ayah)}/ar.alafasy`;
      const res = await fetch(api, { signal: AbortSignal.timeout(15000) });
      const j = await res.json();

      const text = j?.data?.text;
      const surahName = j?.data?.surah?.name;
      const numberInSurah = j?.data?.numberInSurah;

      if (!text) throw new Error("NO_AYAH");

      await sock.sendMessage(
        chatId,
        { text: `﴿${text}﴾\n\n— ${surahName || ""} (${numberInSurah || ayah})` },
        { quoted: msg }
      );
    } catch {
      await sock.sendMessage(chatId, { text: "❌ لم أستطع جلب الآية." }, { quoted: msg });
    }
  }
};
