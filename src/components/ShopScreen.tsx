import { motion } from 'framer-motion';
import { useGameStore, רשימתסקינים } from '../store/gameStore';
import type { סוגסקין } from '../types';

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

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        direction: 'rtl',
      }}
    >
      {/* ━━ שורת עליונה ━━ */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-safe-top pt-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => שנהמסך('פתיחה')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-lg"
          >
            ←
          </button>
          <h1 className="text-white font-bold text-2xl" style={{ fontFamily: '"Varela Round"' }}>
            🛒 חנות סקינים
          </h1>
        </div>

        {/* מטבעות */}
        <div className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-400/40 px-3.5 py-1.5 rounded-full text-yellow-300 font-bold">
          <span className="text-lg">🪙</span>
          <span>{מטבעות} מטבעות</span>
        </div>
      </div>

      {/* ━━ רשימת סקינים ━━ */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
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
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl p-5 border relative overflow-hidden"
              style={{
                background: הואפעיל
                  ? 'linear-gradient(135deg, rgba(247,151,30,0.25), rgba(255,210,0,0.15))'
                  : 'rgba(255,255,255,0.06)',
                borderColor: הואפעיל ? 'rgba(247,151,30,0.6)' : 'rgba(255,255,255,0.12)',
              }}
            >
              {הואפעיל && (
                <span className="absolute top-3 left-4 bg-yellow-400 text-purple-950 text-xs font-bold px-3 py-1 rounded-full shadow">
                  ✓ בשימוש עכשיו
                </span>
              )}

              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl bg-white/10 border border-white/20 shadow-inner flex-shrink-0">
                  {סקין.איקון}
                </div>

                <div className="flex-1">
                  <h3 className="text-white font-bold text-xl" style={{ fontFamily: '"Varela Round"' }}>
                    {סקין.שם}
                  </h3>
                  <p className="text-white/60 text-xs mt-1 leading-relaxed" style={{ fontFamily: '"Varela Round"' }}>
                    {סקין.תיאור}
                  </p>

                  {סקין.דרישתשיא && !הואפתוח && (
                    <div className="text-yellow-300 text-xs mt-2 font-bold">
                      🏆 נפתח אוטומטית בהגעה ל-{סקין.דרישתשיא.toLocaleString('he-IL')} נקודות!
                    </div>
                  )}

                  {/* כפתורי פעולה */}
                  <div className="mt-4">
                    {הואפתוח ? (
                      <button
                        onClick={() => בחרסקין(סקין.מזהה as סוגסקין)}
                        disabled={הואפעיל}
                        className={`w-full py-2.5 rounded-2xl font-bold text-sm transition-all ${
                          הואפעיל
                            ? 'bg-yellow-400 text-purple-950 opacity-90 cursor-default'
                            : 'bg-white/15 hover:bg-white/25 text-white'
                        }`}
                        style={{ fontFamily: '"Varela Round"' }}
                      >
                        {הואפעיל ? 'בשימוש' : 'הפעל סקין זה'}
                      </button>
                    ) : (
                      <button
                        onClick={() => קנהסקין(סקין.מזהה as סוגסקין)}
                        disabled={!יכוללקנות && !זכאימשיא}
                        className={`w-full py-2.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                          יכוללקנות || זכאימשיא
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-purple-950 shadow-lg active:scale-95'
                            : 'bg-white/10 text-white/40 cursor-not-allowed'
                        }`}
                        style={{ fontFamily: '"Varela Round"' }}
                      >
                        <span>קנה עבור {סקין.מחיר}</span>
                        <span>🪙</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
