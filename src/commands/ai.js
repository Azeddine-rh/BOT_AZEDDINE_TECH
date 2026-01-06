module.exports = {
  name: "ai",
  aliases: ["eva", "gemini", "ذكاء"],
  ownerOnly: false,
  groupOnly: false,

  run: async ({ sock, chatId, msg, args }) => {
    const question = (args || []).join(" ").trim();
    if (!question) {
      return sock.sendMessage(chatId, { text: "❌ اكتب سؤالك.\nمثال:\n.ai ما هو البلوكشين؟" }, { quoted: msg });
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY ||
      "";

    if (!apiKey) {
      return sock.sendMessage(
        chatId,
        { text: "❌ ضع مفتاح Gemini في Secrets: GEMINI_API_KEY" },
        { quoted: msg }
      );
    }

    await sock.sendMessage(chatId, { text: "🧠 أفكر..." }, { quoted: msg });

    // نحاول @google/genai أولًا، وإذا لم يوجد نستخدم @google/generative-ai
    try {
      // @google/genai
      const { GoogleGenAI } = require("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const resp = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: question }] }],
      });

      const text = resp?.text || resp?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("NO_TEXT");

      await sock.sendMessage(chatId, { text: text.trim() }, { quoted: msg });
      return;
    } catch (_) {
      // fallback to @google/generative-ai (إذا كنت مثبتها)
    }

    try {
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContent(question);
      const text = result?.response?.text?.() || "";
      if (!text) throw new Error("NO_TEXT_2");

      await sock.sendMessage(chatId, { text: text.trim() }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(
        chatId,
        { text: "❌ فشل أمر الذكاء الاصطناعي.\nتأكد من المفتاح ومن المكتبة (@google/genai أو @google/generative-ai)." },
        { quoted: msg }
      );
    }
  }
};
