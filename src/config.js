module.exports = {
  PREFIX: ".",

  // ⭐ ضع الرقم في Secrets (لن يظهر في GitHub)
  OWNERS: (process.env.OWNERS || "")
    .split(",")
    .map(x => x.trim())
    .filter(Boolean),

  // Pairing Code
  AUTO_PAIR: true,

  // ⭐ ضع رقم الربط في Secrets
  PAIR_NUMBER: process.env.PAIR_NUMBER || "",

  // Anti-spam
  COOLDOWN_MS: 1500
};
