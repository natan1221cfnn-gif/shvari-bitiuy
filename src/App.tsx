import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { טעןשיאיםמהענן, שלחשיאלענן } from './data/cloudLeaderboard';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { LoseScreen } from './components/LoseScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { InstructionsScreen } from './components/InstructionsScreen';
import { ShopScreen } from './components/ShopScreen';
import { LuckyWheelModal } from './components/LuckyWheelModal';
import { DuelScreen } from './components/DuelScreen';

import { IsraelMapScreen } from './components/IsraelMapScreen';
import { CityBattlesScreen } from './components/CityBattlesScreen';
import { AdminScreen } from './components/AdminScreen';

const מעברדף = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.03 },
  transition: { duration: 0.25, ease: 'easeInOut' },
};

export function App() {
  const { מסךפעיל, שנהמסך, שיאאישי, שיאים, שםשחקן, הגדרות } = useGameStore();
  const [urlRoomId, setUrlRoomId] = useState<string | null>(null);

  // בדיקת קישור כניסה לחדר דו-קרב (למשל: ?room=4821)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    if (room) {
      setUrlRoomId(room);
      שנהמסך('דו-קרב');
    }
  }, [שנהמסך]);

  // סנכרון אוטומטי דו-כיווני של שיאי ענן
  useEffect(() => {
    // 1. טעינת שיאים מהענן ועדכון מקומי אם השם תואם לשיא ענן
    טעןשיאיםמהענן().then((scores) => {
      const myCloud = scores.find((s) => s.שם === שםשחקן);
      if (myCloud && myCloud.ניקוד > שיאאישי) {
        localStorage.setItem('שברי-ביטוי-שיא', String(myCloud.ניקוד));
        const מעודכן = [myCloud, ...שיאים.filter((s) => s.ניקוד !== myCloud.ניקוד)];
        localStorage.setItem('שברי-ביטוי-שיאים', JSON.stringify(מעודכן));
        useGameStore.setState({
          שיאאישי: myCloud.ניקוד,
          שיאים: מעודכן,
        });
      }
    });

    // 2. שליחת שיא מקומי חדש לענן אם קיים
    if (שיאאישי > 0) {
      const השיאהטובביותר = שיאים[0] || {
        שם: שםשחקן,
        ניקוד: שיאאישי,
        תאריך: new Date().toLocaleDateString('he-IL'),
        רמה: הגדרות.רמה,
        שלב: 1,
        מצב: 'רגיל' as const,
      };
      שלחשיאלענן(השיאהטובביותר);
    }
  }, [שיאאישי, שיאים, שםשחקן, הגדרות.רמה]);

  return (
    <div style={{ direction: 'rtl', fontFamily: '"Varela Round", sans-serif' }}>
      <AnimatePresence mode="wait">
        {מסךפעיל === 'פתיחה' && (
          <motion.div key="פתיחה" {...מעברדף}>
            <StartScreen />
          </motion.div>
        )}
        {מסךפעיל === 'משחק' && (
          <motion.div key="משחק" {...מעברדף}>
            <GameScreen />
          </motion.div>
        )}
        {מסךפעיל === 'הפסד' && (
          <motion.div key="הפסד" {...מעברדף}>
            <LoseScreen />
          </motion.div>
        )}
        {מסךפעיל === 'הגדרות' && (
          <motion.div key="הגדרות" {...מעברדף}>
            <SettingsScreen />
          </motion.div>
        )}
        {מסךפעיל === 'שיאים' && (
          <motion.div key="שיאים" {...מעברדף}>
            <LeaderboardScreen />
          </motion.div>
        )}
        {מסךפעיל === 'הוראות' && (
          <motion.div key="הוראות" {...מעברדף}>
            <InstructionsScreen />
          </motion.div>
        )}
        {מסךפעיל === 'חנות' && (
          <motion.div key="חנות" {...מעברדף}>
            <ShopScreen />
          </motion.div>
        )}
        {מסךפעיל === 'גלגל' && (
          <motion.div key="גלגל" {...מעברדף}>
            <LuckyWheelModal />
          </motion.div>
        )}
        {מסךפעיל === 'דו-קרב' && (
          <motion.div key="דו-קרב" {...מעברדף}>
            <DuelScreen initialRoomId={urlRoomId} />
          </motion.div>
        )}
        {מסךפעיל === 'מפה' && (
          <motion.div key="מפה" {...מעברדף}>
            <IsraelMapScreen />
          </motion.div>
        )}
        {מסךפעיל === 'מלחמת-ערים' && (
          <motion.div key="מלחמת-ערים" {...מעברדף}>
            <CityBattlesScreen />
          </motion.div>
        )}
        {מסךפעיל === 'ניהול' && (
          <motion.div key="ניהול" {...מעברדף}>
            <AdminScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
