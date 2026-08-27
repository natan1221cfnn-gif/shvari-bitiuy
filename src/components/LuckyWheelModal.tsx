import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useSound } from '../hooks/useSound';
import { useHaptic } from '../hooks/useHaptic';

interface פרסגלגל {
  שם: string;
  סמל: string;
  מטבעות?: number;
  סוג: 'מטבעות' | 'לב' | 'קומבו' | 'סקין';
  צבע: string;
}

const פרסים: פרסגלגל[] = [
  { שם: '25 מטבעות', סמל: '🪙', מטבעות: 25, סוג: 'מטבעות', צבע: '#f59e0b' },
  { שם: 'לב נוסף', סמל: '❤️', סוג: 'לב', צבע: '#ef4444' },
  { שם: '50 מטבעות', סמל: '💰', מטבעות: 50, סוג: 'מטבעות', צבע: '#8b5cf6' },
  { שם: 'בוסטר קומבו', סמל: '🔥', סוג: 'קומבו', צבע: '#f97316' },
  { שם: '100 מטבעות', סמל: '💎', מטבעות: 100, סוג: 'מטבעות', צבע: '#06b6d4' },
  { שם: 'סקין זהב', סמל: '🥇', סוג: 'סקין', צבע: '#eab308' },
  { שם: '30 מטבעות', סמל: '🪙', מטבעות: 30, סוג: 'מטבעות', צבע: '#10b981' },
  { שם: '200 מטבעות', סמל: '👑', מטבעות: 200, סוג: 'מטבעות', צבע: '#ec4899' },
];

