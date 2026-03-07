import { gamesData, Game } from './games';

export interface Case {
  id: number;
  name: string;
  price_stars: number;
  image_url: string;
  category: string;
  genre: string;
  games: Game[];
}

// Вспомогательная функция для получения 15 случайных игр по фильтру
const getGamesByFilter = (filter: (game: Game) => boolean, count: number = 15): Game[] => {
  const filtered = gamesData.filter(game => game.price_rub > 0 && filter(game)); // исключаем бесплатные
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const casesData: Case[] = [
  // Инди-кейс (только инди, цена до 500 ₽)
  {
    id: 1,
    name: 'Инди-хиты',
    price_stars: 50,
    image_url: '/images/cases/indie.png',
    category: 'indie',
    genre: 'Инди',
    games: getGamesByFilter(game => game.genre === 'indie' && game.price_rub <= 500)
  },

  // Шутер-кейс (только шутеры, без стратегий/RPG)
  {
    id: 2,
    name: 'Оружейный арсенал',
    price_stars: 80,
    image_url: '/images/cases/shooter.png',
    category: 'shooter',
    genre: 'Шутер',
    games: getGamesByFilter(game => game.genre === 'shooter' && game.price_rub > 0)
  },

  // RPG-кейс (только RPG)
  {
    id: 3,
    name: 'Ролевые игры',
    price_stars: 120,
    image_url: '/images/cases/rpg.png',
    category: 'rpg',
    genre: 'RPG',
    games: getGamesByFilter(game => game.genre === 'rpg' && game.price_rub > 0)
  },

  // Хоррор-кейс
  {
    id: 4,
    name: 'Страх и трепет',
    price_stars: 90,
    image_url: '/images/cases/horror.png',
    category: 'horror',
    genre: 'Хоррор',
    games: getGamesByFilter(game => game.genre === 'horror')
  },

  // Стратегии
  {
    id: 5,
    name: 'Великие полководцы',
    price_stars: 100,
    image_url: '/images/cases/strategy.png',
    category: 'strategy',
    genre: 'Стратегия',
    games: getGamesByFilter(game => game.genre === 'strategy')
  },

  // Приключения
  {
    id: 6,
    name: 'Захватывающие приключения',
    price_stars: 95,
    image_url: '/images/cases/adventure.png',
    category: 'adventure',
    genre: 'Приключения',
    games: getGamesByFilter(game => game.genre === 'adventure')
  },

  // Симуляторы
  {
    id: 7,
    name: 'Жизнь в симуляции',
    price_stars: 85,
    image_url: '/images/cases/simulator.png',
    category: 'simulator',
    genre: 'Симулятор',
    games: getGamesByFilter(game => game.genre === 'simulator')
  },

  // Спорт
  {
    id: 8,
    name: 'Спортивные достижения',
    price_stars: 70,
    image_url: '/images/cases/sport.png',
    category: 'sport',
    genre: 'Спорт',
    games: getGamesByFilter(game => game.genre === 'sport')
  },

  // Инди-премиум (подороже)
  {
    id: 9,
    name: 'Инди-шедевры',
    price_stars: 110,
    image_url: '/images/cases/indie_premium.png',
    category: 'indie',
    genre: 'Инди',
    games: getGamesByFilter(game => game.genre === 'indie' && game.price_rub > 500)
  },

  // Шутеры-премиум (дорогие)
  {
    id: 10,
    name: 'Элитные шутеры',
    price_stars: 150,
    image_url: '/images/cases/shooter_premium.png',
    category: 'shooter',
    genre: 'Шутер',
    games: getGamesByFilter(game => game.genre === 'shooter' && game.price_rub > 1000)
  },

  // Экшен
  {
    id: 11,
    name: 'Динамичный экшен',
    price_stars: 90,
    image_url: '/images/cases/action.png',
    category: 'action',
    genre: 'Экшен',
    games: getGamesByFilter(game => game.genre === 'shooter' || game.genre === 'adventure') // приблизительно
  },

  // Выживание
  {
    id: 12,
    name: 'Выживание любой ценой',
    price_stars: 100,
    image_url: '/images/cases/survival.png',
    category: 'survival',
    genre: 'Выживание',
    games: getGamesByFilter(game => game.genre === 'survival')
  },

  // Азиатские RPG (дорогие)
  {
    id: 13,
    name: 'Азиатский колорит',
    price_stars: 200,
    image_url: '/images/cases/asian.png',
    category: 'rpg',
    genre: 'JRPG',
    games: getGamesByFilter(game => game.price_rub > 3000 && (game.genre === 'rpg' || game.name.includes('Dragon') || game.name.includes('Nioh')))
  },

  // Классика
  {
    id: 14,
    name: 'Золотая классика',
    price_stars: 60,
    image_url: '/images/cases/classic.png',
    category: 'classic',
    genre: 'Классика',
    games: getGamesByFilter(game => game.price_rub < 500 && game.genre !== 'indie')
  },

  // Сборное ассорти (микс жанров, но без дорогих)
  {
    id: 15,
    name: 'Всякое разное',
    price_stars: 75,
    image_url: '/images/cases/mix.png',
    category: 'mix',
    genre: 'Микс',
    games: getGamesByFilter(game => game.price_rub < 800, 15)
  }
];