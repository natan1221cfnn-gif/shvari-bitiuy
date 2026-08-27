import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { MascotMagneti } from './MascotMagneti';
import { קטגוריהסוג, קטגוריותסמל } from '../types';

const קטגוריותרשימה: קטגוריהסוג[] = [
  'הכל',
  'סלנג',
  'יומיומי',
  'פתגמים',
  'שירים',
  'ניבים',
  'אוכל',
  'ספורט',
  'ערים',
  'חיובי',
  'מדיה',
  'טבע',
  'מספרים',
  'משפחה',
  'שאלות',
  'כללי',
];

export function StartScreen() {
  const {
    שנהמסך,
    התחלמשחק,
    הגדרות,
    שנההגדרות,
    קטגוריהנבחרת,
    הגדרקטגוריה,
    מטבעות,
    סקיןפעיל,
    גלגלסובבלאחרונה,
  } = useGameStore();

  const [מראהקטגוריות, setמראהקטגוריות] = useState(false);
  const רמות = ['קל', 'בינוני', 'מטורף'] as const;

  // בדיקת סיבוב יומי חינם
  const שעותשעברו = (Date.now() - גלגלסובבלאחרונה) / (1000 * 60 * 60);
  const סיבובחינם = שעותשעברו >= 20;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-between overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        direction: 'rtl',
      }}
    >
      {/* גלים ברקע */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/5"
            style={{
              width: (i + 1) * 200,
              height: (i + 1) * 200,
              right: '50%',
              top: '25%',
              transform: 'translate(50%, -50%)',
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </div>

      {/* ━━ שורת מטבעות וחנות עליונה ━━ */}
      <div className="relative z-10 w-full px-5 pt-safe-top pt-3 flex items-center justify-between">
        <button
          onClick={() => שנהמסך('חנות')}
          className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-400/40 px-3 py-1 rounded-full text-yellow-300 font-bold text-xs active:scale-95 transition-transform"
        >
          <span>🪙</span>
          <span>{מטבעות}</span>
          <span className="text-white/60 mr-1">🛒 חנות</span>
        </button>

        {/* 🎡 כפתור גלגל המזל עם תגית מתנה */}
        <button
          onClick={() => שנהמסך('גלגל')}
          className="relative flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-300/40 px-3 py-1 rounded-full text-white font-bold text-xs active:scale-95 transition-transform shadow-lg"
        >
          <span>🎡 גלגל המזל</span>
          {סיבובחינם && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-[10px] text-white px-1.5 py-0.2 rounded-full font-bold animate-bounce shadow">
              חינם!
            </span>
          )}
        </button>
      </div>

      {/* חלק עליון: דמות מגנטי + כותרת */}
      <div className="relative z-10 flex flex-col items-center pt-1 pb-1">
        {/* 🐣 מגנטי המנחה - מותאם לסקין הפעיל */}
        <div className="mb-2">
          <MascotMagneti מצב="שמח" סקין={סקיןפעיל} />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bold text-center"
          style={{
            fontFamily: '"Varela Round", sans-serif',
            fontSize: 'clamp(2rem, 9vw, 2.8rem)',
            background: 'linear-gradient(135deg, #f7971e, #ffd200, #fc6767)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            direction: 'rtl',
          }}
        >
          שברי ביטוי
        </motion.h1>

        <p
          className="text-white/60 text-center text-xs mt-0.5"
          style={{ fontFamily: '"Varela Round"' }}
        >
          חבר את הביטויים הישראליים! 🇮🇱
        </p>
      </div>

      {/* בחירת קטגוריה ורמת קושי */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full px-5 flex flex-col gap-2.5"
      >
        {/* בחירת קטגוריה */}
        <button
          onClick={() => setמראהקטגוריות(true)}
          className="w-full py-2.5 px-4 rounded-2xl flex items-center justify-between transition-all active:scale-95"
          style={{
            fontFamily: '"Varela Round"',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <div className="flex items-center gap-2 text-white text-sm">
            <span className="text-lg">{קטגוריותסמל[קטגוריהנבחרת]}</span>
            <span className="font-bold">קטגוריה: {קטגוריהנבחרת}</span>
          </div>
          <span className="text-white/40 text-xs">שנה ⚙️</span>
        </button>

        {/* בחירת רמת קושי */}
        <div>
          <div className="flex gap-2 justify-center">
            {רמות.map((רמה) => (
              <button
                key={רמה}
                onClick={() => שנההגדרות({ רמה })}
                className="flex-1 py-2 rounded-2xl font-bold text-xs transition-all active:scale-95"
                style={{
                  fontFamily: '"Varela Round"',
                  background: הגדרות.רמה === רמה
                    ? 'linear-gradient(135deg, #f7971e, #ffd200)'
                    : 'rgba(255,255,255,0.08)',
                  color: הגדרות.רמה === רמה ? '#333' : 'white',
                  border: הגדרות.רמה === רמה ? 'none' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {רמה === 'קל' ? '😊 קל' : רמה === 'בינוני' ? '🔥 בינוני' : '💀 מטורף'}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* כפתורים ראשיים */}
      <div className="relative z-10 w-full px-5 pb-safe-bottom pb-5 flex flex-col gap-2">
        {/* כפתור שחק רגיל */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => התחלמשחק(קטגוריהנבחרת === 'הכל' ? 'רגיל' : 'קטגוריה')}
          className="w-full py-3.5 rounded-3xl font-bold text-xl text-white relative overflow-hidden shadow-xl"
          style={{
            fontFamily: '"Varela Round"',
            background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 50%, #fc6767 100%)',
            boxShadow: '0 8px 32px rgba(247,151,30,0.5)',
          }}
        >
          🚀 שחק עכשיו!
        </motion.button>

        {/* שורת מצבי משחק: 60 שניות טירוף + אתגר יומי */}
        <div className="flex gap-2">
          {/* ⚡ 60 שניות טירוף */}
          <button
            onClick={() => התחלמשחק('טירוף')}
            className="flex-1 py-2.5 rounded-2xl font-bold text-white flex items-center justify-center gap-1 active:scale-95 transition-transform text-xs shadow-lg"
            style={{
              fontFamily: '"Varela Round"',
              background: 'linear-gradient(135deg, #ff0844, #ffb199)',
            }}
          >
            <span>⚡ 60 שניות טירוף!</span>
          </button>

          {/* 📅 אתגר יומי */}
          <button
            onClick={() => התחלמשחק('יומי')}
            className="flex-1 py-2.5 rounded-2xl font-bold text-white flex items-center justify-center gap-1 active:scale-95 transition-transform text-xs shadow-lg"
            style={{
              fontFamily: '"Varela Round"',
              background: 'linear-gradient(135deg, #11998e, #38ef7d)',
            }}
          >
            <span>📅 אתגר יומי</span>
          </button>
        </div>

        {/* כפתורים משניים */}
        <div className="flex gap-2">
          <button
            onClick={() => שנהמסך('שיאים')}
            className="flex-1 py-2.5 rounded-2xl font-bold text-white text-xs bg-white/10 border border-white/15"
            style={{ fontFamily: '"Varela Round"' }}
          >
            🏆 שיאים
          </button>
          <button
            onClick={() => שנהמסך('הוראות')}
            className="flex-1 py-2.5 rounded-2xl font-bold text-white text-xs bg-white/10 border border-white/15"
            style={{ fontFamily: '"Varela Round"' }}
          >
            📖 הוראות
          </button>
          <button
            onClick={() => שנהמסך('הגדרות')}
            className="flex-1 py-2.5 rounded-2xl font-bold text-white text-xs bg-white/10 border border-white/15"
            style={{ fontFamily: '"Varela Round"' }}
          >
            ⚙️ הגדרות
          </button>
        </div>
      </div>

      {/* Modal בחירת קטגוריות */}
      <AnimatePresence>
        {מראהקטגוריות && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm"
            onClick={() => setמראהקטגוריות(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-slate-900 border-t border-white/20 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
              style={{ direction: 'rtl' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: '"Varela Round"' }}>
                  📂 בחר קטגוריה
                </h2>
                <button
                  onClick={() => setמראהקטגוריות(false)}
                  className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {קטגוריותרשימה.map((ק) => (
                  <button
                    key={ק}
                    onClick={() => {
                      הגדרקטגוריה(ק);
                      setמראהקטגוריות(false);
                    }}
                    className="p-3 rounded-2xl flex items-center gap-2 font-bold text-sm transition-all active:scale-95"
                    style={{
                      fontFamily: '"Varela Round"',
                      background: קטגוריהנבחרת === ק
                        ? 'linear-gradient(135deg, #f7971e, #ffd200)'
                        : 'rgba(255,255,255,0.06)',
                      color: קטגוריהנבחרת === ק ? '#1a0533' : 'white',
                      border: קטגוריהנבחרת === ק ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <span className="text-xl">{קטגוריותסמל[ק]}</span>
                    <span>{ק}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
