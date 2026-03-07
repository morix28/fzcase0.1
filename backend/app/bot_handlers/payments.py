from aiogram import Router, types
from aiogram.filters import Command
from aiogram.types import LabeledPrice, PreCheckoutQuery, Message
from app.config import settings

router = Router()

@router.message(Command("buy"))
async def buy_stars(message: Message):
    # Предлагаем купить, например, 100 звёзд
    prices = [LabeledPrice(label="100 Stars", amount=100)]   # amount = количество звёзд
    await message.bot.send_invoice(
        chat_id=message.chat.id,
        title="Покупка звёзд",
        description="Купите звёзды для открытия кейсов",
        payload="buy_100_stars",
        provider_token=settings.PROVIDER_TOKEN,   # для Stars можно оставить пустым или не передавать
        currency="XTR",
        prices=prices,
        start_parameter="buy_stars"
    )

@router.pre_checkout_query()
async def pre_checkout_handler(query: PreCheckoutQuery):
    await query.bot.answer_pre_checkout_query(query.id, ok=True)

@router.message()
async def successful_payment_handler(message: Message):
    if message.successful_payment:
        amount = message.successful_payment.total_amount
        # Начисляем звёзды пользователю в БД (по telegram_id)
        # ...
        await message.answer(f"✅ Вы купили {amount} звёзд! Баланс обновлён.")