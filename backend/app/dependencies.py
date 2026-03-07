from fastapi import Request, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.auth import validate_init_data
from app.models import User
import json

async def get_current_user(request: Request, db: AsyncSession = Depends(get_db)) -> User:
    init_data = request.headers.get("Authorization")
    if not init_data or not validate_init_data(init_data):
        raise HTTPException(status_code=401, detail="Invalid init data")
    
    parsed = parse_qs(init_data)
    user_data = parsed.get('user', [None])[0]
    if not user_data:
        raise HTTPException(status_code=401, detail="No user data")
    
    user_info = json.loads(user_data)
    telegram_id = user_info['id']
    
    result = await db.execute(select(User).where(User.telegram_id == telegram_id))
    user = result.scalar_one_or_none()
    if not user:
        # Автоматическая регистрация
        user = User(
            telegram_id=telegram_id,
            username=user_info.get('username'),
            first_name=user_info.get('first_name', ''),
            referral_code=generate_unique_referral_code()   # функция из utils
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user