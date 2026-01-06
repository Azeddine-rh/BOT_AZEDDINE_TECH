module.exports = {
  name: "solve",
  aliases: ["exam", "حل"],
  ownerOnly: false,
  groupOnly: false,

  run: async ({ sock, chatId, msg }) => {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const imageMessage = msg.message?.imageMessage || quoted?.imageMessage;

    if (!imageMessage) {
      return sock.sendMessage(
        chatId,
        { text: "❌ أرسل صورة امتحان أو ردّ على صورة بالأمر .solve" },
        { quoted: msg }
      );
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY ||
      "";

    if (!apiKey) {
      return sock.sendMessage(chatId, { text: "❌ ضع GEMINI_API_KEY في Secrets" }, { quoted: msg });
    }

    await sock.sendMessage(chatId, { text: "🧠 جارِ تحليل الصورة وحلّها..." }, { quoted: msg });

    try {
      const buffer = await sock.downloadMediaMessage(
        { message: { imageMessage } },
        "buffer"
      );

      // @google/genai
      const { GoogleGenAI } = require("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const prompt =
        "هذه صورة امتحان. استخرج الأسئلة ثم أجب عنها بدقة وبشكل مرتب.\n" +
        "- إذا كان اختيار متعدد: اكتب الإجابة الصحيحة.\n" +
        "- إذا كانت رياضيات: اكتب الخطوات باختصار.\n" +
        "اكتب بالعربية.";

      const resp = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: buffer.toString("base64"),
                  mimeType: "image/jpeg",
                },
              },
            ],
          },
        ],
      });

      const text = resp?.text || resp?.candidates?.[0]?.content?.parts?.map(p => p.text).filter(Boolean).join("\n");
      if (!text) throw new Error("NO_TEXT");

      await sock.sendMessage(chatId, { text: text.trim() }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(
        chatId,
        { text: "❌ فشل تحليل الصورة. تأكد أن @google/genai مثبت وأن المفتاح صحيح." },
        { quoted: msg }
      );
    }
  }
};
