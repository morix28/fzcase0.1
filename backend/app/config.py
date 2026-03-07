import os
from pydantic_settings import BaseSettings
from pydantic import field_validator
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    BOT_TOKEN: str = os.getenv("BOT_TOKEN", "")
    API_URL: str = os.getenv("API_URL", "http://localhost:8000")
    ADMIN_IDS: list[int] = []  # Значение по умолчанию - пустой список
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey")

    # Валидатор, который преобразует строку из .env в список
    @field_validator("ADMIN_IDS", mode="before")
    @classmethod
    def parse_admin_ids(cls, value):
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            # Разделяем по запятой, удаляем пробелы, преобразуем в int
            return [int(id.strip()) for id in value.split(",") if id.strip()]
        if isinstance(value, int):
            # Если пришло одно число, превращаем его в список с одним элементом
            return [value]
        # Если ничего не подошло, возвращаем пустой список
        return []

# Создаём экземпляр настроек
settings = Settings()

# Отладка (выполнится после валидации)
print("⚙️ Загруженные настройки:")
print(f"   BOT_TOKEN: {settings.BOT_TOKEN[:5]}... (скрыто)")
print(f"   API_URL: {settings.API_URL}")
print(f"   ADMIN_IDS: {settings.ADMIN_IDS} (тип: {type(settings.ADMIN_IDS)})")
print(f"   DATABASE_URL: {settings.DATABASE_URL}")