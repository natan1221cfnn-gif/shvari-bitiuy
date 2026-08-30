import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { אזורימפה, קבלשלבמפה } from '../data/israelMapData';
import type { שלבמפהמידע } from '../types';

export function IsraelMapScreen() {
  const { שנהמסך, שלבמפהנוכחי, כוכבימפה, התחלשלבמפה } = useGameStore();
  const [שלבנבחר, setשלבנבחר] = useState<שלבמפהמידע | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // סך הכל כוכבים שנאספו
  const סךכוכבים = Object.values(כוכבימפה).reduce((a, b) => a + b, 0);

  const handleSelectStage = (מספר: number) => {
    const מידע = קבלשלבמפה(מספר);
    setשלבנבחר(מידע);
  };

  const handleStartStage = () => {
    if (שלבנבחר) {
      התחלשלבמפה(שלבנבחר.מספרשלב);
    }
  };

  // יצירת מערך 50 השלבים בסדר עולה מדרום לצפון (אילת 1 למטה -> חרמון 50 למעלה)
  const כלהשלבים = Array.from({ length: 50 }, (_, i) => i + 1).reverse();

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden text-white"
      style={{
        background: 'radial-gradient(circle at 50% 20%, #1a0b2e 0%, #0d0614 60%, #05020a 100%)',
        direction: 'rtl',
        fontFamily: '"Varela Round", sans-serif',
      }}
    >
      {/* 🔮 כותרת עליונה בסגנון ניאון ארקייד / גיימרים */}
      <div className="relative z-20 flex items-center justify-between px-4 pt-safe-top pt-4 pb-3 border-b border-cyan-500/20 bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => שנהמסך('פתיחה')}
            className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xl font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] active:scale-90 transition-transform"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 via-teal-300 to-yellow-300 bg-clip-text text-transparent flex items-center gap-2">
              <span>🗺️ מסע ישראלי</span>
            </h1>
            <p className="text-[10px] text-cyan-300/60 font-bold">מאילת ועד החרמון · 50 שלבים</p>
          </div>
        </div>

        {/* מונה כוכבים כולל */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.2)]">
          <span className="text-base animate-pulse">⭐</span>
          <span className="text-amber-300 font-black text-sm">{סךכוכבים}</span>
          <span className="text-amber-300/50 text-[10px]">/ 150</span>
        </div>
      </div>

      {/* 🚀 סרגל ניווט מהיר לאזורים */}
      <div className="relative z-10 flex gap-2 px-3 py-2 overflow-x-auto no-scrollbar border-b border-white/5 bg-purple-950/30">
        {אזורימפה.map((אזור) => (
          <div
            key={אזור.מזהה}
            className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/5 border border-white/10 text-white/80 flex items-center gap-1.5"
          >
            <span>{אזור.אייקון}</span>
            <span className="text-[11px]">{אזור.שם.split(' ')[0]}</span>
          </div>
        ))}
      </div>

      {/* 🗺️ מפת ישראל הגלילה - מסלול ניאון זוהר */}
      <div
        ref={mapContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 relative space-y-6"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* קו ניאון רקע מרכזי */}
        <div className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-cyan-400 via-fuchsia-500 to-amber-400 opacity-30 blur-[1px] pointer-events-none" />

        {אזורימפה.slice().reverse().map((אזור) => {
          const שלביהאזור = כלהשלבים.filter(
            (s) => s >= אזור.שלבטווח[0] && s <= אזור.שלבטווח[1]
          );

          return (
            <div key={אזור.מזהה} className="relative space-y-4">
              {/* באנר אזור גיאוגרפי */}
              <div className="flex items-center justify-center my-4">
                <div
                  className="px-4 py-1.5 rounded-full border shadow-lg flex items-center gap-2 backdrop-blur-md"
                  style={{
                    backgroundColor: 'rgba(15, 7, 30, 0.85)',
                    borderColor: אזור.צבעניאון,
                    boxShadow: `0 0 15px ${אזור.צבעניאון}40`,
                  }}
                >
                  <span className="text-lg">{אזור.אייקון}</span>
                  <span className="font-black text-sm tracking-wide" style={{ color: אזור.צבעניאון }}>
                    {אזור.שם}
                  </span>
                </div>
              </div>

              {/* גריד שלבי האזור */}
              <div className="grid grid-cols-4 gap-3.5 max-w-sm mx-auto">
                {שלביהאזור.map((מספרשלב) => {
                  const נעול = מספרשלב > שלבמפהנוכחי;
                  const נוכחי = מספרשלב === שלבמפהנוכחי;
                  const כוכבים = כוכבימפה[מספרשלב] || 0;

                  return (
                    <motion.button
                      key={מספרשלב}
                      whileHover={!נעול ? { scale: 1.08 } : {}}
                      whileTap={!נעול ? { scale: 0.92 } : {}}
                      onClick={() => !נעול && handleSelectStage(מספרשלב)}
                      disabled={נעול}
                      className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                        נעול
                          ? 'bg-black/40 border-white/10 text-white/30 cursor-not-allowed'
                          : נוכחי
                          ? 'bg-gradient-to-tr from-cyan-600 to-fuchsia-600 border-cyan-300 text-white shadow-[0_0_20px_rgba(0,240,255,0.7)] animate-pulse'
                          : 'bg-purple-900/40 border-purple-400/40 text-white shadow-md'
                      }`}
                      style={{
                        minHeight: '72px',
                      }}
                    >
                      {נעול ? (
                        <span className="text-sm">🔒</span>
                      ) : (
                        <>
                          <span className="text-base font-black tracking-tight">{מספרשלב}</span>
                          <div className="flex gap-0.5 mt-1 text-[10px]">
                            <span className={כוכבים >= 1 ? 'text-amber-300' : 'text-white/20'}>⭐</span>
                            <span className={כוכבים >= 2 ? 'text-amber-300' : 'text-white/20'}>⭐</span>
                            <span className={כוכבים >= 3 ? 'text-amber-300' : 'text-white/20'}>⭐</span>
                          </div>
                        </>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 🪟 מודאל בחירת שלב ומידע */}
      <AnimatePresence>
        {שלבנבחר && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setשלבנבחר(null)}
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl p-6 border border-cyan-500/40 shadow-[0_0_30px_rgba(0,240,255,0.3)] space-y-4"
              style={{
                background: 'linear-gradient(160deg, #180d33 0%, #0c051a 100%)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{שלבנבחר.אייקוןאזור}</span>
                  <div>
                    <h3 className="font-black text-lg text-white">שלב {שלבנבחר.מספרשלב}</h3>
                    <p className="text-xs text-cyan-400 font-bold">{שלבנבחר.שםאזור}</p>
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
                  <span className="text-white/50">⭐ כוכבים שלך:</span>
                  <span className="font-bold text-amber-300">
                    {'⭐'.repeat(כוכבימפה[שלבנבחר.מספרשלב] || 0) || 'טרם הושלם'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleStartStage}
                className="w-full py-4 rounded-2xl font-black text-lg text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-yellow-300 shadow-[0_0_20px_rgba(0,240,255,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2"
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
