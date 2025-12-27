module.exports = {
  name: "welcome",
  aliases: [],
  groupOnly: true,
  run: async ({ sock, chatId, msg, args, db, save, isOwner }) => {
    // نخليه للمالك فقط لتجنب العبث
    if (!isOwner) {
      return sock.sendMessage(chatId, { text: "⛔ هذا الأمر للمالك فقط." }, { quoted: msg });
    }

    const v = (args[0] || "").toLowerCase();
    if (v !== "on" && v !== "off") {
      return sock.sendMessage(chatId, { text: "استعمال: welcome on/off" }, { quoted: msg });
    }
    db.group.welcome = v === "on";
    save();
    await sock.sendMessage(chatId, { text: `✅ الترحيب: ${db.group.welcome ? "ON" : "OFF"}` }, { quoted: msg });
  }
};
