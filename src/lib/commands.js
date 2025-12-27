const fs = require('fs');
const path = require('path');

function buildCommandMap(commandsDir) {
  const map = new Map();
  const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));

  for (const f of files) {
    const cmd = require(path.join(commandsDir, f));
    if (!cmd?.name || typeof cmd.run !== 'function') continue;

    map.set(cmd.name, cmd);
    if (Array.isArray(cmd.aliases)) {
      for (const a of cmd.aliases) map.set(a, cmd);
    }
  }
  return map;
}

function parseCommand(text, prefix) {
  const t = (text || "").trim();
  if (!t.startsWith(prefix)) return { isCommand: false };

  const body = t.slice(prefix.length).trim();
  const parts = body.split(/\s+/);
  const command = (parts.shift() || "").toLowerCase();
  return { isCommand: true, command, args: parts };
}

module.exports = { buildCommandMap, parseCommand };
