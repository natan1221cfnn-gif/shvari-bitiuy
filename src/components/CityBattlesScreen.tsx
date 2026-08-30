import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { טעןדירוגערים, עריברירתמחדל } from '../data/cityBattlesCloud';
import type { עירמידע } from '../types';

export function CityBattlesScreen() {
  const { שנהמסך, עירשחקן, עדכןעירשחקן, ניקוד, שיאאישי } = useGameStore();
  const [ערים, setערים] = useState<עירמידע[]>([]);
  const [טוען, setטוען] = useState(true);
  const [מודאלבחירה, setמודאלבחירה] = useState(false);

  useEffect(() => {
    let unmounted = false;
    טעןדירוגערים().then((נתונים) => {
      if (!unmounted) {
        setערים(נתונים);
        setטוען(false);
      }
    });
    return () => {
      unmounted = true;
    };
  }, []);

  const בחרעיר = (שם: string) => {
    עדכןעירשחקן(שם);
    setמודאלבחירה(false);
  };

  const עירנוכחית = ערים.find((c) => c.name === עירשחקן) || עריברירתמחדל[0];

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden text-white"
      style={{
        background: 'radial-gradient(circle at 50% 15%, #18082e 0%, #0c0417 60%, #04010a 100%)',
        direction: 'rtl',
        fontFamily: '"Varela Round", sans-serif',
      }}
    >
      {/* 👑 כותרת עליונה בסגנון GTA VI / ניאון ארקייד */}
      <div className="relative z-20 flex items-center justify-between px-4 pt-safe-top pt-4 pb-3 border-b border-fuchsia-500/20 bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => שנהמסך('פתיחה')}
            className="w-10 h-10 rounded-xl bg-purple-950/80 border border-fuchsia-500/40 flex items-center justify-center text-fuchsia-400 text-xl font-bold shadow-[0_0_15px_rgba(217,70,239,0.3)] active:scale-90 transition-transform"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-fuchsia-400 via-amber-300 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">
              <span>🏛️ מלחמת הערים</span>
            </h1>
            <p className="text-[10px] text-fuchsia-300/60 font-bold">ליגת השכונות והערים של ישראל בלייב</p>
          </div>
        </div>

        {/* כפתור החלפת עיר שחקן */}
        <button
          onClick={() => setמודאלבחירה(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-600/30 to-purple-600/30 border border-fuchsia-400/50 shadow-[0_0_12px_rgba(217,70,239,0.3)] active:scale-95 transition-all text-xs font-bold text-fuchsia-200"
        >
          <span>{עירנוכחית?.icon || '🦁'}</span>
          <span>{עירשחקן}</span>
          <span className="text-[10px] text-amber-300">✎</span>
        </button>
      </div>

      {/* ⏳ באנר סטטוס קרב שבועי */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-purple-950/60 via-fuchsia-950/60 to-purple-950/60 border-b border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-cyan-300 font-bold">
          <span className="animate-ping w-2 h-2 rounded-full bg-cyan-400 inline-block" />
          <span>קרב ערים פעיל: שעת נעילה 23:59</span>
        </div>
        <div className="text-amber-300/80 font-bold text-[11px]">
          תרומתך האישית: {(שיאאישי || ניקוד || 0).toLocaleString('he-IL')} נק׳
        </div>
      </div>

      {/* 🏆 טבלת דירוג הערים החיה */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {טוען ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-4xl animate-spin mb-3">🌀</div>
            <p className="text-white/60 font-bold text-sm">טוען נתוני קרב ערים מהענן...</p>
          </div>
        ) : (
          ערים.map((עיר, i) => {
            const זוהעירשלי = עיר.name === עירשחקן;
            const מדליה = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;

            return (
              <motion.div
                key={עיר.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all ${
                  זוהעירשלי
                    ? 'bg-gradient-to-r from-fuchsia-900/40 via-purple-900/40 to-cyan-900/40 border-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.35)]'
                    : i === 0
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-yellow-400/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {/* מספר / מדליה */}
                <div className="text-2xl font-black w-8 text-center">{מדליה}</div>

                {/* סמל העיר */}
                <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                  {עיר.icon}
                </div>

                {/* פרטי העיר */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black text-base truncate">{עיר.name}</span>
                    {זוהעירשלי && (
                      <span className="text-[10px] bg-fuchsia-500 text-black px-1.5 py-0.2 rounded-md font-black">
                        העיר שלך
                      </span>
                    )}
                  </div>
                  <div className="text-white/40 text-xs truncate">
                    {עיר.title} · {עיר.players.toLocaleString('he-IL')} לוחמים
                  </div>
                </div>

                {/* ניקוד העיר */}
                <div className="text-right">
                  <div className="text-yellow-400 font-black text-base tracking-tight">
                    {עיר.score.toLocaleString('he-IL')}
                  </div>
                  <div className="text-[10px] text-white/40 font-bold">נקודות</div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* 🪟 מודאל בחירת עיר */}
      <AnimatePresence>
        {מודאלבחירה && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setמודאלבחירה(false)}
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl p-6 border border-fuchsia-500/40 shadow-[0_0_30px_rgba(217,70,239,0.3)] space-y-4 max-h-[85vh] flex flex-col"
              style={{
                background: 'linear-gradient(160deg, #1f0a38 0%, #0e041c 100%)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="font-black text-xl text-white flex items-center gap-2">
                    <span>🏛️ ייצג את העיר שלך!</span>
                  </h3>
                  <p className="text-xs text-fuchsia-300 font-bold">
                    כל נקודה שתשיג במשחק תעלה את העיר שלך בטבלה!
                  </p>
                </div>
                <button
                  onClick={() => setמודאלבחירה(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm"
                >
                  ✕
                </button>
              </div>

              {/* רשימת ערים לבחירה */}
              <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
                {ערים.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => בחרעיר(c.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      c.name === עירשחקן
                        ? 'bg-fuchsia-600/30 border-fuchsia-400 text-white shadow-[0_0_15px_rgba(217,70,239,0.4)]'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.icon}</span>
                      <div className="text-right">
                        <div className="font-black text-sm">{c.name}</div>
                        <div className="text-[10px] text-white/40">{c.title}</div>
                      </div>
                    </div>
                    {c.name === עירשחקן && <span className="text-cyan-400 font-bold text-sm">✓ נבחרה</span>}
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
