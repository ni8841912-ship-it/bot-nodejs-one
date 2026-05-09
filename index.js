require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const sqlite3 = require('sqlite3').verbose();

// 🤖 BOT
const bot = new Telegraf(process.env.BOT_TOKEN);

// 📌 Service link (click button opens this)
const SERVICE_LINK = "https://t.me/Oun_TaTa11/168";

// 🗄️ DB
const db = new sqlite3.Database('./bot.db');

// CREATE TABLE
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id TEXT UNIQUE,
  username TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// SAVE USER
function saveUser(ctx) {
  if (!ctx.from) return;

  db.run(
    "INSERT OR IGNORE INTO users (telegram_id, username) VALUES (?, ?)",
    [ctx.from.id, ctx.from.username || "no_username"]
  );
}

// 🎛️ MENU
function menu(ctx) {
  ctx.reply(
    "👋 យើងប្តេជ្ញាក្នុងការផ្តល់នូវផលិតផលហ្គេមកំសាន្តដ៏ល្អបំផុត ជាមួយនឹងសេវាកម្មអតិថិជនដែលល្អឥតខ្ចោះ ផ្តល់ជូនដោយបុគ្គលិកផ្នែកបំរើអតិថិជនរបស់ក្រុមហ៊ុនដែលមានវិជ្ជាជីវៈគ្រប់ពេល 24/7 ។",
    Markup.inlineKeyboard([
      // ✅ OPEN TELEGRAM LINK BUTTON
      [Markup.button.url("🛎️ ទំនាក់ទំនងបើកអាខោន", SERVICE_LINK)],

      // 📊 BOT ACTION BUTTON
      [Markup.button.callback("📊 ចំនួនអ្នកប្រើ", "STATS")],

      // ℹ️ INFO BUTTON
      [Markup.button.callback("ℹ️ ទំនាក់ទំនង និង សេវាកម្ម 24 ម៉ោង", "INFO")]
    ])
  );
}

// 🚀 START
bot.start((ctx) => {
  saveUser(ctx);
  menu(ctx);
});

// 📊 STATS BUTTON
bot.action("STATS", (ctx) => {
  db.get("SELECT COUNT(*) as total FROM users", (err, row) => {
    if (err) return ctx.reply("❌ Error database");
    ctx.reply(`📊 Total Users: ${row.total}`);
  });
});

// ℹ️ INFO BUTTON
bot.action("INFO", (ctx) => {
  ctx.reply(
    "ℹ️ ទំនាក់ទំនង និង សេវាកម្ម 24 ម៉ោង\n\n" +
    "✔ 24/7 Service\n" +
    SERVICE_LINK
  );
});

// 💬 CHAT AUTO REPLY
bot.on("text", (ctx) => {
  const text = ctx.message.text.toLowerCase();

  if (text.includes("hello")) {
    return ctx.reply("👋 Hello! Press /start");
  }

  if (text.includes("service")) {
    return ctx.reply("🛎️ Click button in menu 👉 /start");
  }

  ctx.reply("🤖 Use /start to open menu");
});

// ▶️ START BOT
bot.launch();

console.log("🤖 Customer bot running...");