import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { casesData } from '../data/cases';          // проверьте путь (возможно, './data/cases')
import { Game } from '../data/games';                // нужен импорт типа Game
import OpeningAnimation from '../components/OpeningAnimation';

const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();       // правильный синтаксис
  const navigate = useNavigate();
  const caseItem = casesData.find((c) => c.id === Number(id));
  const [opening, setOpening] = useState(false);
  const [result, setResult] = useState<{ gameName: string; key: string } | null>(null);  // типизация

  if (!caseItem) return <div>Кейс не найден</div>;

  const startOpening = () => setOpening(true);

  const handleAnimationComplete = (res: { game: Game; key: string }) => {
    setResult({
      gameName: res.game.name,
      key: res.key,
    });
    setOpening(false);
  };

  if (result) {
    return (
      <div className="case-result">
        <h1>🎉 Вы выиграли!</h1>
        <h2>{result.gameName}</h2>
        <div className="key-display">{result.key}</div>
        <button onClick={() => navigate('/market')}>В маркет</button>
      </div>
    );
  }

  return (
    <div className="case-detail">
      <AnimatePresence mode="wait">
        {opening ? (
          <OpeningAnimation caseData={caseItem} onComplete={handleAnimationComplete} />
        ) : (
          <motion.div
            key="info"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="case-info"
          >
            <h1>{caseItem.name}</h1>
            <p className="price">Цена: ⭐ {caseItem.price_stars}</p>
            <button onClick={startOpening} className="open-button">Открыть кейс</button>
            <button onClick={() => navigate('/market')} className="back-button">Назад</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CaseDetail;