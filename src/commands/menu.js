const fs = require('fs');
const path = require('path');

module.exports = {
  name: "menu",
  aliases: ["help"],
  ownerOnly: false,
  groupOnly: false,

  run: async ({ sock, chatId, msg, prefix }) => {
    const menu =
`╭─ BOT_AZEDDINE_TECH
│
│ ${prefix}ping
│ ${prefix}info
│ ${prefix}welcome on/off  (مجموعات)
│ ${prefix}owner  (معلومة)
│
╰──────────────`;

    // مسار الصورة
    const imagePath = path.join(__dirname, '../../assets/menu.jpg');

    // إذا كانت الصورة موجودة
    if (fs.existsSync(imagePath)) {
      await sock.sendMessage(
        chatId,
        {
          image: fs.readFileSync(imagePath),
          caption: menu
        },
        { quoted: msg }
      );
    } else {
      // احتياط: إذا لم توجد الصورة
      await sock.sendMessage(
        chatId,
        { text: menu },
        { quoted: msg }
      );
    }
  }
};
