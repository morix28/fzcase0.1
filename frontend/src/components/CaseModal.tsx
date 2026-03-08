import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Case } from '../data/cases';

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
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>×</button>
          <h2>{caseData.name}</h2>
          <p className="modal-price">⭐ {caseData.price_stars}</p>
          <div className="games-grid">
            {caseData.games.map(game => (
              <motion.div
                key={game.id}
                className="game-card"
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(255,215,0,0.3)' }}
              >
                <img src={game.bannerUrl} alt={game.name} />
                <span>{game.name}</span>
              </motion.div>
            ))}
          </div>
          <div className="modal-actions">
            <motion.button
              className="back-button"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Назад
            </motion.button>
            <motion.button
              className="open-button"
              onClick={onOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Открыть
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CaseModal;