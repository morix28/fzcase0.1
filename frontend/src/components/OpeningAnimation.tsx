import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Case } from '../data/cases';

interface OpeningAnimationProps {
  caseData: Case;
  onComplete: (resultKey: string) => void;
}

const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ caseData, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Генерируем взвешенную последовательность игр для прокрутки
  const weightedItems = useMemo(() => {
    const games = caseData.games;
    if (!games.length) return [];

    // Находим максимальную цену для нормализации
    const maxPrice = Math.max(...games.map(g => g.price_rub));
    
    // Вычисляем веса: дорогие игры получают очень маленький вес
    // Используем квадратичную зависимость для усиления редкости
    const weights = games.map(game => {
      const price = game.price_rub || 1; // защита от деления на ноль
      return Math.pow(maxPrice / price, 2); // квадрат отношения
    });

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    
    // Длина последовательности: чем больше, тем дольше уникальных кадров
    const sequenceLength = 400; // можно настроить
    
    const result: typeof games = [];
    for (let i = 0; i < sequenceLength; i++) {
      const rand = Math.random() * totalWeight;
      let acc = 0;
      for (let j = 0; j < games.length; j++) {
        acc += weights[j];
        if (rand < acc) {
          result.push(games[j]);
          break;
        }
      }
    }
    return result;
  }, [caseData]);

  useEffect(() => {
    if (weightedItems.length === 0) return;

    // Очень быстрая прокрутка (30 мс ≈ 33 fps)
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % weightedItems.length);
    }, 30);

    // Через 2.5 секунды резко останавливаем и выдаём ключ
    const timeout = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Генерация ключа (позже заменится на вызов API)
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const segment = () => Array(5).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
      const fakeKey = `${segment()}-${segment()}-${segment()}-${segment()}-${segment()}`;
      onComplete(fakeKey);
    }, 2500);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeout);
    };
  }, [weightedItems, onComplete]);

  return (
    <motion.div
      className="opening-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="scroll-window">
        <motion.div
          className="scroll-content"
          animate={{ x: -currentIndex * 120 }} // 120px – ширина элемента
          transition={{ duration: 0.03, ease: 'linear' }}
        >
          {weightedItems.map((game, idx) => (
            <div key={idx} className="scroll-item">
              <img src={game.bannerUrl} alt={game.name} />
              <span>{game.name.slice(0, 10)}...</span>
            </div>
          ))}
        </motion.div>
        {/* Золотая линия-маркер по центру */}
        <div className="scroll-marker" />
      </div>
      <div className="opening-glow" />
    </motion.div>
  );
};

export default OpeningAnimation;