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
        y: -10,
        scale: 1.03,
        rotateY: 5,
        rotateX: 5,
        boxShadow: '0 20px 40px rgba(255,215,0,0.5), 0 0 30px rgba(255,215,0,0.6)',
        borderColor: 'rgba(255,215,0,0.8)',
        transition: { type: 'spring', stiffness: 400, damping: 15 }
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="card-glow" />
      <img src={caseData.image_url} alt={caseData.name} />
      <h3>{caseData.name}</h3>
      {caseData.genre && <span className="game-tag">{caseData.genre}</span>}
      <motion.div 
        className="price"
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,215,0,0.3)' }}
      >
        <span className="price-icon">⭐</span>
        <span>{caseData.price_stars}</span>
      </motion.div>
    </motion.div>
  );
};

export default CaseCard;