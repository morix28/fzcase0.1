import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';

const DailyRewards: React.FC = () => {
  const { stars, rewardsHistory, lastRewardDate, claimDailyReward } = useUser();

  // Определяем, получена ли награда сегодня
  const today = new Date().toISOString().split('T')[0];
  const isClaimedToday = lastRewardDate === today;

  // Генерируем массив из 30 дней (текущий месяц или просто последние 30 дней)
  const days = useMemo(() => {
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = todayDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = dateStr < today;
      const isToday = dateStr === today;
      const isClaimed = rewardsHistory.includes(dateStr);
      return { day, dateStr, isPast, isToday, isClaimed };
    });
  }, [rewardsHistory, today]);

  const handleClaim = () => {
    if (isClaimedToday) return;
    const result = claimDailyReward();
    if (result.success) {
      // можно показать уведомление
      alert(`+${result.reward} ⭐`);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="daily-rewards">
      <h2>Ежедневные награды</h2>
      <div className="calendar-grid">
        {days.map((dayInfo) => (
          <motion.div
            key={dayInfo.dateStr}
            className={`calendar-day ${dayInfo.isClaimed ? 'claimed' : ''} ${dayInfo.isToday ? 'today' : ''} ${dayInfo.isPast && !dayInfo.isClaimed ? 'missed' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={dayInfo.isToday && !isClaimedToday ? handleClaim : undefined}
          >
            <span className="day-number">{dayInfo.day}</span>
            {dayInfo.isClaimed && <span className="check">✅</span>}
            {dayInfo.isToday && !isClaimedToday && <span className="available">⭐</span>}
          </motion.div>
        ))}
      </div>
      <button
        className="claim-button"
        onClick={handleClaim}
        disabled={isClaimedToday}
      >
        {isClaimedToday ? 'Уже получено' : 'Забрать награду'}
      </button>
    </div>
  );
};

export default DailyRewards;