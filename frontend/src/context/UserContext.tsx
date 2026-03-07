import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTelegram } from '../hooks/useTelegram';

// Список Telegram ID администраторов (в реальности будет загружаться с бэкенда или из .env)
const ADMIN_IDS = [123456789, 987654321]; // замените на свои ID

interface UserData {
  stars: number;
  lastRewardDate: string | null;
  rewardsHistory: string[];
}

interface UserContextType {
  user: any;
  initData: string;
  webApp: any;
  stars: number;
  rewardsHistory: string[];
  lastRewardDate: string | null;
  isAdmin: boolean; // флаг для админки
  addStars: (amount: number) => void;
  claimDailyReward: () => { success: boolean; reward?: number; message?: string };
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'fazercases_user_data';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, initData, webApp } = useTelegram();

  // Определяем, является ли пользователь администратором
  const isAdmin = user && ADMIN_IDS.includes(user.id);

  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      stars: 1000,
      lastRewardDate: null,
      rewardsHistory: [],
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }, [userData]);

  const addStars = (amount: number) => {
    setUserData(prev => ({ ...prev, stars: prev.stars + amount }));
  };

  const claimDailyReward = () => {
    const today = new Date().toISOString().split('T')[0];

    if (userData.lastRewardDate === today) {
      return { success: false, message: 'Награда уже получена сегодня' };
    }

    const lastDate = userData.lastRewardDate ? new Date(userData.lastRewardDate) : null;
    const currentDate = new Date(today);
    let streak = 1;

    if (lastDate) {
      const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        streak = userData.rewardsHistory.length + 1;
      } else {
        streak = 1;
      }
    }

    let reward = 50;
    if (streak >= 30) reward = 500;
    else if (streak >= 20) reward = 300;
    else if (streak >= 10) reward = 200;
    else if (streak >= 5) reward = 100;
    else if (streak >= 2) reward = 75;

    setUserData(prev => ({
      ...prev,
      stars: prev.stars + reward,
      lastRewardDate: today,
      rewardsHistory: [...prev.rewardsHistory, today],
    }));

    return { success: true, reward };
  };

  return (
    <UserContext.Provider
      value={{
        user,
        initData,
        webApp,
        stars: userData.stars,
        rewardsHistory: userData.rewardsHistory,
        lastRewardDate: userData.lastRewardDate,
        isAdmin,
        addStars,
        claimDailyReward,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};