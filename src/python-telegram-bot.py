from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Updater, CommandHandler, CallbackContext

WEB_APP_URL = "https://ramadan-app-smoky.vercel.app/"  # HTTPS bilan React app URL

def start(update: Update, context: CallbackContext):
    keyboard = [
        [InlineKeyboardButton("Ilovani ochish", web_app=WebAppInfo(url=WEB_APP_URL))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    update.message.reply_text("Assalomu aleykum! Ilovani ochish uchun tugmani bosing:", reply_markup=reply_markup)

updater = Updater("YOUR_BOT_TOKEN", use_context=True)
updater.dispatcher.add_handler(CommandHandler("start", start))
updater.start_polling()
updater.idle()