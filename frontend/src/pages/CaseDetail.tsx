import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { casesData } from '../data/cases';
import { Game } from '../data/games';
import OpeningAnimation from '../components/OpeningAnimation';

const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const caseItem = casesData.find((c) => c.id === Number(id));
  const [opening, setOpening] = useState(false);
  const [result, setResult] = useState<{ game: Game; key: string } | null>(null);

  if (!caseItem) return <div>Кейс не найден</div>;

  const startOpening = () => setOpening(true);

  const handleComplete = (res: { game: Game; key: string }) => {
    setResult(res);
    setOpening(false);
  };

  if (result) {
    return (
      <motion.div
        className="case-result"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>🎉 Вы выиграли!</h1>
        <h2>{result.game.name}</h2>
        <img src={result.game.bannerUrl} alt={result.game.name} style={{ width: '200px', borderRadius: '10px' }} />
        <div className="key-display">{result.key}</div>
        <p className="key-note">Ключ активируйте в Steam</p>
        <button onClick={() => navigate('/market')} className="back-button">В маркет</button>
      </motion.div>
    );
  }

  return (
    <div className="case-detail">
      <AnimatePresence mode="wait">
        {opening ? (
          <motion.div
            key="animation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%' }}
          >
            <OpeningAnimation caseData={caseItem} onComplete={handleComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="info"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
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