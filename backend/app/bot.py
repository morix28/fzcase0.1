import asyncio
from aiogram import Bot, Dispatcher
from app.config import settings

# Импортируем роутеры (их мы создадим позже)
from app.bot_handlers.start import router as start_router
# from app.bot_handlers.payments import router as payments_router
# from app.bot_handlers.admin import router as admin_router

bot = Bot(token=settings.BOT_TOKEN)
dp = Dispatcher()

# Подключаем роутеры
dp.include_router(start_router)
# dp.include_router(payments_router)
# dp.include_router(admin_router)

async def start_bot():
    """Запускает бота в режиме поллинга"""
    print("Бот запущен и готов к работе!")
    await dp.start_polling(bot)