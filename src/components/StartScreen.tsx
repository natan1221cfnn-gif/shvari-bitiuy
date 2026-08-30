import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { MascotMagneti } from './MascotMagneti';
import { קטגוריהסוג, קטגוריותסמל } from '../types';
import { אותחייםומונהמחוברים } from '../data/cloudLeaderboard';

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

const שמותאקראיים = [
  'מלך המגנטים 🧲',
  'אלוף הביטויים 🏆',
  'סברס לוהט 🌵',
  'פלאפל מאסטר 🧆',
  'נינג׳ה ישראלי ⚡',
  'מוח מבריק 💡',
  'כוכב הניבים 🌟',
  'שועל קרבות 🦊',
];

export function StartScreen() {
  const {
    שםשחקן,
    עדכןשםשחקן,
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
  const [מראהעריכתשם, setמראהעריכתשם] = useState(false);
  const [שםקלט, setשםקלט] = useState(שםשחקן);
  const [מחוברים, setמחוברים] = useState(1);

  useEffect(() => {
    let mounted = true;
    const updatePresence = () => {
      אותחייםומונהמחוברים().then((count) => {
        if (mounted) setמחוברים(count);
      });
    };
    updatePresence();
    const interval = setInterval(updatePresence, 20000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const רמות = ['קל', 'בינוני', 'מטורף'] as const;

  // בדיקת סיבוב יומי חינם (20 שעות)
  const שעותשעברו = (Date.now() - גלגלסובבלאחרונה) / (1000 * 60 * 60);
  const סיבובחינם = שעותשעברו >= 20;

  const שמורשם = () => {
    if (שםקלט.trim()) {
      עדכןשםשחקן(שםקלט.trim());
      setמראהעריכתשם(false);
    }
  };

  const צורשםאקראי = () => {
    const רנד = שמותאקראיים[Math.floor(Math.random() * שמותאקראיים.length)];
    setשםקלט(רנד);
  };

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

      {/* ━━ 1. שורת חנות וגלגל המזל העליונה (גודל נורמלי, נקי ונעים בעין) ━━ */}
      <div className="relative z-10 w-full px-4 pt-safe-top pt-3 pb-1 grid grid-cols-2 gap-2.5">
        {/* 🛒 כפתור חנות ומטבעות */}
        <button
          onClick={() => שנהמסך('חנות')}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border border-yellow-400/50 flex items-center justify-between text-yellow-300 font-bold text-xs shadow-md active:scale-95 transition-all"
          style={{ fontFamily: '"Varela Round"' }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🪙</span>
            <span className="text-sm text-yellow-200 font-bold">{מטבעות}</span>
          </div>
          <span className="text-[11px] bg-yellow-400/90 text-purple-950 font-bold px-2 py-0.5 rounded-lg shadow">
            חנות 🛒
          </span>
        </button>

        {/* 🎡 כפתור גלגל המזל */}
        <button
          onClick={() => שנהמסך('גלגל')}
          className="relative w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-300/50 flex items-center justify-center gap-1.5 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
          style={{ fontFamily: '"Varela Round"' }}
        >
          <span className="text-lg">🎡</span>
          <span className="text-xs">גלגל המזל</span>
          {סיבובחינם && (
            <span className="absolute -top-2 -right-1 bg-red-500 text-[10px] text-white px-1.5 py-0.2 rounded-full font-bold animate-bounce shadow-md border border-white/40">
              חינם! 🎁
            </span>
          )}
        </button>
      </div>

      {/* ━━ 2. באנר פרופיל שחקן (Gamer Profile Badge) & מונה מחוברים חי ━━ */}
      <div className="relative z-10 w-full px-4 pt-1 pb-1 flex items-center gap-2">
        <button
          onClick={() => {
            setשםקלט(שםשחקן);
            setמראהעריכתשם(true);
          }}
          className="flex-1 py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-between text-white text-xs font-bold shadow-sm active:scale-98 transition-all min-w-0"
          style={{ fontFamily: '"Varela Round"' }}
        >
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-sm">👤</span>
            <span className="text-white/60 text-[11px]">שחקן:</span>
            <span className="text-yellow-300 font-bold text-xs truncate">{שםשחקן}</span>
          </div>
          <span className="text-cyan-300 bg-cyan-950/50 border border-cyan-400/30 px-2 py-0.5 rounded-md text-[10px] shrink-0">
            ערוך שם ✏️
          </span>
        </button>

        {/* 🟢 מונה שחקנים מחוברים אמיתי בזמן אמת */}
        <div
          className="py-1.5 px-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center gap-1.5 text-emerald-300 text-[11px] font-bold shrink-0 shadow-sm"
          style={{ fontFamily: '"Varela Round"' }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{מחוברים} מחוברים</span>
        </div>
      </div>

      {/* חלק עליון: דמות מגנטי + כותרת */}
      <div className="relative z-10 flex flex-col items-center pt-0 pb-1">
        {/* 🐣 מגנטי המנחה */}
        <div className="mb-1">
          <MascotMagneti מצב="שמח" סקין={סקיןפעיל} />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bold text-center"
          style={{
            fontFamily: '"Varela Round", sans-serif',
            fontSize: 'clamp(1.9rem, 8.5vw, 2.6rem)',
            background: 'linear-gradient(135deg, #f7971e, #ffd200, #fc6767)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            direction: 'rtl',
          }}
        >
          שברי ביטוי
        </motion.h1>

        <p
          className="text-white/60 text-center text-xs"
          style={{ fontFamily: '"Varela Round"' }}
        >
          חבר את הביטויים הישראליים! 🇮🇱
        </p>
      </div>

      {/* בחירת קטגוריה ורמת קושי */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full px-4 flex flex-col gap-2"
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
        <div className="space-y-2">
          <div className="flex gap-2 justify-center">
            {(['קל', 'בינוני', 'מטורף'] as const).map((רמה) => {
              const active = הגדרות.רמה === רמה || (רמה === 'מטורף' && הגדרות.רמה === 'מטורף_x2');
              return (
                <button
                  key={רמה}
                  onClick={() => שנההגדרות({ רמה: רמה === 'מטורף' && הגדרות.רמה === 'מטורף_x2' ? 'מטורף_x2' : רמה })}
                  className="flex-1 py-2 rounded-2xl font-bold text-xs transition-all active:scale-95 shadow-sm"
                  style={{
                    fontFamily: '"Varela Round"',
                    background: active
                      ? 'linear-gradient(135deg, #f7971e, #ffd200)'
                      : 'rgba(255,255,255,0.08)',
                    color: active ? '#1a0533' : 'white',
                    border: active ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {רמה === 'קל' ? '😊 קל' : רמה === 'בינוני' ? '🔥 בינוני' : '💀 מטורף'}
                </button>
              );
            })}
          </div>

          {/* תת-בחירה למצב מטורף: x1 או x2 */}
          {(הגדרות.רמה === 'מטורף' || הגדרות.רמה === 'מטורף_x2') && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 p-1 bg-black/30 rounded-xl border border-red-500/30"
            >
              <button
                onClick={() => שנההגדרות({ רמה: 'מטורף' })}
                className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                  הגדרות.רמה === 'מטורף'
                    ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
                style={{ fontFamily: '"Varela Round"' }}
              >
                💀 מטורף (x1 רגיל)
              </button>
              <button
                onClick={() => שנההגדרות({ רמה: 'מטורף_x2' })}
                className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1 ${
                  הגדרות.רמה === 'מטורף_x2'
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white shadow-lg animate-pulse'
                    : 'text-white/60 hover:text-white'
                }`}
                style={{ fontFamily: '"Varela Round"' }}
              >
                <span>🌪️ פסיכי לגמרי (x2)!</span>
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* כפתורים ראשיים */}
      <div className="relative z-10 w-full px-4 pb-safe-bottom pb-3 flex flex-col gap-2">
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

        {/* שורת מצבי הדגל החדשים: 🗺️ מסע ישראלי + 🏛️ מלחמת הערים */}
        <div className="grid grid-cols-2 gap-2">
          {/* 🗺️ מסע ישראלי */}
          <button
            onClick={() => שנהמסך('מפה')}
            className="py-3 px-2 rounded-2xl font-black text-white flex items-center justify-center gap-1.5 active:scale-95 transition-all text-xs border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.35)]"
            style={{
              fontFamily: '"Varela Round"',
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
            }}
          >
            <span className="text-base">🗺️</span>
            <span>מסע ישראלי</span>
            <span className="text-[9px] bg-yellow-400 text-black px-1.5 py-0.2 rounded-full font-black">
              50 שלבים!
            </span>
          </button>

          {/* 🏛️ מלחמת הערים */}
          <button
            onClick={() => שנהמסך('מלחמת-ערים')}
            className="py-3 px-2 rounded-2xl font-black text-white flex items-center justify-center gap-1.5 active:scale-95 transition-all text-xs border border-fuchsia-400/50 shadow-[0_0_15px_rgba(217,70,239,0.35)]"
            style={{
              fontFamily: '"Varela Round"',
              background: 'linear-gradient(135deg, #d946ef 0%, #ec4899 50%, #f59e0b 100%)',
            }}
          >
            <span className="text-base">🏛️</span>
            <span>מלחמת הערים</span>
            <span className="text-[9px] bg-cyan-400 text-black px-1.5 py-0.2 rounded-full font-black animate-pulse">
              LIVE
            </span>
          </button>
        </div>

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

        {/* ⚔️ כפתור דו-קרב אונליין (1 על 1) */}
        <button
          onClick={() => שנהמסך('דו-קרב')}
          className="w-full py-3 rounded-2xl font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-transform text-sm shadow-xl border border-indigo-400/40"
          style={{
            fontFamily: '"Varela Round"',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)',
          }}
        >
          <span className="text-lg">⚔️</span>
          <span>דו-קרב אונליין (1 על 1)</span>
          <span className="text-[10px] bg-yellow-400 text-purple-950 px-2 py-0.5 rounded-full font-bold">
            חדש! 🔥
          </span>
        </button>

        {/* כפתורים משניים */}
        <div className="flex gap-2">
          <button
            onClick={() => שנהמסך('שיאים')}
            className="flex-1 py-2 rounded-2xl font-bold text-white text-xs bg-white/10 border border-white/15"
            style={{ fontFamily: '"Varela Round"' }}
          >
            🏆 שיאים
          </button>
          <button
            onClick={() => שנהמסך('הוראות')}
            className="flex-1 py-2 rounded-2xl font-bold text-white text-xs bg-white/10 border border-white/15"
            style={{ fontFamily: '"Varela Round"' }}
          >
            📖 הוראות
          </button>
          <button
            onClick={() => שנהמסך('הגדרות')}
            className="flex-1 py-2 rounded-2xl font-bold text-white text-xs bg-white/10 border border-white/15"
            style={{ fontFamily: '"Varela Round"' }}
          >
            ⚙️ הגדרות
          </button>
        </div>
      </div>

      {/* ━━ Modal עריכת שם שחקן ━━ */}
      <AnimatePresence>
        {מראהעריכתשם && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setמראהעריכתשם(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-slate-900 border-2 border-yellow-400/40 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center"
              style={{ direction: 'rtl', fontFamily: '"Varela Round"' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-4xl mb-2">👤</div>
              <h2 className="text-xl font-bold text-white mb-1">פרופיל שחקן</h2>
              <p className="text-white/60 text-xs mb-4">
                השם שלך יופיע בטבלת השיאים הארצית ובאתגרים מול חברים
              </p>

              {/* שדה קלט */}
              <div className="mb-3">
                <input
                  type="text"
                  maxLength={18}
                  value={שםקלט}
                  onChange={(e) => setשםקלט(e.target.value)}
                  placeholder="הקלד את שמך כאן..."
                  className="w-full py-3 px-4 rounded-2xl bg-white/10 border border-white/25 text-white font-bold text-center text-base focus:outline-none focus:border-yellow-400"
                  style={{ fontFamily: '"Varela Round"' }}
                />
              </div>

              {/* כפתור הצעת כינוי מגניב */}
              <button
                type="button"
                onClick={צורשםאקראי}
                className="text-xs text-yellow-300 hover:text-yellow-200 font-bold mb-5 flex items-center justify-center gap-1 w-full"
              >
                <span>🎲 הצע לי כינוי גיימר מגניב!</span>
              </button>

              {/* כפתורי שמירה / ביטול */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={שמורשם}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-purple-950 font-bold text-base shadow-lg active:scale-95"
                >
                  שמור שם ✓
                </button>
                <button
                  type="button"
                  onClick={() => setמראהעריכתשם(false)}
                  className="py-3 px-4 rounded-2xl bg-white/10 text-white/70 font-bold text-sm"
                >
                  ביטול
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
