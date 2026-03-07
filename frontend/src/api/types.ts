// Типы данных для API
export interface User {
  id: number;
  telegram_id: number;
  username?: string;
  balance_stars: number;
}

export interface Case {
  id: number;
  name: string;
  price_stars: number;
  image_url: string;
}