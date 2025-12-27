module.exports = {
  PREFIX: ".",
  // اكتب أرقام المالك بدون + وبدون مسافات (مثال: "2126xxxxxxx")
  OWNERS: (process.env.OWNERS || "").split(",").map(x => x.trim()).filter(Boolean),

  // Pairing Code
  AUTO_PAIR: (process.env.AUTO_PAIR || "true") === "true",
  // رقم الواتساب بدون + (مثال: 2126xxxxxxx)
  PAIR_NUMBER: process.env.PAIR_NUMBER || "",

  // Anti-spam
  COOLDOWN_MS: Number(process.env.COOLDOWN_MS || 1500)
};
