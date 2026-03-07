import React from 'react';
import { Game } from '../data/games';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <div className="game-card">
      <img src={game.bannerUrl} alt={game.name} className="game-banner" />
      <span className="game-name">{game.name}</span>
    </div>
  );
};

export default GameCard;