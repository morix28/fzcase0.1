import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CaseCard from '../components/CaseCard';
import CaseModal from '../components/CaseModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { casesData, Case } from '../data/cases';

const Market: React.FC = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки
    const timer = setTimeout(() => {
      setCases(casesData);
      setFilteredCases(casesData);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCaseClick = (caseItem: Case) => {
    setSelectedCase(caseItem);
  };

  const handleOpenCase = () => {
    if (!selectedCase) return;
    // Закрыть модалку и перейти на страницу открытия
    setSelectedCase(null);
    navigate(`/case/${selectedCase.id}`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <h1>Маркет</h1>
      <div className="cases-grid">
        {filteredCases.map(caseItem => (
          <CaseCard
            key={caseItem.id}
            caseData={caseItem}
            onOpen={() => handleCaseClick(caseItem)}
          />
        ))}
      </div>

      <CaseModal
        caseData={selectedCase}
        onClose={() => setSelectedCase(null)}
        onOpen={handleOpenCase}
      />
    </>
  );
};

export default Market;