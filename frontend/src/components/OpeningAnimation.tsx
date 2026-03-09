import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import { Case } from '../data/cases';
import { Game } from '../data/games';

interface OpeningAnimationProps {
  caseData: Case;
  onComplete: (result: { game: Game; key: string }) => void;
}

// Определяем редкость на основе цены игры (для цвета свечения)
const getRarityColor = (price: number): string => {
  if (price >= 2000) return '#ffaa00'; // золотой
  if (price >= 1000) return '#ff5500'; // оранжевый
  if (price >= 500) return '#aa00ff';  // фиолетовый
  if (price >= 200) return '#0055ff';  // синий
  return '#ffffff';                     // обычный
};

const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ caseData, onComplete }) => {
  const games = caseData.games;

  // Состояния
  const [phase, setPhase] = useState<'spinning' | 'slowdown' | 'stop' | 'reveal'>('spinning');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(15); // пикселей за кадр
  const itemsRef = useRef<HTMLDivElement>(null);

  // Взвешенная последовательность для прокрутки
  const weightedSequence = useMemo(() => {
    if (!games.length) return [];
    const maxPrice = Math.max(...games.map(g => g.price_rub));
    const weights = games.map(g => Math.pow(maxPrice / (g.price_rub || 1), 2));
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const length = 200;
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
    return seq;
  }, [games]);

  // Выбор выигрышной игры (происходит заранее)
  const winningGame = useMemo(() => {
    if (!games.length) return null;
    const maxPrice = Math.max(...games.map(g => g.price_rub));
    const weights = games.map(g => Math.pow(maxPrice / (g.price_rub || 1), 2));
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const rand = Math.random() * totalWeight;
    let acc = 0;
    for (let i = 0; i < games.length; i++) {
      acc += weights[i];
      if (rand < acc) return games[i];
    }
    return games[0];
  }, [games]);

  // Управление фазами
  useEffect(() => {
    if (phase === 'spinning') {
      const timer = setTimeout(() => setPhase('slowdown'), 3000);
      return () => clearTimeout(timer);
    }
    if (phase === 'slowdown') {
      // Замедление будет в useAnimationFrame
    }
    if (phase === 'stop') {
      setSelectedGame(winningGame);
      const timer = setTimeout(() => setPhase('reveal'), 500);
      return () => clearTimeout(timer);
    }
    if (phase === 'reveal') {
      const key = generateFakeKey();
      // Небольшая задержка перед вызовом onComplete, чтобы анимация показа завершилась
      const timer = setTimeout(() => onComplete({ game: winningGame!, key }), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, winningGame]);

  // Анимация прокрутки с замедлением
  useAnimationFrame(() => {
    if (phase === 'spinning' || phase === 'slowdown') {
      if (phase === 'slowdown') {
        setScrollSpeed(prev => Math.max(0, prev - 0.2)); // плавное замедление
        if (scrollSpeed <= 0.1) {
          setPhase('stop');
        }
      }
      setScrollOffset(prev => (prev + scrollSpeed) % (weightedSequence.length * 120));
    }
  });

  const generateFakeKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment = () => Array(5).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${segment()}-${segment()}-${segment()}-${segment()}-${segment()}`;
  };

  return (
    <div className="opening-animation-container">
      {/* Прокрутка */}
      <div className="spinner-wrapper">
        <div className="spinner-viewport">
          <motion.div
            ref={itemsRef}
            className="spinner-track"
            animate={{ x: -scrollOffset }}
            transition={{ type: 'tween', ease: 'linear', duration: 0.016 }} // синхронизация с requestAnimationFrame
          >
            {weightedSequence.map((game, idx) => (
              <div key={idx} className="spinner-item">
                <img src={game.bannerUrl} alt={game.name} />
                <span>{game.name.slice(0, 10)}…</span>
              </div>
            ))}
          </motion.div>
          <div className="spinner-marker" />
        </div>
      </div>

      {/* Фаза показа результата */}
      {phase === 'reveal' && selectedGame && (
        <motion.div
          className="reveal-container"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', damping: 15 }}
        >
          <motion.div
            className="reveal-glow"
            style={{ background: `radial-gradient(circle, ${getRarityColor(selectedGame.price_rub)} 0%, transparent 70%)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <img src={selectedGame.bannerUrl} alt={selectedGame.name} className="reveal-image" />
          <h2 className="reveal-title">{selectedGame.name}</h2>
        </motion.div>
      )}
    </div>
  );
};

export default OpeningAnimation;