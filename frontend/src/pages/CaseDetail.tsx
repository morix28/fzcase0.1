import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { casesData } from '../data/cases';
import OpeningAnimation from '../components/OpeningAnimation';

const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const caseItem = casesData.find(c => c.id === Number(id));

  const [opening, setOpening] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (!caseItem) {
    return <div>Кейс не найден</div>;
  }

  const startOpening = () => {
    setOpening(true);
  };

  const handleAnimationComplete = (key: string) => {
    setResult(key);
    setOpening(false);
  };

  return (
    <div className="case-detail">
      <AnimatePresence mode="wait">
        {opening ? (
          <OpeningAnimation caseData={caseItem} onComplete={handleAnimationComplete} />
        ) : result ? (
          <motion.div
            key="result"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="result-box"
          >
            <h2>🎉 Ваш ключ</h2>
            <div className="key-display">{result}</div>
            <p className="key-note">Ключ можно активировать в Steam</p>
            <button onClick={() => setResult(null)} className="back-button">Закрыть</button>
          </motion.div>
        ) : (
          <motion.div
            key="info"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="case-info"
          >
            <h1>{caseItem.name}</h1>
            <p className="price">Цена: ⭐ {caseItem.price_stars}</p>
            <button onClick={startOpening} className="open-button">Открыть кейс</button>
            <button onClick={() => navigate('/market')} className="back-button">Назад в маркет</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CaseDetail;