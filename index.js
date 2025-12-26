const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");
const readline = require("readline");

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve =>
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  if (!state.creds.registered) {
    const phone = await ask("📱 أدخل رقمك مع رمز الدولة (مثال 2126xxxxxxx): ");
    const code = await sock.requestPairingCode(phone);
    console.log("🔑 كود الربط:", code);
    console.log("➡️ واتساب > الأجهزة المرتبطة > ربط جهاز > الربط برمز");
  }

  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") {
      console.log("✅ تم ربط البوت بنجاح");
    }
    if (connection === "close") {
      console.log("❌ انقطع الاتصال");
    }
  });
}

startBot();
