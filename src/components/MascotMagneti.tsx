import { motion, AnimatePresence } from 'framer-motion';
import type { הבעתמגנטי, סוגסקין } from '../types';

interface מגנטיProps {
  מצב: הבעתמגנטי;
  סקין?: סוגסקין;
  טקסט?: string;
  קומבו?: number;
}

const משפטיםשמחים = [
  'פצצה אחי! 🔥',
  'בול בפוני! 🎯',
  'אין עליך! ✨',
  'איזה תותח! 🚀',
  'סוף הדרך! 🌟',
  'קליק מושלם! 🧲',
];

const משפטיםמתוחים = [
  'הנה זה בא...',
  'מוכן? 🫣',
  'תכוון טוב!',
  'שמור על קור רוח! ⚡',
];

const משפטיםעצובים = [
  'אוי חבל... 😅',
  'לא נורא, הבא בול! 💪',
  'כמעט היה שם!',
  'בפעם הבאה!',
];

export function MascotMagneti({ מצב, סקין = 'קלאסי', קומבו = 1 }: מגנטיProps) {
  const getSpeech = () => {
    if (מצב === 'חוגג' || (מצב === 'שמח' && קומבו > 2)) {
      return `קומבו x${קומבו}! מטורף! 🔥`;
    }
    if (מצב === 'שמח') {
      return משפטיםשמחים[Math.floor(Math.random() * משפטיםשמחים.length)];
    }
    if (מצב === 'מתוח') {
      return משפטיםמתוחים[Math.floor(Math.random() * משפטיםמתוחים.length)];
    }
    if (מצב === 'מבוהל') {
      return 'זהירות פצצה! 💣😱';
    }
    if (מצב === 'עצוב') {
      return משפטיםעצובים[Math.floor(Math.random() * משפטיםעצובים.length)];
    }
    if (מצב === 'טירוף') {
      return 'מהר מהר מהר! ⏱️⚡';
    }
    return null;
  };

  const speechText = getSpeech();

  const bodyAnimation = (() => {
    if (מצב === 'שמח' || מצב === 'חוגג') {
      return { y: [0, -14, 0, -6, 0], rotate: [0, -6, 6, -3, 0] };
    }
    if (מצב === 'מתוח') {
      return { scale: [1, 1.04, 0.96, 1], y: [0, 2, 0] };
    }
    if (מצב === 'מבוהל') {
      return { x: [-3, 3, -3, 3, 0], scale: [1, 0.9, 1.05, 1] };
    }
    if (מצב === 'עצוב') {
      return { y: [0, 4, 3], rotate: [0, -3, 0] };
    }
    if (מצב === 'טירוף') {
      return { scale: [1, 1.08, 1], rotate: [-2, 2, -2] };
    }
    return { y: [0, -4, 0] };
  })();

  const bodyTransition = (() => {
    if (מצב === 'שמח' || מצב === 'חוגג') {
      return { duration: 0.5, ease: 'easeOut' };
    }
    if (מצב === 'מתוח' || מצב === 'טירוף') {
      return { duration: 0.35, repeat: Infinity };
    }
    if (מצב === 'מבוהל') {
      return { duration: 0.25, repeat: Infinity };
    }
    return { duration: 2.2, repeat: Infinity, ease: 'easeInOut' };
  })();

  // 🎨 צבעים ואביזרים מותאמים לפי סקין
  const getSkinColors = () => {
    if (סקין === 'פלאפל') {
      return {
        leftFill: '#d97706', // פיתה
        rightFill: '#65a30d', // פלאפל ירוק
        capFill: '#fef08a', // טחינה/חומוס
        glow: '#84cc16',
        crown: false,
        falafel: true,
      };
    }
    if (סקין === 'ניאון') {
      return {
        leftFill: '#ff007f', // ניאון ורוד
        rightFill: '#00f2fe', // ניאון טורקיז
        capFill: '#ffffff',
        glow: '#00f2fe',
        crown: false,
        falafel: false,
      };
    }
    if (סקין === 'זהב') {
      return {
        leftFill: '#f59e0b', // זהב
        rightFill: '#fbbf24', // זהב מבריק
        capFill: '#fef3c7',
        glow: '#f59e0b',
        crown: true,
        falafel: false,
      };
    }
    // קלאסי
    return {
      leftFill: '#ef4444',
      rightFill: '#3b82f6',
      capFill: '#e2e8f0',
      glow: '#38bdf8',
      crown: false,
      falafel: false,
    };
  };

  const skinStyle = getSkinColors();

  return (
    <div className="relative flex flex-col items-center justify-center pointer-events-none select-none">
      {/* 🗨️ בועת דיבור */}
      <AnimatePresence>
        {speechText && (
          <motion.div
            key={speechText}
            initial={{ opacity: 0, scale: 0.7, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -8 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className="absolute -top-10 z-40 bg-white/95 text-purple-950 font-bold px-3 py-1 rounded-2xl shadow-xl text-xs border border-purple-200 whitespace-nowrap"
            style={{ fontFamily: '"Varela Round"', direction: 'rtl' }}
          >
            {speechText}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 rotate-45 border-r border-b border-purple-200" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧲 דמות מגנטי מותאמת לסקין */}
      <motion.div
        animate={bodyAnimation}
        transition={bodyTransition}
        className="relative w-14 h-14 flex items-center justify-center filter drop-shadow-md"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* הילה לסקין ניאון / זהב / טירוף */}
          {(מצב === 'חוגג' || מצב === 'טירוף' || סקין === 'ניאון' || סקין === 'זהב') && (
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke={skinStyle.glow}
              strokeWidth={סקין === 'ניאון' ? '4' : '3'}
              strokeDasharray="6 6"
              className="animate-spin"
              style={{ animationDuration: '6s' }}
            />
          )}

          {/* 👑 כתר לסקין זהב */}
          {skinStyle.crown && (
            <path
              d="M 38 12 L 44 22 L 50 10 L 56 22 L 62 12 L 60 25 L 40 25 Z"
              fill="#fbbf24"
              stroke="#b45309"
              strokeWidth="1.5"
            />
          )}

          {/* 🧆 כדורי פלאפל לסקין פלאפל */}
          {skinStyle.falafel && (
            <>
              <circle cx="50" cy="18" r="5" fill="#4d7c0f" stroke="#365314" strokeWidth="1" />
              <circle cx="43" cy="22" r="3.5" fill="#65a30d" />
              <circle cx="57" cy="22" r="3.5" fill="#65a30d" />
            </>
          )}

          {/* גוף הפרסה - מותאם לסקין */}
          {/* חצי ימני */}
          <path
            d="M 50 15 A 35 35 0 0 1 85 50 L 85 75 A 8 8 0 0 1 69 75 L 69 50 A 19 19 0 0 0 50 31 Z"
            fill={skinStyle.rightFill}
          />
          {/* חצי שמאלי */}
          <path
            d="M 50 15 A 35 35 0 0 0 15 50 L 15 75 A 8 8 0 0 0 31 75 L 31 50 A 19 19 0 0 1 50 31 Z"
            fill={skinStyle.leftFill}
          />

          {/* קצוות מגנט */}
          <rect x="15" y="70" width="16" height="12" rx="4" fill={skinStyle.capFill} stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="69" y="70" width="16" height="12" rx="4" fill={skinStyle.capFill} stroke="#cbd5e1" strokeWidth="1.5" />

          {/* 👁️ עין שמאל */}
          <g transform="translate(34, 42)">
            <ellipse cx="0" cy="0" rx="6.5" ry={מצב === 'מתוח' ? 3.5 : 6.5} fill="white" stroke="#1e1b4b" strokeWidth="1.5" />
            {מצב === 'שמח' || מצב === 'חוגג' ? (
              <path d="M -4 1 Q 0 -3 4 1" fill="none" stroke="#1e1b4b" strokeWidth="2.2" strokeLinecap="round" />
            ) : מצב === 'עצוב' ? (
              <circle cx="-1" cy="2" r="3" fill="#1e1b4b" />
            ) : (
              <circle cx="0" cy="0" r="3" fill="#1e1b4b">
                <circle cx="1" cy="-1" r="1" fill="white" />
              </circle>
            )}
          </g>

          {/* 👁️ עין ימין */}
          <g transform="translate(66, 42)">
            <ellipse cx="0" cy="0" rx="6.5" ry={מצב === 'מתוח' ? 3.5 : 6.5} fill="white" stroke="#1e1b4b" strokeWidth="1.5" />
            {מצב === 'שמח' || מצב === 'חוגג' ? (
              <path d="M -4 1 Q 0 -3 4 1" fill="none" stroke="#1e1b4b" strokeWidth="2.2" strokeLinecap="round" />
            ) : מצב === 'עצוב' ? (
              <circle cx="1" cy="2" r="3" fill="#1e1b4b" />
            ) : (
              <circle cx="0" cy="0" r="3" fill="#1e1b4b">
                <circle cx="1" cy="-1" r="1" fill="white" />
              </circle>
            )}
          </g>

          {/* 👄 פה */}
          {מצב === 'שמח' || מצב === 'חוגג' ? (
            <path d="M 41 53 Q 50 63 59 53 Z" fill="#ec4899" stroke="#1e1b4b" strokeWidth="1.2" />
          ) : מצב === 'מתוח' ? (
            <line x1="44" y1="55" x2="56" y2="55" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" />
          ) : מצב === 'מבוהל' ? (
            <ellipse cx="50" cy="56" rx="3.5" ry="5.5" fill="#1e1b4b" />
          ) : מצב === 'עצוב' ? (
            <path d="M 43 58 Q 50 53 57 58" fill="none" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M 45 53 Q 50 58 55 53" fill="none" stroke="#1e1b4b" strokeWidth="1.8" strokeLinecap="round" />
          )}

          {/* לחיים סמוקות */}
          <circle cx="28" cy="50" r="2.8" fill="#f43f5e" opacity="0.6" />
          <circle cx="72" cy="50" r="2.8" fill="#f43f5e" opacity="0.6" />

          {/* ידיים מגנטיות */}
          {מצב === 'שמח' || מצב === 'חוגג' ? (
            <>
              <circle cx="10" cy="34" r="4" fill="#ffd200" stroke="#b45309" strokeWidth="1" />
              <circle cx="90" cy="34" r="4" fill="#ffd200" stroke="#b45309" strokeWidth="1" />
            </>
          ) : (
            <>
              <circle cx="8" cy="58" r="3.5" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
              <circle cx="92" cy="58" r="3.5" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            </>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
