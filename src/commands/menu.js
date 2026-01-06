const fs = require("fs");
const path = require("path");

module.exports = {
  name: "menu",
  aliases: ["help", "الأوامر"],
  ownerOnly: false,
  groupOnly: false,

  run: async ({ sock, chatId, msg, prefix }) => {
    const menu =
`╭─ BOT_AZEDDINE_TECH
│
│ ${prefix}menu  — القائمة
│ ${prefix}ping  — اختبار
│ ${prefix}info  — معلومات
│
│ ${prefix}dl <رابط>  — تحميل (انستا/فيس/تيك/يوتيوب* حسب المصدر)
│ ${prefix}mediafire <رابط> — تحميل Mediafire
│ ${prefix}tr <نص> — ترجمة للعربية (أو: ${prefix}tr en|ar نص)
│ ${prefix}wiki <كلمة> — بحث ويكيبيديا
│ ${prefix}ayah <رقم السورة>|<رقم الآية> — مثال: ${prefix}ayah 2|255
│
│ ${prefix}ai <سؤال> — ذكاء اصطناعي (Gemini)
│ ${prefix}solve — حل امتحان من صورة (رد على صورة)
│
╰──────────────`;

    const imagePath = path.join(__dirname, "../../assets/menu.jpg");

    try {
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(
          chatId,
          { image: fs.readFileSync(imagePath), caption: menu },
          { quoted: msg }
        );
      } else {
        await sock.sendMessage(chatId, { text: menu }, { quoted: msg });
      }
    } catch {
      await sock.sendMessage(chatId, { text: menu }, { quoted: msg });
    }
  }
};
