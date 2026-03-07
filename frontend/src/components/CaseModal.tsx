import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Case } from '../data/cases';
import GameCard from './GameCard';

interface CaseModalProps {
  caseData: Case | null;
  onClose: () => void;
  onOpen: () => void;
}

const CaseModal: React.FC<CaseModalProps> = ({ caseData, onClose, onOpen }) => {
  if (!caseData) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>×</button>
          <h2>{caseData.name}</h2>
          <p className="modal-price">Цена: ⭐ {caseData.price_stars}</p>
          
          <div className="games-grid">
            {caseData.games.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          <div className="modal-actions">
            <button className="back-button" onClick={onClose}>Назад</button>
            <button className="open-button" onClick={onOpen}>Открыть за ⭐ {caseData.price_stars}</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CaseModal;