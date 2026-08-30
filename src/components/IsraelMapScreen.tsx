import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { קבלשלבמפה } from '../data/israelMapData';
import type { שלבמפהמידע } from '../types';

// נקודות ציון לאורך נתיב האנרגיה הציאן שבתמונה (מאילת ועד החרמון)
const PATH_WAYPOINTS = [
  { t: 0.00, x: 38, y: 88.5 }, // 🌴 שלב 1: אילת וחוף ים סוף
  { t: 0.10, x: 42, y: 81.0 }, // שלב 5: חולות הערבה
  { t: 0.20, x: 46, y: 73.0 }, // 🏜️ שלב 10: מצוקי הנגב
  { t: 0.30, x: 51, y: 65.0 }, // שלב 15: עין גדי וים המלח
  { t: 0.40, x: 56, y: 57.5 }, // 🏰 שלב 20: ירושלים וכיפת הזהב
  { t: 0.50, x: 47, y: 50.0 }, // שלב 25: שפלת יהודה
  { t: 0.60, x: 37, y: 43.5 }, // 🏙️ שלב 30: מגדלי תל אביב
  { t: 0.70, x: 43, y: 35.5 }, // שלב 35: חוף השרון
  { t: 0.80, x: 49, y: 28.5 }, // 🚢 שלב 40: נמל חיפה והמפרץ
  { t: 0.90, x: 67, y: 21.0 }, // 🌊 שלב 45: הכנרת ועמק הירדן
  { t: 1.00, x: 74, y: 11.0 }, // ❄️ שלב 50: פסגת החרמון המושלגת
];

// אינטרפולציה חלקה בין נקודות הציון
function getPathPosition(stageNum: number) {
  const norm = (stageNum - 1) / 49; // 0..1
  for (let i = 0; i < PATH_WAYPOINTS.length - 1; i++) {
    const p1 = PATH_WAYPOINTS[i];
    const p2 = PATH_WAYPOINTS[i + 1];
    if (norm >= p1.t && norm <= p2.t) {
      const localT = (norm - p1.t) / (p2.t - p1.t);
      const x = p1.x + (p2.x - p1.x) * localT;
      const y = p1.y + (p2.y - p1.y) * localT;
      return { x, y };
    }
  }
  return { x: PATH_WAYPOINTS[PATH_WAYPOINTS.length - 1].x, y: PATH_WAYPOINTS[PATH_WAYPOINTS.length - 1].y };
}

