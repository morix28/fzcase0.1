from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from app.config import settings

router = Router()

@router.message(Command("start"))
async def cmd_start(message: Message):
    # Кнопка для открытия Web App
    webapp_url = settings.API_URL  # тот самый URL из туннеля
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🎲 Открыть кейсы", web_app=WebAppInfo(url=webapp_url))]
    ])
    await message.answer(
        "Добро пожаловать в FazerCases! Нажимай кнопку, чтобы открывать кейсы.",
        reply_markup=keyboard
    )