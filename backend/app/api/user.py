from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.dependencies import get_current_user
from app.models import User, Case, Key, Opening, Transaction
from app.utils.keygen import generate_random_key
import random
from datetime import datetime

router = APIRouter(prefix="/user", tags=["user"])

@router.post("/cases/{case_id}/open")
async def open_case(case_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    # Получаем кейс
    case = await db.get(Case, case_id)
    if not case or not case.is_active:
        raise HTTPException(404, "Case not found")
    
    if user.balance_stars < case.price_stars:
        raise HTTPException(400, "Insufficient stars")
    
    # Рандом: реальный ключ или генерация
    drop_real = random.random() < (case.drop_rate_real / 100.0)
    key_obj = None
    final_key = None

    if drop_real:
        # Ищем неиспользованный ключ для этого кейса
        result = await db.execute(
            select(Key).where(Key.case_id == case_id, Key.is_used == False)
        )
        key_obj = result.scalar_one_or_none()
        if key_obj:
            key_obj.is_used = True
            key_obj.used_by_user_id = user.id
            key_obj.used_at = datetime.utcnow()
            final_key = key_obj.key_value
            case.total_real_drops += 1
        else:
            drop_real = False   # реальных ключей нет – генерируем
    
    if not drop_real:
        final_key = generate_random_key()
    
    # Списание звёзд
    user.balance_stars -= case.price_stars
    transaction = Transaction(
        user_id=user.id,
        amount_stars=-case.price_stars,
        type='case_open',
        description=f"Opened {case.name}"
    )
    db.add(transaction)
    
    # Запись открытия
    opening = Opening(
        user_id=user.id,
        case_id=case.id,
        key_id=key_obj.id if key_obj else None,
        generated_key=final_key if not key_obj else None,
        stars_spent=case.price_stars
    )
    db.add(opening)
    
    case.total_openings += 1
    await db.commit()
    
    return {
        "success": True,
        "key": final_key,
        "is_real": drop_real,
        "new_balance": user.balance_stars
    }