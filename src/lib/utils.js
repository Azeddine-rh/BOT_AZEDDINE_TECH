function isGroup(jid) {
  return (jid || '').endsWith('@g.us');
}

function pickText(message) {
  return (
    message?.conversation ||
    message?.extendedTextMessage?.text ||
    message?.imageMessage?.caption ||
    message?.videoMessage?.caption ||
    ""
  );
}

async function safeSendText(sock, chatId, text, quotedMsg = null, mentions = []) {
  return sock.sendMessage(
    chatId,
    { text, mentions },
    quotedMsg ? { quoted: quotedMsg } : {}
  );
}

module.exports = { isGroup, pickText, safeSendText };
