import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Case } from '../data/cases';
import { Game } from '../data/games';

interface OpeningAnimationProps {
  caseData: Case;
  onComplete: (result: { game: Game; key: string }) => void;
}

type AnimationPhase = 'fast' | 'slow' | 'stop' | 'shake' | 'flash' | 'result';

const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ caseData, onComplete }) => {
  const [phase, setPhase] = useState<AnimationPhase>('fast');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Генерация последовательности для прокрутки (с весами)
  const games = caseData.games;
  const totalGames = games.length;

  // Создаем взвешенную последовательность (дорогие игры реже)
  const weightedSequence = useRef<Game[]>([]);
  if (weightedSequence.current.length === 0) {
    const maxPrice = Math.max(...games.map(g => g.price_rub));
    const weights = games.map(g => Math.pow(maxPrice / (g.price_rub || 1), 2));
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const length = 200; // длина последовательности
    const seq: Game[] = [];
    for (let i = 0; i < length; i++) {
      const rand = Math.random() * totalWeight;
      let acc = 0;
      for (let j = 0; j < games.length; j++) {
        acc += weights[j];
        if (rand < acc) {
          seq.push(games[j]);
          break;
        }
      }
    }
    weightedSequence.current = seq;
  }

  // Эффект для управления фазами
  useEffect(() => {
    if (phase === 'fast') {
      // Быстрая прокрутка (20 мс)
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % weightedSequence.current.length);
      }, 20);

      // Через 1.5 сек переходим к замедлению
      const timer = setTimeout(() => setPhase('slow'), 1500);
      return () => clearTimeout(timer);
    }

    if (phase === 'slow') {
      // Замедление: постепенно увеличиваем интервал
      let speed = 30;
      const slowInterval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % weightedSequence.current.length);
        speed += 10;
        if (speed > 150) {
          clearInterval(slowInterval);
          setPhase('stop');
        }
      }, speed);
      return () => clearInterval(slowInterval);
    }

    if (phase === 'stop') {
      // Выбираем случайную игру (выигрыш)
      const randomIndex = Math.floor(Math.random() * games.length);
      setSelectedGame(games[randomIndex]);

      // Небольшая пауза, затем тряска
      const timer = setTimeout(() => setPhase('shake'), 300);
      return () => clearTimeout(timer);
    }

    if (phase === 'shake') {
      // Тряска длится 0.5 сек, затем вспышка
      const timer = setTimeout(() => setPhase('flash'), 500);
      return () => clearTimeout(timer);
    }

    if (phase === 'flash') {
      // Вспышка 0.8 сек, затем результат
      const timer = setTimeout(() => setPhase('result'), 800);
      return () => clearTimeout(timer);
    }

    if (phase === 'result') {
      // Показываем результат и вызываем onComplete
      const key = generateFakeKey(); // позже заменить на реальный ключ
      onComplete({ game: selectedGame!, key });
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, games, onComplete]);

  const generateFakeKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment = () => Array(5).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${segment()}-${segment()}-${segment()}-${segment()}-${segment()}`;
  };

  // Эффекты для тряски и вспышки
  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5, repeat: 0 }
    }
  };

  const flashVariants = {
    flash: {
      opacity: [0, 1, 0],
      transition: { duration: 0.8 }
    }
  };

  return (
    <motion.div
      className="opening-container"
      animate={phase === 'shake' ? 'shake' : undefined}
      variants={shakeVariants}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000', zIndex: 2000 }}
    >
      {phase !== 'result' ? (
        <>
          {/* Прокрутка */}
          <div className="scroll-window">
            <motion.div
              className="scroll-content"
              animate={{ x: -currentIndex * 120 }}
              transition={{ duration: 0.02, ease: 'linear' }}
            >
              {weightedSequence.current.map((game, idx) => (
                <div key={idx} className="scroll-item">
                  <img src={game.bannerUrl} alt={game.name} />
                  <span>{game.name.slice(0, 10)}...</span>
                </div>
              ))}
            </motion.div>
            <div className="scroll-marker" />
          </div>

          {/* Вспышка */}
          {phase === 'flash' && (
            <motion.div
              className="flash-overlay"
              variants={flashVariants}
              animate="flash"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'white',
                zIndex: 10,
                pointerEvents: 'none'
              }}
            />
          )}
        </>
      ) : (
        // Результат
        <motion.div
          className="result-container"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(0,0,0,1) 100%)'
          }}
        >
          <img src={selectedGame?.bannerUrl} alt={selectedGame?.name} style={{ width: '300px', borderRadius: '20px', marginBottom: '20px' }} />
          <h2 style={{ color: '#ffd700', fontSize: '2rem' }}>{selectedGame?.name}</h2>
          <p style={{ fontFamily: 'monospace', fontSize: '1.5rem', background: '#333', padding: '10px', borderRadius: '10px', marginTop: '20px' }}>
            {generateFakeKey()}
          </p>
          <p style={{ marginTop: '20px', color: '#aaa' }}>Ключ активируйте в Steam</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OpeningAnimation;