export function IsraelMapScreen() {
  const { שנהמסך, שלבמפהנוכחי, כוכבימפה, התחלשלבמפה, מטבעות, שםשחקן, לבבות } = useGameStore();
  const [שלבנבחר, setשלבנבחר] = useState<שלבמפהמידע>(קבלשלבמפה(שלבמפהנוכחי || 1));
  const [מודאלשלבפתוח, setמודאלשלבפתוח] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const סךכוכבים = Object.values(כוכבימפה).reduce((a, b) => a + b, 0);

  useEffect(() => {
    setשלבנבחר(קבלשלבמפה(שלבמפהנוכחי || 1));
  }, [שלבמפהנוכחי]);

  // גלילה אוטומטית לשלב הנוכחי
  useEffect(() => {
    const el = document.getElementById(`map-stage-btn-${שלבמפהנוכחי}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [שלבמפהנוכחי]);

  const handleStartStage = (stageNum: number) => {
    התחלשלבמפה(stageNum);
  };

  const stages = Array.from({ length: 50 }, (_, i) => {
    const num = i + 1;
    const pos = getPathPosition(num);
    const unlocked = num <= שלבמפהנוכחי;
    const active = num === שלבמפהנוכחי;
    const stars = כוכבימפה[num] || 0;
    return { num, ...pos, unlocked, active, stars };
  });

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden text-white select-none"
      style={{
        background: '#04010a',
        direction: 'rtl',
        fontFamily: '"Varela Round", sans-serif',
      }}
    >
      {/* 🔮 1. סרגל עליון HUD זוהר */}
      <div className="relative z-30 px-3 pt-safe-top pt-3 pb-2 border-b border-cyan-500/20 bg-black/75 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between">
          {/* מונה כוכבים ומד התקדמות */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-purple-950/80 border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <span className="text-yellow-300 text-lg drop-shadow-[0_0_8px_#fbbf24]">⭐</span>
            <div className="flex flex-col">
              <span className="text-yellow-300 text-xs font-black leading-none">
                {סךכוכבים}/150
              </span>
              <div className="w-14 h-1.5 bg-black/60 rounded-full mt-1 overflow-hidden border border-cyan-500/30">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-yellow-400"
                  style={{ width: `${Math.min(100, (סךכוכבים / 150) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* כותרת קשת ניאון "מסע ישראלי - מפת השלבים" */}
          <div className="text-center">
            <h1 className="text-xl font-black tracking-wider text-cyan-300 drop-shadow-[0_0_15px_#00f0ff] leading-none">
              מסע ישראלי
            </h1>
            <p className="text-[10px] text-white/80 font-bold tracking-widest mt-0.5">
              מפת השלבים
            </p>
          </div>

          {/* מטבעות ופרופיל */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-black">
              <span>🪙</span>
              <span>{מטבעות}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-purple-900/60 border border-purple-400/40">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-400 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-black">
                👤
              </div>
              <div className="text-rose-400 font-black text-xs flex items-center gap-0.5">
                <span>❤️</span>
                <span>{לבבות}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🗺️ 2. מפת ישראל המאוירת הגרפית המלאה ב-3D Cyberpunk */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto relative no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="relative w-full max-w-lg mx-auto min-h-[1700px]">
          {/* תמונת הרקע המרהיבה של מפת ישראל */}
          <img
            src="/israel_map_bg.jpg"
            alt="מפת מסע ישראלי"
            className="w-full h-full object-cover object-center absolute inset-0 pointer-events-none"
          />

          {/* שכבת הצללה רכה לקריאות מלאה */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

          {/* 🎯 50 צמתי השלבים הממוקמים בדיוק על שביל האנרגיה הציאן */}
          {stages.map((st) => {
            const isSelected = שלבנבחר.מספרשלב === st.num;
            return (
              <div
                key={st.num}
                id={`map-stage-btn-${st.num}`}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${st.y}%`, left: `${st.x}%` }}
              >
                {isSelected ? (
                  /* 🌟 בועת שלב פעיל זוהרת מעל הצומת */
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="relative flex flex-col items-center cursor-pointer"
                    onClick={() => {
                      setשלבנבחר(קבלשלבמפה(st.num));
                      setמודאלשלבפתוח(true);
                    }}
                  >
                    <div className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 border-2 border-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.95)] text-center">
                      <div className="flex items-center justify-center gap-0.5 text-[9px] text-amber-300">
                        <span>⭐</span>
                        <span>⭐</span>
                        <span>⭐</span>
                      </div>
                      <div className="text-xs font-black text-white whitespace-nowrap">
                        שלב {st.num}
                      </div>
                    </div>
                    {/* משולש מצביע */}
                    <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-t-cyan-300 -mt-0.5" />
                    {/* צומת פעיל זוהר */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-400 to-yellow-300 border-2 border-white flex items-center justify-center text-black font-black text-base shadow-[0_0_20px_#00f0ff] animate-pulse mt-1">
                      ⭐
                    </div>
                  </motion.div>
                ) : (
                  /* צומת שלב רגיל (פתוח או נעול) */
                  <motion.button
                    whileTap={st.unlocked ? { scale: 0.88 } : {}}
                    onClick={() => {
                      if (st.unlocked) {
                        setשלבנבחר(קבלשלבמפה(st.num));
                        setמודאלשלבפתוח(true);
                      }
                    }}
                    disabled={!st.unlocked}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${
                      st.unlocked
                        ? 'bg-gradient-to-tr from-indigo-900/90 to-cyan-900/90 border-cyan-300 text-cyan-100 shadow-[0_0_15px_rgba(0,240,255,0.7)] backdrop-blur-sm'
                        : 'bg-black/80 border-white/20 text-white/30 cursor-not-allowed backdrop-blur-sm'
                    }`}
                  >
                    {st.unlocked ? (
                      st.num
                    ) : (
                      <span className="text-[10px]">🔒</span>
                    )}
                  </motion.button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 🚀 3. סרגל פרטי שלב מורחב וכפתור פליי ענק תחתון */}
      <div className="relative z-30 px-3 pt-2.5 pb-2 bg-black/90 backdrop-blur-xl border-t border-cyan-500/30">
        <div className="max-w-sm mx-auto space-y-2">
          {/* תגית תקציר נתוני השלב הנבחר (יעד חיבורים, מהירות, וכוכבים שנאספו) */}
          <div
            onClick={() => setמודאלשלבפתוח(true)}
            className="p-2.5 rounded-2xl bg-purple-950/70 border border-purple-400/40 shadow-inner flex items-center justify-between cursor-pointer active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{שלבנבחר.אייקוןאזור}</span>
              <div className="text-right leading-tight">
                <div className="text-xs font-black text-white flex items-center gap-1">
                  <span>שלב {שלבנבחר.מספרשלב}</span>
                  <span className="text-cyan-300">({שלבנבחר.שםאזור})</span>
                </div>
                <div className="text-[10px] text-white/70 font-bold flex items-center gap-2 mt-0.5">
                  <span>🎯 יעד: {שלבנבחר.יעדפגיעות}</span>
                  <span>⚡ {שלבנבחר.מהירותבסיס}ms</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="text-amber-300 text-xs font-black">
                {'⭐'.repeat(כוכבימפה[שלבנבחר.מספרשלב] || 0) || '☆☆☆'}
              </div>
              <span className="text-[9px] text-cyan-300 underline font-bold mt-0.5">
                פרטים מלאים ℹ️
              </span>
            </div>
          </div>

          {/* כפתור פליי ראשי */}
          <button
            onClick={() => handleStartStage(שלבנבחר.מספרשלב)}
            className="w-full py-3.5 rounded-2xl font-black text-lg text-black flex items-center justify-center gap-2.5 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,240,255,0.9)] border-2 border-cyan-200"
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #38bdf8 50%, #818cf8 100%)',
              fontFamily: '"Varela Round", sans-serif',
            }}
          >
            <span className="text-xl">▶️</span>
            <span>שחק שלב {שלבנבחר.מספרשלב}</span>
          </button>
        </div>

        {/* סרגל ניווט תחתון */}
        <div className="flex items-center justify-around pt-2.5 border-t border-white/10 max-w-sm mx-auto text-xl">
          <button
            className="text-cyan-400 drop-shadow-[0_0_10px_#00f0ff] p-1.5 flex flex-col items-center text-[10px] font-bold"
          >
            <span>🗺️</span>
            <span>מפה</span>
          </button>
          <button
            onClick={() => שנהמסך('חנות')}
            className="text-white/50 hover:text-white p-1.5 flex flex-col items-center text-[10px] font-bold"
          >
            <span>🛒</span>
            <span>חנות</span>
          </button>
          <button
            onClick={() => שנהמסך('שיאים')}
            className="text-white/50 hover:text-white p-1.5 flex flex-col items-center text-[10px] font-bold"
          >
            <span>🏆</span>
            <span>שיאים</span>
          </button>
          <button
            onClick={() => שנהמסך('הגדרות')}
            className="text-white/50 hover:text-white p-1.5 flex flex-col items-center text-[10px] font-bold"
          >
            <span>⚙️</span>
            <span>הגדרות</span>
          </button>
        </div>
      </div>

      {/* 🪟 מודאל פרטי שלב ויעדים */}
      <AnimatePresence>
        {מודאלשלבפתוח && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setמודאלשלבפתוח(false)}
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl p-6 border-2 border-cyan-400/60 shadow-[0_0_50px_rgba(0,240,255,0.5)] space-y-4"
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
                  onClick={() => setמודאלשלבפתוח(false)}
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
                onClick={() => {
                  setמודאלשלבפתוח(false);
                  handleStartStage(שלבנבחר.מספרשלב);
                }}
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
