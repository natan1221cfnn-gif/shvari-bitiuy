import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, רשימתסקינים } from '../store/gameStore';
import { useSound } from '../hooks/useSound';
import type { סוגסקין, סקיןמידע } from '../types';

export function ShopScreen() {
  const {
    מטבעות,
    סקיןפעיל,
    סקיניםפתוחים,
    שיאאישי,
    שנהמסך,
    קנהסקין,
    בחרסקין,
  } = useGameStore();

  const { נגןרמהחדשה, נגןקומבו } = useSound();
  const [סקיןנחגג, setסקיןנחגג] = useState<סקיןמידע | null>(null);

  const בצעקנייהאוהפעלה = (סקין: סקיןמידע, האםקנייה: boolean) => {
    if (האםקנייה) {
      const הצלחה = קנהסקין(סקין.מזהה as סוגסקין);
      if (הצלחה) {
        נגןרמהחדשה();
        נגןקומבו(5);
        setסקיןנחגג(סקין);
      }
    } else {
      בחרסקין(סקין.מזהה as סוגסקין);
      נגןרמהחדשה();
      setסקיןנחגג(סקין);
    }
  };

  // רקע לפי סקין נחגג
  const getThemedAura = (מזהה?: סוגסקין) => {
    switch (מזהה) {
      case 'דרקון_להבה':
        return {
          glow: 'rgba(239, 68, 68, 0.95)',
          bg: 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, rgba(249,115,22,0.2) 50%, transparent 80%)',
          title: '🔥 להבות הסייבר דרקון הופעלו!',
          badge: 'סקין אגדי: פניקס הלהבה',
          border: 'border-red-500',
        };
      case 'רעם_קוונטי':
        return {
          glow: 'rgba(0, 240, 255, 0.95)',
          bg: 'radial-gradient(circle, rgba(0,240,255,0.4) 0%, rgba(56,189,248,0.2) 50%, transparent 80%)',
          title: '⚡ רעם קוונטי נטען במלואו!',
          badge: 'סקין מיתולוגי: ת\'ור הקוונטי',
          border: 'border-cyan-400',
        };
      case 'חור_שחור':
        return {
          glow: 'rgba(168, 85, 247, 0.95)',
          bg: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(217,70,239,0.2) 50%, transparent 80%)',
          title: '🌌 שער הכבידה הגלקטי נפתח!',
          badge: 'סקין על-חלל: חור שחור גלקטי',
          border: 'border-fuchsia-400',
        };
      case 'יהלום_חלל':
        return {
          glow: 'rgba(56, 189, 248, 0.95)',
          bg: 'radial-gradient(circle, rgba(56,189,248,0.4) 0%, rgba(244,114,182,0.3) 50%, transparent 80%)',
          title: '💎 יהלום פריזמטי על-חלל נחשף!',
          badge: 'סקין קוסמי: שבירת אור 7 צבעים',
          border: 'border-cyan-300',
        };
      case 'אלוהי_מגנט':
        return {
          glow: 'rgba(234, 179, 8, 1)',
          bg: 'radial-gradient(circle, rgba(234,179,8,0.5) 0%, rgba(245,158,11,0.3) 50%, transparent 80%)',
          title: '👑 כתר האלמוות GTA GOD!',
          badge: 'סקין אלוהי: כוח אינסופי של מיליון נקודות',
          border: 'border-yellow-300',
        };
      default:
        return {
          glow: 'rgba(234, 179, 8, 0.8)',
          bg: 'radial-gradient(circle, rgba(234,179,8,0.3) 0%, transparent 70%)',
          title: '✨ סקין הופעל בהצלחה!',
          badge: 'סקין מוכן למשחק',
          border: 'border-yellow-400',
        };
    }
  };

  const aura = getThemedAura(סקיןנחגג?.מזהה as סוגסקין);

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 10%, #1e093d 0%, #0c021a 50%, #030008 100%)',
        direction: 'rtl',
        fontFamily: '"Varela Round", sans-serif',
      }}
    >
      {/* ━━ שורת עליונה ━━ */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-safe-top pt-5 pb-3 border-b border-purple-500/20 bg-black/60 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => שנהמסך('פתיחה')}
            className="w-10 h-10 rounded-2xl bg-purple-950/80 border border-purple-400/40 flex items-center justify-center text-cyan-300 text-xl font-bold active:scale-90 transition-transform shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            ←
          </button>
          <h1 className="text-white font-black text-2xl drop-shadow-[0_0_12px_#00f0ff]">
            🛒 חנות הסקינים
          </h1>
        </div>

        {/* מטבעות */}
        <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-400/50 px-3.5 py-1.5 rounded-2xl text-amber-300 font-black shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <span className="text-lg">🪙</span>
          <span>{מטבעות.toLocaleString('he-IL')}</span>
        </div>
      </div>

      {/* ━━ רשימת סקינים ━━ */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {רשימתסקינים.map((סקין, i) => {
          const הואפתוח = סקיניםפתוחים.includes(סקין.מזהה);
          const הואפעיל = סקיןפעיל === סקין.מזהה;
          const זכאימשיא = סקין.דרישתשיא && שיאאישי >= סקין.דרישתשיא;
          const יכוללקנות = מטבעות >= סקין.מחיר;

          return (
            <motion.div
              key={סקין.מזהה}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-3xl p-4 sm:p-5 border-2 relative overflow-hidden transition-all shadow-xl"
              style={{
                background: הואפעיל
                  ? 'linear-gradient(135deg, rgba(168,85,247,0.35), rgba(0,240,255,0.2))'
                  : 'rgba(15, 5, 30, 0.75)',
                borderColor: הואפעיל ? '#00f0ff' : 'rgba(255,255,255,0.12)',
                boxShadow: הואפעיל ? '0 0 25px rgba(0,240,255,0.4)' : 'none',
              }}
            >
              {הואפעיל && (
                <span className="absolute top-3 left-4 bg-cyan-400 text-black text-[11px] font-black px-3 py-0.5 rounded-full shadow-[0_0_10px_#00f0ff]">
                  ✓ פעיל כעת!
                </span>
              )}

              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl bg-black/60 border-2 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.15)] flex-shrink-0"
                >
                  {סקין.איקון}
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-white font-black text-lg sm:text-xl drop-shadow">
                    {סקין.שם}
                  </h3>
                  <p className="text-white/70 text-xs mt-1 leading-relaxed">
                    {סקין.תיאור}
                  </p>

                  {סקין.דרישתשיא && !הואפתוח && (
                    <div className="text-amber-300 text-[11px] mt-1.5 font-black flex items-center gap-1">
                      <span>🏆</span>
                      <span>נפתח אוטומטית בהגעה ל-{סקין.דרישתשיא.toLocaleString('he-IL')} נקודות!</span>
                    </div>
                  )}

                  {/* כפתורי פעולה */}
                  <div className="mt-3.5">
                    {הואפתוח ? (
                      <button
                        onClick={() => בצעקנייהאוהפעלה(סקין, false)}
                        disabled={הואפעיל}
                        className={`w-full py-3 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95 ${
                          הואפעיל
                            ? 'bg-cyan-400 text-black opacity-90 cursor-default shadow-[0_0_15px_#00f0ff]'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border border-purple-400/50'
                        }`}
                      >
                        {הואפעיל ? '🌟 בשימוש פעיל' : '⚡ הפעל סקין זה עכשיו!'}
                      </button>
                    ) : (
                      <button
                        onClick={() => בצעקנייהאוהפעלה(סקין, true)}
                        disabled={!יכוללקנות && !זכאימשיא}
                        className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 ${
                          יכוללקנות || זכאימשיא
                            ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.6)]'
                            : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'
                        }`}
                      >
                        <span>קנה עבור {סקין.מחיר.toLocaleString('he-IL')}</span>
                        <span className="text-base">🪙</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 🎆 ━━ מודאל חגיגת הפעלת סקין סינמטי מטורף (Mythic Awakening) ━━ */}
      <AnimatePresence>
        {סקיןנחגג && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
            onClick={() => setסקיןנחגג(null)}
          >
            {/* אפקט הילת אנרגיה מסתובבת */}
            <div
              className="absolute inset-0 pointer-events-none animate-pulse"
              style={{ background: aura.bg }}
            />

            <motion.div
              initial={{ scale: 0.5, y: 50, rotate: -5 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.5, y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 14, stiffness: 200 }}
              className={`relative w-full max-w-sm rounded-3xl p-6 sm:p-8 border-4 ${aura.border} text-center space-y-5 shadow-2xl overflow-hidden`}
              style={{
                background: 'linear-gradient(170deg, #1c093a 0%, #0a0214 100%)',
                boxShadow: `0 0 60px ${aura.glow}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* כוכבי רקע מנצנצים */}
              <div className="absolute top-2 left-2 text-2xl animate-spin">✨</div>
              <div className="absolute top-2 right-2 text-2xl animate-spin">✨</div>
              <div className="absolute bottom-2 left-4 text-xl">🌟</div>
              <div className="absolute bottom-2 right-4 text-xl">🌟</div>

              {/* תגית סקין עליונה */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-black text-amber-300 shadow-inner"
              >
                {aura.badge}
              </motion.div>

              {/* אייקון ענק מונפש תלת ממדי עם גלי הדף */}
              <div className="relative py-2 flex items-center justify-center">
                {/* טבעות גלי הלם זוהרות */}
                <div
                  className="absolute w-36 h-36 rounded-full animate-ping opacity-30"
                  style={{ background: aura.glow }}
                />
                <div
                  className="absolute w-28 h-28 rounded-full border-2 border-dashed border-white/40 animate-spin"
                  style={{ animationDuration: '6s' }}
                />

                <motion.div
                  animate={{
                    scale: [1, 1.25, 1.1],
                    rotate: [0, 8, -8, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="w-24 h-24 rounded-3xl bg-black/70 border-4 border-white/40 flex items-center justify-center text-6xl shadow-[0_0_40px_rgba(255,255,255,0.5)] z-10"
                >
                  {סקיןנחגג.איקון}
                </motion.div>
              </div>

              {/* כותרת ופרטים */}
              <div>
                <h2 className="text-2xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                  {סקיןנחגג.שם}
                </h2>
                <p className="text-sm font-bold text-cyan-300 mt-1">
                  {aura.title}
                </p>
                <p className="text-xs text-white/70 mt-2 leading-relaxed">
                  {סקיןנחגג.תיאור}
                </p>
              </div>

              {/* כפתורי פעולה */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setסקיןנחגג(null);
                    שנהמסך('מפה');
                  }}
                  className="w-full py-4 rounded-2xl font-black text-lg text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-yellow-300 shadow-[0_0_30px_rgba(0,240,255,0.9)] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>🔥</span>
                  <span>צא לשחק עם הסקין עכשיו! 🚀</span>
                </button>

                <button
                  onClick={() => setסקיןנחגג(null)}
                  className="w-full py-2.5 text-xs text-white/60 hover:text-white font-bold"
                >
                  הישאר בחנות
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
