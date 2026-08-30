import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { אזורימפה, קבלשלבמפה } from '../data/israelMapData';
import type { שלבמפהמידע } from '../types';

export function IsraelMapScreen() {
  const { שנהמסך, שלבמפהנוכחי, כוכבימפה, התחלשלבמפה } = useGameStore();
  const [שלבנבחר, setשלבנבחר] = useState<שלבמפהמידע | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // סך הכל כוכבים שנאספו
  const סךכוכבים = Object.values(כוכבימפה).reduce((a, b) => a + b, 0);

  // גלילה אוטומטית לשלב הנוכחי
  useEffect(() => {
    const el = document.getElementById(`stage-node-${שלבמפהנוכחי}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [שלבמפהנוכחי]);

  const handleSelectStage = (מספר: number) => {
    const מידע = קבלשלבמפה(מספר);
    setשלבנבחר(מידע);
  };

  const handleStartStage = () => {
    if (שלבנבחר) {
      התחלשלבמפה(שלבנבחר.מספרשלב);
    }
  };

  // יצירת 50 שלבים מדרום (אילת 1) לצפון (חרמון 50)
  // מוצגים מלמעלה למטה: חרמון 50 למעלה, אילת 1 למטה
  const שלבים = Array.from({ length: 50 }, (_, i) => 50 - i);

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden text-white select-none"
      style={{
        background: 'radial-gradient(circle at 50% 15%, #18092e 0%, #0c0417 50%, #030108 100%)',
        direction: 'rtl',
        fontFamily: '"Varela Round", sans-serif',
      }}
    >
      {/* 🔮 כותרת עליונה בסגנון ניאון ארקייד / GTA VI */}
      <div className="relative z-30 flex items-center justify-between px-4 pt-safe-top pt-4 pb-3 border-b border-cyan-500/30 bg-black/70 backdrop-blur-lg shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => שנהמסך('פתיחה')}
            className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-300 text-xl font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-90 transition-transform"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 via-teal-200 to-yellow-300 bg-clip-text text-transparent flex items-center gap-2">
              <span>🗺️ מסע ישראלי</span>
            </h1>
            <p className="text-[10px] text-cyan-300/70 font-bold">50 שלבים מאילת ועד החרמון</p>
          </div>
        </div>

        {/* מונה כוכבים כולל */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
          <span className="text-base animate-pulse">⭐</span>
          <span className="text-amber-300 font-black text-sm">{סךכוכבים}</span>
          <span className="text-amber-300/50 text-[10px]">/ 150</span>
        </div>
      </div>

      {/* 🚀 סרגל ניווט מהיר לאזורים */}
      <div className="relative z-20 flex gap-2 px-3 py-2 overflow-x-auto no-scrollbar border-b border-white/5 bg-purple-950/40 backdrop-blur-md">
        {אזורימפה.map((אזור) => (
          <button
            key={אזור.מזהה}
            onClick={() => {
              const el = document.getElementById(`region-banner-${אזור.מזהה}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="flex-shrink-0 px-2.5 py-1 rounded-xl text-xs font-black bg-white/5 border border-white/10 text-white/80 hover:text-white flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <span>{אזור.אייקון}</span>
            <span className="text-[11px]">{אזור.שם.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* 🗺️ מפת ישראל הגלילה האנכית המפורטת */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-8 relative space-y-6"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* 🌌 רקע מפת ישראל טופוגרפית עם קווי מתאר זוהרים */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1000">
            {/* קו חוף הים התיכון */}
            <path
              d="M 25 100 Q 20 250 22 450 Q 28 650 35 800 Q 40 900 48 980"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* ים כנרת וים המלח */}
            <ellipse cx="65" cy="220" rx="6" ry="12" fill="none" stroke="#00f0ff" strokeWidth="2" />
            <path d="M 68 460 Q 65 520 70 580 Q 72 630 68 670" fill="none" stroke="#00f0ff" strokeWidth="3" />
            {/* קווי גובה וטופוגרפיה סייבר */}
            <circle cx="50" cy="120" r="40" fill="none" stroke="#99ddff" strokeWidth="0.5" strokeDasharray="3 6" />
            <circle cx="45" cy="500" r="60" fill="none" stroke="#ffd700" strokeWidth="0.5" strokeDasharray="3 6" />
            <circle cx="52" cy="850" r="70" fill="none" stroke="#ffaa00" strokeWidth="0.5" strokeDasharray="3 6" />
          </svg>
        </div>

        {/* קו ניאון מפותל שמחבר את שלבי המפה */}
        <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-2.5 bg-gradient-to-b from-cyan-400 via-fuchsia-500 to-amber-400 opacity-50 blur-[2px] pointer-events-none rounded-full" />

        {אזורימפה.slice().reverse().map((אזור) => {
          const שלביהאזור = שלבים.filter(
            (s) => s >= אזור.שלבטווח[0] && s <= אזור.שלבטווח[1]
          );

          return (
            <div key={אזור.מזהה} id={`region-banner-${אזור.מזהה}`} className="relative space-y-5">
              {/* 🏙️ באנר אזור גיאוגרפי עם עיצוב GTA VI */}
              <div className="flex items-center justify-center my-6">
                <div
                  className="px-5 py-2.5 rounded-2xl border-2 shadow-2xl flex items-center gap-3 backdrop-blur-xl"
                  style={{
                    backgroundColor: 'rgba(18, 7, 36, 0.9)',
                    borderColor: אזור.צבעניאון,
                    boxShadow: `0 0 25px ${אזור.צבעניאון}45`,
                  }}
                >
                  <span className="text-2xl">{אזור.אייקון}</span>
                  <div>
                    <h3 className="font-black text-sm tracking-wide" style={{ color: אזור.צבעניאון }}>
                      {אזור.שם}
                    </h3>
                    <p className="text-[10px] text-white/50">{אזור.תיאור}</p>
                  </div>
                </div>
              </div>

              {/* גריד שלבים מפותל ומרהיב */}
              <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
                {שלביהאזור.map((מספרשלב, idx) => {
                  const נעול = מספרשלב > שלבמפהנוכחי;
                  const נוכחי = מספרשלב === שלבמפהנוכחי;
                  const כוכבים = כוכבימפה[מספרשלב] || 0;
                  // זיגזג קל למראה שביל מפותל
                  const offset = idx % 3 === 0 ? 'translate-x-6' : idx % 3 === 1 ? '-translate-x-6' : 'translate-x-0';

                  return (
                    <motion.div
                      key={מספרשלב}
                      id={`stage-node-${מספרשלב}`}
                      className={`relative ${offset} transition-transform`}
                    >
                      <motion.button
                        whileHover={!נעול ? { scale: 1.1 } : {}}
                        whileTap={!נעול ? { scale: 0.92 } : {}}
                        onClick={() => !נעול && handleSelectStage(מספרשלב)}
                        disabled={נעול}
                        className={`relative w-20 h-20 rounded-3xl border-2 flex flex-col items-center justify-center transition-all ${
                          נעול
                            ? 'bg-black/50 border-white/10 text-white/25 cursor-not-allowed shadow-none'
                            : נוכחי
                            ? 'bg-gradient-to-tr from-cyan-600 via-purple-600 to-fuchsia-600 border-cyan-300 text-white shadow-[0_0_30px_rgba(0,240,255,0.8)] animate-pulse'
                            : 'bg-gradient-to-br from-purple-900/80 to-indigo-950/80 border-purple-400/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                        }`}
                      >
                        {נעול ? (
                          <span className="text-xl">🔒</span>
                        ) : (
                          <>
                            <span className="text-lg font-black tracking-tight">{מספרשלב}</span>
                            <div className="flex gap-0.5 mt-0.5 text-[10px]">
                              <span className={כוכבים >= 1 ? 'text-amber-300 drop-shadow-[0_0_4px_#fbbf24]' : 'text-white/20'}>⭐</span>
                              <span className={כוכבים >= 2 ? 'text-amber-300 drop-shadow-[0_0_4px_#fbbf24]' : 'text-white/20'}>⭐</span>
                              <span className={כוכבים >= 3 ? 'text-amber-300 drop-shadow-[0_0_4px_#fbbf24]' : 'text-white/20'}>⭐</span>
                            </div>
                          </>
                        )}

                        {/* תגית "שחק עכשיו" על השלב הפעיל */}
                        {נוכחי && (
                          <span className="absolute -bottom-2 bg-yellow-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full shadow-[0_0_10px_#fde047]">
                            שחק! ⚡
                          </span>
                        )}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 🚀 כפתור קבוע תחתון: שחק את השלב הנוכחי מיד */}
      <div className="relative z-30 p-3 bg-black/80 backdrop-blur-md border-t border-white/10">
        <button
          onClick={() => handleSelectStage(שלבמפהנוכחי)}
          className="w-full py-3.5 rounded-2xl font-black text-base text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-yellow-300 shadow-[0_0_25px_rgba(0,240,255,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>▶️</span>
          <span>שחק שלב {שלבמפהנוכחי} (השלב הפעיל שלך)</span>
        </button>
      </div>

      {/* 🪟 מודאל בחירת שלב ומידע */}
      <AnimatePresence>
        {שלבנבחר && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setשלבנבחר(null)}
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl p-6 border-2 border-cyan-500/50 shadow-[0_0_40px_rgba(0,240,255,0.4)] space-y-4"
              style={{
                background: 'linear-gradient(160deg, #1c0a38 0%, #0d041c 100%)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{שלבנבחר.אייקוןאזור}</span>
                  <div>
                    <h3 className="font-black text-xl text-white">שלב {שלבנבחר.מספרשלב}</h3>
                    <p className="text-xs text-cyan-300 font-bold">{שלבנבחר.שםאזור}</p>
                  </div>
                </div>
                <button
                  onClick={() => setשלבנבחר(null)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-white/80">
                <div className="flex justify-between">
                  <span className="text-white/50">🎯 יעד חיבורים:</span>
                  <span className="font-bold text-cyan-300">{שלבנבחר.יעדפגיעות} ביטויים</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">⚡ מהירות מגנט:</span>
                  <span className="font-bold text-yellow-300">{שלבנבחר.מהירותבסיס}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">⭐ כוכבים שנצברו:</span>
                  <span className="font-bold text-amber-300">
                    {'⭐'.repeat(כוכבימפה[שלבנבחר.מספרשלב] || 0) || 'טרם הושלם'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleStartStage}
                className="w-full py-4 rounded-2xl font-black text-lg text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-yellow-300 shadow-[0_0_25px_rgba(0,240,255,0.7)] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>▶️</span>
                <span>שחק שלב {שלבנבחר.מספרשלב}!</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
