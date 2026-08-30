import { motion } from 'framer-motion';
import type { סוגסקין, סוגבלוקמיוחד, סוגמסלול } from '../types';

interface מגנטProps {
  טקסט: string;
  צד: 'שמאל' | 'ימין';
  סטטוס: 'זזע' | 'הצלחה' | 'כישלון' | 'כמעט' | 'ממתין';
  עמדה: number;
  סקין?: סוגסקין;
  בלוקמיוחד?: סוגבלוקמיוחד;
  מסלול?: סוגמסלול;
}

export function MagnetBlock({
  טקסט,
  צד,
  סטטוס,
  עמדה,
  סקין = 'קלאסי',
  בלוקמיוחד = 'רגיל',
  מסלול = 'ישר',
}: מגנטProps) {
  const הואשמאל = צד === 'שמאל';

  // חישוב היסט Y וסיבוב לפי סוג המסלול
  const getYOffset = () => {
    if (סטטוס === 'הצלחה' || סטטוס === 'כישלון') return 0;
    if (מסלול === 'אלכסון') {
      // שמאל מתחיל מלמעלה (+40px), ימין מתחיל מלמטה (-40px)
      return הואשמאל ? -עמדה * 45 : עמדה * 45;
    }
    if (מסלול === 'קשת') {
      // קשת גל סינוס שמגיעה ל-0 במרכז
      return -Math.sin(עמדה * Math.PI) * 35;
    }
    return 0;
  };

  const getRotation = () => {
    if (סטטוס === 'הצלחה' || סטטוס === 'כישלון') return 0;
    if (מסלול === 'סחרור') {
      return הואשמאל ? עמדה * 25 : -עמדה * 25;
    }
    if (מסלול === 'אלכסון') {
      return הואשמאל ? -8 * עמדה : 8 * עמדה;
    }
    return 0;
  };

  // עיצוב לפי סקין ובלוק מיוחד
  const getStyling = () => {
    if (בלוקמיוחד === 'פצצה') {
      return {
        bg: 'linear-gradient(135deg, #e52d27 0%, #b31217 100%)',
        border: 'border-red-400',
        glow: '0 0 25px rgba(229,45,39,0.8)',
        badge: '💣',
      };
    }

    if (בלוקמיוחד === 'זהב') {
      return {
        bg: 'linear-gradient(135deg, #ffe066 0%, #f59f00 50%, #d9480f 100%)',
        border: 'border-yellow-200',
        glow: '0 0 35px rgba(255,224,102,0.9)',
        badge: '🌟',
      };
    }

    if (בלוקמיוחד === 'האטה') {
      return {
        bg: 'linear-gradient(135deg, #15aabf 0%, #12b886 100%)',
        border: 'border-teal-200',
        glow: '0 0 25px rgba(21,170,191,0.8)',
        badge: '⏱️',
      };
    }

    if (סטטוס === 'הצלחה') {
      return {
        bg: 'linear-gradient(135deg, #11998e, #38ef7d)',
        border: 'border-emerald-300',
        glow: '0 0 45px rgba(56,239,125,0.9)',
        badge: null,
      };
    }

    if (סטטוס === 'כישלון') {
      return {
        bg: 'linear-gradient(135deg, #f7797d, #b621fe)',
        border: 'border-pink-300',
        glow: '0 0 20px rgba(247,121,125,0.7)',
        badge: null,
      };
    }

    if (סקין === 'פלאפל') {
      return {
        bg: הואשמאל
          ? 'linear-gradient(135deg, #d97706, #b45309)'
          : 'linear-gradient(135deg, #65a30d, #4d7c0f)',
        border: הואשמאל ? 'border-amber-200' : 'border-lime-200',
        glow: '0 8px 24px rgba(0,0,0,0.4)',
        badge: הואשמאל ? '🫓' : '🧆',
      };
    }

    if (סקין === 'ניאון') {
      return {
        bg: הואשמאל
          ? 'linear-gradient(135deg, #00f2fe, #4facfe)'
          : 'linear-gradient(135deg, #ff0844, #ffb199)',
        border: הואשמאל ? 'border-cyan-300' : 'border-pink-300',
        glow: הואשמאל ? '0 0 30px rgba(0,242,254,0.8)' : '0 0 30px rgba(255,8,68,0.8)',
        badge: '💎',
      };
    }

    if (סקין === 'זהב') {
      return {
        bg: 'linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
        border: 'border-yellow-100',
        glow: '0 0 35px rgba(252,246,186,0.8)',
        badge: '🥇',
      };
    }

    if (סקין === 'דרקון_להבה') {
      return {
        bg: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #f97316 100%)',
        border: 'border-rose-300',
        glow: '0 0 40px rgba(239, 68, 68, 0.95), 0 0 70px rgba(249, 115, 22, 0.6)',
        badge: '🔥',
      };
    }

    if (סקין === 'רעם_קוונטי') {
      return {
        bg: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #38bdf8 100%)',
        border: 'border-cyan-200',
        glow: '0 0 45px rgba(0, 240, 255, 0.95), 0 0 80px rgba(56, 189, 248, 0.7)',
        badge: '⚡',
      };
    }

    if (סקין === 'חור_שחור') {
      return {
        bg: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #a21caf 100%)',
        border: 'border-fuchsia-300',
        glow: '0 0 50px rgba(192, 132, 252, 0.9), 0 0 90px rgba(217, 70, 239, 0.6)',
        badge: '🌌',
      };
    }

    if (סקין === 'יהלום_חלל') {
      return {
        bg: 'linear-gradient(135deg, #38bdf8 0%, #f472b6 35%, #facc15 70%, #4ade80 100%)',
        border: 'border-white',
        glow: '0 0 45px rgba(56, 189, 248, 0.9), 0 0 85px rgba(244, 114, 182, 0.8)',
        badge: '💎',
      };
    }

    if (סקין === 'אלוהי_מגנט') {
      return {
        bg: 'linear-gradient(135deg, #ffd700 0%, #ffae19 35%, #ff3b00 70%, #fff275 100%)',
        border: 'border-yellow-200',
        glow: '0 0 60px rgba(253, 224, 71, 1), 0 0 100px rgba(245, 158, 11, 0.9)',
        badge: '👑',
      };
    }

    return {
      bg: הואשמאל
        ? 'linear-gradient(135deg, #4facfe, #00f2fe)'
        : 'linear-gradient(135deg, #f7971e, #ffd200)',
      border: 'border-white/25',
      glow: עמדה < 0.12 ? '0 0 25px rgba(255,255,255,0.7)' : '0 8px 32px rgba(0,0,0,0.3)',
      badge: null,
    };
  };

  const style = getStyling();

  const xValue = (() => {
    if (סטטוס === 'הצלחה') return 0;
    if (סטטוס === 'כישלון') return הואשמאל ? '-130%' : '130%';
    if (סטטוס === 'כמעט') return הואשמאל ? '-80%' : '80%';
    return הואשמאל ? `${-עמדה * 115}%` : `${עמדה * 115}%`;
  })();

  const yValue = getYOffset();
  const rotateValue = getRotation();

  return (
    <div className="relative">
      {/* 💨 שובלי תנועה (Motion Trails) */}
      {סטטוס === 'זזע' && עמדה > 0.05 && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 pointer-events-none opacity-40 ${
            הואשמאל ? 'right-0 translate-x-3' : 'left-0 -translate-x-3'
          }`}
        >
          <div
            className="w-10 h-6 rounded-full blur-sm"
            style={{ background: style.bg }}
          />
        </div>
      )}

      {/* הבלוק הראשי */}
      <motion.div
        animate={{
          x: xValue,
          y: yValue,
          rotate: rotateValue,
          scale: סטטוס === 'הצלחה' ? [1, 1.25, 0.92, 1] : 1,
        }}
        transition={
          סטטוס === 'הצלחה'
            ? { type: 'spring', stiffness: 450, damping: 16 }
            : { type: 'tween', ease: 'linear', duration: 0 }
        }
        className={`relative flex items-center justify-center rounded-3xl border-4 ${style.border} select-none flex-shrink-0`}
        style={{
          width: 'clamp(120px, 36vw, 160px)',
          height: 'clamp(64px, 18vw, 88px)',
          background: style.bg,
          boxShadow: style.glow,
          filter: סטטוס === 'הצלחה' ? 'brightness(1.15)' : 'brightness(1)',
        }}
      >
        {/* תגית אייקון/סקין בפינה */}
        {style.badge && (
          <span className="absolute top-1 right-2 text-xs opacity-80 pointer-events-none">
            {style.badge}
          </span>
        )}

        {/* ברק עליון */}
        <div
          className="absolute rounded-full bg-white/30"
          style={{ width: '45%', height: 6, top: 8, right: '12%' }}
        />

        {/* הטקסט */}
        <span
          className="text-white font-bold text-center px-2 leading-tight"
          style={{
            fontFamily: '"Varela Round", sans-serif',
            fontSize:
              טקסט.length > 9 ? '0.85rem'
              : טקסט.length > 6 ? '1rem'
              : '1.2rem',
            textShadow: '0 2px 6px rgba(0,0,0,0.4)',
            direction: 'rtl',
            color: סקין === 'זהב' && בלוקמיוחד === 'רגיל' ? '#2d1b69' : 'white',
          }}
        >
          {טקסט}
        </span>

        {/* נקודת מגנט */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg ${
            הואשמאל ? 'bg-blue-700 left-0 -translate-x-1/2' : 'bg-red-500 right-0 translate-x-1/2'
          }`}
        />
      </motion.div>
    </div>
  );
}
