import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

export function useTelegram() {
  const [webApp, setWebApp] = useState<any>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      setWebApp(tg);
    }
  }, []);

  return {
    webApp,
    user: webApp?.initDataUnsafe?.user,
    initData: webApp?.initData,
    close: () => webApp?.close(),
    showAlert: (msg: string) => webApp?.showAlert(msg),
  };
}