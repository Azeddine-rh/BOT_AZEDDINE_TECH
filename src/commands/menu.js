module.exports = {
  name: "menu",
  aliases: ["help"],
  ownerOnly: false,
  groupOnly: false,
  run: async ({ sock, chatId, msg, prefix, isOwner }) => {
    const menu =
`╭─ BOT_AZEDDINE_TECH
│
│ ${prefix}ping
│ ${prefix}info
│ ${prefix}welcome on/off  (مجموعات)
│ ${prefix}owner  (معلومة)
│
╰──────────────`;
    await sock.sendMessage(chatId, { text: menu }, { quoted: msg });
  }
};