export function LuckyWheelModal() {
  const {
    מטבעות,
    גלגלסובבלאחרונה,
    שנהמסך,
    סקיניםפתוחים,
  } = useGameStore();

  const { נגןרמהחדשה, נגןתקתוק } = useSound();
  const { רטטקומבו } = useHaptic();

  const [מסתובב, setמסתובב] = useState(false);
  const [סיבובזוית, setסיבובזוית] = useState(0);
  const [פרסזכיה, setפרסזכיה] = useState<פרסגלגל | null>(null);

  // בדוק אם זכאי לסיבוב יומי בחינם (עברו 20 שעות)
  const עכשיו = Date.now();
  const שעותשעברו = (עכשיו - גלגלסובבלאחרונה) / (1000 * 60 * 60);
  const סיבובחינם = שעותשעברו >= 20;

  const סובבגלגל = () => {
    if (מסתובב) return;
    if (!סיבובחינם && מטבעות < 30) return;

    if (!סיבובחינם) {
      const מטבעותחדש = מטבעות - 30;
      localStorage.setItem('שברי-ביטוי-מטבעות', String(מטבעותחדש));
      useGameStore.setState({ מטבעות: מטבעותחדש });
    }

    setמסתובב(true);
    setפרסזכיה(null);

    const אינדקספרס = Math.floor(Math.random() * פרסים.length);
    const מעלותלפלח = 360 / פרסים.length;
    const סיבוביםנוספים = 5 * 360;
    const זויתסופית = סיבובזוית + סיבוביםנוספים + (360 - אינדקספרס * מעלותלפלח - מעלותלפלח / 2);

    setסיבובזוית(זויתסופית);

    let tickCount = 0;
    const tickInterval = setInterval(() => {
      tickCount++;
      נגןתקתוק();
      if (tickCount > 18) clearInterval(tickInterval);
    }, 180);

    setTimeout(() => {
      clearInterval(tickInterval);
      setמסתובב(false);
      const פרס = פרסים[אינדקספרס];
      setפרסזכיה(פרס);
      נגןרמהחדשה();
      רטטקומבו(4);

      localStorage.setItem('שברי-ביטוי-גלגל', String(Date.now()));
      useGameStore.setState({ גלגלסובבלאחרונה: Date.now() });

      if (פרס.מטבעות) {
        const מטבעותעדכני = useGameStore.getState().מטבעות + פרס.מטבעות;
        localStorage.setItem('שברי-ביטוי-מטבעות', String(מטבעותעדכני));
        useGameStore.setState({ מטבעות: מטבעותעדכני });
      } else if (פרס.סוג === 'סקין' && !סקיניםפתוחים.includes('זהב')) {
        const פתוחיםחדש = [...סקיניםפתוחים, 'זהב' as const];
        localStorage.setItem('שברי-ביטוי-סקינים-פתוחים', JSON.stringify(פתוחיםחדש));
        useGameStore.setState({ סקיניםפתוחים: פתוחיםחדש });
      }
    }, 4000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        direction: 'rtl',
      }}
    >
      {/* שורת כותרת עליונה */}
      <div className="relative z-10 w-full flex items-center justify-between pt-safe-top pt-4 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => שנהמסך('פתיחה')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-lg active:scale-95"
          >
            ✕
          </button>
          <h1 className="text-white font-bold text-2xl" style={{ fontFamily: '"Varela Round"' }}>
            🎡 גלגל המזל היומי
          </h1>
        </div>

        <div className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-400/40 px-3.5 py-1.5 rounded-full text-yellow-300 font-bold text-sm">
          <span>🪙</span>
          <span>{מטבעות}</span>
        </div>
      </div>

      {/* אזור הגלגל */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-2">
        {/* מצביע חץ עליון */}
        <div className="relative z-30 -mb-4 flex flex-col items-center">
          <div className="w-8 h-10 bg-gradient-to-b from-yellow-300 to-amber-500 rounded-md shadow-2xl flex items-center justify-center text-lg border-2 border-white text-purple-950 font-bold">
            ▼
          </div>
        </div>

        {/* גלגל פיזיקלי מונפש */}
        <motion.div
          animate={{ rotate: סיבובזוית }}
          transition={{ duration: 4, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative w-72 h-72 rounded-full border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center"
          style={{
            boxShadow: '0 0 50px rgba(234,179,8,0.5), inset 0 0 20px rgba(0,0,0,0.5)',
          }}
        >
          {/* פלחי הגלגל */}
          {פרסים.map((פרס, i) => {
            const angle = (360 / פרסים.length) * i;
            return (
              <div
                key={i}
                className="absolute w-full h-full"
                style={{
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                <div
                  className="w-full h-1/2 flex flex-col items-center pt-2 text-white font-bold text-xs select-none"
                  style={{
                    backgroundColor: פרס.צבע,
                    clipPath: 'polygon(50% 100%, 15% 0, 85% 0)',
                    fontFamily: '"Varela Round"',
                  }}
                >
                  <span className="text-xl">{פרס.סמל}</span>
                  <span className="mt-0.5 text-[10px] text-white/90 drop-shadow-md">{פרס.שם}</span>
                </div>
              </div>
            );
          })}

          {/* מרכז הגלגל */}
          <div className="absolute z-20 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-200 border-4 border-white shadow-xl flex items-center justify-center font-bold text-purple-950 text-xl">
            🧲
          </div>
        </motion.div>

        {/* הודעת זכייה */}
        <AnimatePresence>
          {פרסזכיה && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="mt-4 p-4 rounded-3xl text-center bg-gradient-to-r from-amber-500 to-yellow-400 text-purple-950 shadow-2xl border-2 border-white z-40 max-w-xs"
              style={{ fontFamily: '"Varela Round"' }}
            >
              <div className="text-4xl mb-1">{פרסזכיה.סמל}</div>
              <div className="text-xl font-bold">זכית ב-{פרסזכיה.שם}! 🎉</div>
              <div className="text-xs mt-1 text-purple-900">הפרס נוסף לחשבונך!</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* כפתור סיבוב תחתון */}
      <div className="relative z-10 w-full px-4 pb-safe-bottom pb-6">
        <button
          onClick={סובבגלגל}
          disabled={מסתובב || (!סיבובחינם && מטבעות < 30)}
          className={`w-full py-4 rounded-3xl font-bold text-xl flex items-center justify-center gap-2 shadow-2xl transition-all ${
            מסתובב
              ? 'bg-white/20 text-white/50 cursor-wait'
              : סיבובחינם
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white active:scale-95 animate-pulse'
              : מטבעות >= 30
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-purple-950 active:scale-95'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
          style={{ fontFamily: '"Varela Round"' }}
        >
          {מסתובב ? (
            'מסתובב... 🌀'
          ) : סיבובחינם ? (
            '🎁 סובב בחינם!'
          ) : (
            <>
              <span>סובב שוב (30 🪙)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
