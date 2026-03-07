import React from 'react';
import { motion } from 'framer-motion';
import { Case } from '../data/cases';

interface CaseCardProps {
  caseData: Case;
  onOpen: () => void;
}

const CaseCard: React.FC<CaseCardProps> = ({ caseData, onOpen }) => {
  return (
    <motion.div
      className="case-card"
      onClick={onOpen}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
        boxShadow: '0 20px 40px rgba(255,215,0,0.3), 0 0 30px rgba(255,215,0,0.5)',
        borderColor: '#ffd700',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <motion.div
        className="card-glow"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <img src={caseData.image_url} alt={caseData.name} />
      <h3>{caseData.name}</h3>
      <motion.p
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,215,0,0.3)' }}
      >
        ⭐ {caseData.price_stars}
      </motion.p>
{caseData.genre && (
  <span className="game-tag">{caseData.genre}</span>
)}
    </motion.div>
  );
};

export default CaseCard;