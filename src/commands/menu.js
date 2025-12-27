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
│ ${prefix}ig <link>  تحميل إنستغرام
│ ${prefix}welcome on/off  (مجموعات)
│ ${prefix}owner  (معلومة)
│
╰──────────────`;

    const imagePath = path.join(__dirname, '../../assets/menu.jpg');

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
      await sock.sendMessage(
        chatId,
        { text: menu },
        { quoted: msg }
      );
    }
  }
};
