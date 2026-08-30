import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { קבלשלבמפה } from '../data/israelMapData';
import type { שלבמפהמידע } from '../types';

export function IsraelMapScreen() {
  const { שנהמסך, שלבמפהנוכחי, כוכבימפה, התחלשלבמפה, מטבעות, שםשחקן, לבבות } = useGameStore();
  const [שלבנבחר, setשלבנבחר] = useState<שלבמפהמידע>(קבלשלבמפה(שלבמפהנוכחי || 1));
  const scrollRef = useRef<HTMLDivElement>(null);

  const סךכוכבים = Object.values(כוכבימפה).reduce((a, b) => a + b, 0);

  useEffect(() => {
    setשלבנבחר(קבלשלבמפה(שלבמפהנוכחי || 1));
  }, [שלבמפהנוכחי]);

  const handleStartStage = (stageNum: number) => {
    התחלשלבמפה(stageNum);
  };

  // רשימת אתרי ציון לאורך המפה
  const אתריציון = [
    {
      id: 'hermon',
      name: 'חרמון',
      stage: 50,
      icon: '❄️',
      color: '#38bdf8',
      desc: 'פסגת החרמון המושלגת',
      yPercent: 8,
      xPercent: 70,
    },
    {
      id: 'haifa',
      name: 'חיפה',
      stage: 40,
      icon: '🚢',
      color: '#00f0ff',
      desc: 'נמל חיפה והכרמל',
      yPercent: 24,
      xPercent: 32,
    },
    {
      id: 'telaviv',
      name: 'תל אביב',
      stage: 30,
      icon: '🏙️',
      color: '#a855f7',
      desc: 'גורדי השחקים של גוש דן',
      yPercent: 42,
      xPercent: 25,
    },
    {
      id: 'jerusalem',
      name: 'ירושלים',
      stage: 20,
      icon: '🏰',
      color: '#facc15',
      desc: 'חומות העיר העתיקה',
      yPercent: 54,
      xPercent: 68,
    },
    {
      id: 'negev',
      name: 'מכתש רמון',
      stage: 10,
      icon: '🏜️',
      color: '#fb923c',
      desc: 'מצוקי הנגב והמדבר',
      yPercent: 75,
      xPercent: 42,
    },
    {
      id: 'eilat',
      name: 'אילת',
      stage: 1,
      icon: '🌴',
      color: '#f43f5e',
      desc: 'חופי ים סוף והאלמוגים',
      yPercent: 92,
      xPercent: 50,
    },
  ];

  // יצירת 50 נקודות שלב לאורך המסלול הגיאוגרפי
  const stagePoints = Array.from({ length: 50 }, (_, i) => {
    const stageNum = i + 1;
    // אינטרפולציה מדרום (אילת Y=92%, X=50%) לצפון (חרמון Y=8%, X=70%)
    const t = i / 49; // 0 to 1
    // קו מתפתל דמוי מפת ישראל
    const y = 92 - t * 84;
    const wave = Math.sin(t * Math.PI * 3.5) * 22;
    const x = 50 + wave + (t > 0.6 ? 12 : -8);
    return {
      num: stageNum,
      x,
      y,
      unlocked: stageNum <= שלבמפהנוכחי,
      active: stageNum === שלבמפהנוכחי,
      stars: כוכבימפה[stageNum] || 0,
    };
  });

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden text-white select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 20%, #1e093d 0%, #0c021a 50%, #030008 100%)',
        direction: 'rtl',
        fontFamily: '"Varela Round", sans-serif',
      }}
    >
      {/* 🔮 1. סרגל עליון זוהר (HUD) בדיוק כמו בתמונה */}
      <div className="relative z-30 px-3 pt-safe-top pt-3 pb-2 border-b border-purple-500/20 bg-black/60 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          {/* מונה כוכבים ומד התקדמות */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-purple-950/80 border border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <span className="text-cyan-300 text-lg drop-shadow-[0_0_8px_#00f0ff]">⭐</span>
            <div className="flex flex-col">
              <span className="text-cyan-300 text-xs font-black leading-none">
                {סךכוכבים}/150
              </span>
              <div className="w-14 h-1.5 bg-black/50 rounded-full mt-1 overflow-hidden border border-cyan-500/30">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-400"
                  style={{ width: `${Math.min(100, (סךכוכבים / 150) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* כותרת קשת ניאון "מסע ישראלי - מפת השלבים" */}
          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-black tracking-wider text-cyan-300 drop-shadow-[0_0_12px_#00f0ff] leading-none">
              מסע ישראלי
            </h1>
            <p className="text-[10px] text-white/80 font-bold tracking-widest mt-0.5">
              מפת השלבים
            </p>
          </div>

          {/* פרטי משתמש ומטבעות */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-black">
              <span>🪙</span>
              <span>{מטבעות}</span>
            </div>

            {/* פרופיל משתמש קטן */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-purple-900/60 border border-purple-400/40">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-black">
                👤
              </div>
              <div className="text-right leading-none hidden xs:block">
                <div className="text-[9px] text-white/60">User: {שםשחקן.split(' ')[0]}</div>
                <div className="text-[10px] font-black text-cyan-300">Lvl: {שלבמפהנוכחי}</div>
              </div>
              <div className="text-rose-400 font-black text-xs flex items-center gap-0.5">
                <span>❤️</span>
                <span>{לבבות}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🗺️ 2. מפת ישראל גרפית ורטיקלית מפותלת (SVG Canvas) */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto relative no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="relative w-full max-w-md mx-auto min-h-[1400px] py-10 px-4">
          {/* מפת רקע וקטורית של ישראל בסגנון ניאון סייברפאנק */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 400 1400"
            preserveAspectRatio="none"
          >
            {/* רשת קווי מתאר עתידנית */}
            <defs>
              <pattern id="cyberGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(168,85,247,0.06)" strokeWidth="1" />
              </pattern>
              {/* פילטר זוהר חזק */}
              <filter id="neonGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="neonGlowFuchsia" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect width="400" height="1400" fill="url(#cyberGrid)" />

            {/* קווי גבולות וכבישי ישראל בסגול/פוקסיה זוהר */}
            <g stroke="#d946ef" strokeWidth="1.5" opacity="0.35" fill="none">
              {/* קו חוף ים תיכון */}
              <path d="M 80 120 Q 70 300 90 550 Q 110 800 150 1050 L 190 1300" strokeWidth="2.5" stroke="#00f0ff" opacity="0.6" />
              {/* גבול מזרחי וירדן */}
              <path d="M 310 100 Q 290 320 280 600 Q 290 900 210 1300" />
              {/* כבישי רוחב ניאון */}
              <path d="M 85 300 Q 180 320 290 330" strokeDasharray="3 3" />
              <path d="M 95 600 Q 190 620 280 640" strokeDasharray="3 3" />
              <path d="M 120 900 Q 190 910 260 920" strokeDasharray="3 3" />
            </g>

            {/* גופי מים זוהרים: כנרת וים המלח */}
            {/* ים כנרת */}
            <ellipse cx="260" cy="280" rx="14" ry="22" fill="rgba(0,240,255,0.25)" stroke="#00f0ff" strokeWidth="2" filter="url(#neonGlowCyan)" />
            {/* ים המלח */}
            <path d="M 270 580 Q 260 660 275 760 Q 285 700 270 580 Z" fill="rgba(0,240,255,0.25)" stroke="#00f0ff" strokeWidth="2" filter="url(#neonGlowCyan)" />

            {/* מסלול האנרגיה הציאן הראשי שמחבר את כל השלבים */}
            <path
              d="M 200 1300 C 160 1100, 240 900, 160 700 C 90 520, 220 350, 280 120"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#neonGlowCyan)"
            />
            <path
              d="M 200 1300 C 160 1100, 240 900, 160 700 C 90 520, 220 350, 280 120"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeDasharray="8 6"
              opacity="0.8"
            />
          </svg>

          {/* 🏙️ כרטיסיות אתרי ציון ישראליים מרהיבים (אילת, ירושלים, ת"א, חיפה, חרמון) */}
          {אתריציון.map((אתר) => (
            <div
              key={אתר.id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${(אתר.yPercent / 100) * 1350}px`, left: `${אתר.xPercent}%` }}
            >
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="px-3.5 py-2 rounded-2xl border-2 flex items-center gap-2.5 backdrop-blur-md shadow-2xl"
                style={{
                  backgroundColor: 'rgba(15, 5, 30, 0.88)',
                  borderColor: אתר.color,
                  boxShadow: `0 0 20px ${אתר.color}60`,
                }}
              >
                <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">{אתר.icon}</span>
                <div className="text-right leading-tight">
                  <h3 className="font-black text-xs tracking-wide" style={{ color: אתר.color }}>
                    {אתר.name}
                  </h3>
                  <span className="text-[9px] bg-black/60 px-1.5 py-0.5 rounded-full text-white/70 font-bold">
                    שלב {אתר.stage}
                  </span>
                </div>
              </motion.div>
            </div>
          ))}

          {/* 🎯 צמתי השלבים לאורך שביל האנרגיה */}
          {stagePoints.map((pt) => {
            const isSelected = שלבנבחר.מספרשלב === pt.num;
            return (
              <div
                key={pt.num}
                id={`stage-node-${pt.num}`}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${(pt.y / 100) * 1350}px`, left: `${pt.x}%` }}
              >
                {/* בועת שלב פעיל זוהרת (בדיוק כמו כרטיסיית שלב 28 בתמונה!) */}
                {isSelected ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="relative flex flex-col items-center cursor-pointer"
                    onClick={() => setשלבנבחר(קבלשלבמפה(pt.num))}
                  >
                    <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 border-2 border-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.9)] text-center">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-amber-300">
                        <span>⭐</span>
                        <span>⭐</span>
                        <span>⭐</span>
                      </div>
                      <div className="text-xs font-black text-white whitespace-nowrap">
                        שלב {pt.num}
                      </div>
                    </div>
                    {/* חץ מצביע לנקודה */}
                    <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-t-cyan-300 -mt-0.5" />
                    {/* עיגול השלב המרכזי */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500 border-2 border-white flex items-center justify-center text-white font-black text-sm shadow-[0_0_20px_#00f0ff] animate-pulse mt-1">
                      ⭐
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    whileTap={pt.unlocked ? { scale: 0.88 } : {}}
                    onClick={() => pt.unlocked && setשלבנבחר(קבלשלבמפה(pt.num))}
                    disabled={!pt.unlocked}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${
                      pt.unlocked
                        ? 'bg-gradient-to-tr from-indigo-900 to-cyan-900 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.5)]'
                        : 'bg-black/70 border-white/10 text-white/20 cursor-not-allowed'
                    }`}
                  >
                    {pt.unlocked ? (
                      pt.num
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

      {/* 🚀 3. כפתור פליי ענק תחתון "▶️ שחק שלב X" בדיוק כמו בתמונה! */}
      <div className="relative z-30 p-3 bg-black/85 backdrop-blur-xl border-t border-purple-500/30">
        <div className="max-w-sm mx-auto space-y-2">
          <button
            onClick={() => handleStartStage(שלבנבחר.מספרשלב)}
            className="w-full py-4 rounded-2xl font-black text-xl text-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_35px_rgba(0,240,255,0.85)] border-2 border-cyan-200"
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #38bdf8 50%, #818cf8 100%)',
              fontFamily: '"Varela Round", sans-serif',
            }}
          >
            <span className="text-2xl">▶️</span>
            <span>שחק שלב {שלבנבחר.מספרשלב}</span>
          </button>
        </div>

        {/* סרגל ניווט תחתון (מפה 🗺️, חנות 🛒, פרופיל 👤, הגדרות ⚙️) */}
        <div className="flex items-center justify-around pt-3 border-t border-white/5 max-w-sm mx-auto text-xl">
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
    </div>
  );
}
