import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useSound } from '../hooks/useSound';
import { useHaptic } from '../hooks/useHaptic';
import { MagnetBlock } from './MagnetBlock';
import { MascotMagneti } from './MascotMagneti';
import { קטגוריותסמל } from '../types';

const הודעותהצלחה = ['מצוין! 🎯', 'על הנקודה! ⚡', 'מדהים! 🔥', 'כן כן כן! 💥', 'בדיוק! ✨', 'ממגנט! 🧲', 'וואו! 🌟'];
const תגיותמכפיל = ['', '', '×2 🔥', '×3 💥', '×4 ⚡', '×5 🌟'];

export function GameScreen() {
  const {
    ביטוינוכחי,
    ניקוד,
    מכפיל,
    לבבות,
    שלב,
    הצלחות,
    מטבעות,
    סקיןפעיל,
    בלוקמיוחדנוכחי,
    מסלולנוכחי,
    מגנטימצב,
    האטהפעילה,
    סטטוס,
    מהירות,
    שיאאישי,
    הגדרות,
    מצבמשחק,
    קטגוריהנבחרת,
    זמןטירוףנותר,
    עדכןביטוי,
    טפלבהצלחה,
    טפלבפספוס,
    טפלבפצצה,
    טפלבכמעט,
    עדכןסטטוס,
    עדכןמגנטי,
    שנהמסך,
    השהה,
    המשך,
    הפחתזמןטירוף,
  } = useGameStore();

  const {
    נגןהצלחה,
    נגןקומבו,
    נגןכישלון,
    נגןכמעט,
    נגןמוקדם,
    נגןרמהחדשה,
    נגןתקתוק,
    הפעלמוזיקה,
    עצורמוזיקה,
  } = useSound();

  const { רטטהצלחה, רטטכישלון, רטטקומבו, רטטקל } = useHaptic();

  const [עמדה, setעמדה] = useState(1);
  const [הודעה, setהודעה] = useState('');
  const [ניקודקפיצה, setניקודקפיצה] = useState(false);
  const [סטטוסבלוק, setSטטוסבלוק] = useState<'זזע' | 'הצלחה' | 'כישלון' | 'כמעט' | 'ממתין'>('ממתין');

  // 💥 הרעדת מסך ואפקטי מחץ
  const [screenShake, setScreenShake] = useState(false);
  const [screenFlash, setScreenFlash] = useState<'green' | 'yellow' | 'red' | null>(null);
  const [rings, setRings] = useState<number[]>([]);
  const [floatingText, setFloatingText] = useState<{ id: number; text: string; isGold?: boolean } | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [coinsPop, setCoinsPop] = useState<number | null>(null);

  const animRef = useRef<number>(0);
  const התחלהRef = useRef<number>(0);
  const באזורPRef = useRef(false);
  const כמעטPRef = useRef(false);

  const חלוןפגיעה = הגדרות.רמה === 'קל' ? 0.16 : הגדרות.רמה === 'בינוני' ? 0.10 : 0.06;
  const חלוןכמעט = חלוןפגיעה * 2.2;
  const הואטירוף = מצבמשחק === 'טירוף';

  // ⏱️ שעון עצר למצב טירוף
  useEffect(() => {
    if (!הואטירוף || סטטוס === 'סיום' || סטטוס === 'מושהה') return;

    const timer = setInterval(() => {
      const finished = הפחתזמןטירוף(1);
      if (זמןטירוףנותר <= 10 && זמןטירוףנותר > 0) {
        נגןתקתוק();
      }
      if (finished) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [הואטירוף, סטטוס, זמןטירוףנותר, הפחתזמןטירוף, נגןתקתוק]);

  // 🌆 רקע דינמי לפי שלב
  const getBackgroundGradient = () => {
    if (הואטירוף) {
      return 'linear-gradient(135deg, #380036 0%, #0cbaba 100%)';
    }
    if (שלב <= 5) {
      return 'linear-gradient(135deg, #1a0533 0%, #2d1b69 30%, #11225c 60%, #0d3456 100%)';
    } else if (שלב <= 10) {
      return 'linear-gradient(135deg, #2b0826 0%, #61183c 35%, #922b3e 70%, #d8572a 100%)';
    } else if (שלב <= 15) {
      return 'linear-gradient(135deg, #090014 0%, #1d003b 35%, #00363a 70%, #005c53 100%)';
    } else {
      return 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)';
    }
  };

  useEffect(() => {
    הפעלמוזיקה();
    return () => עצורמוזיקה();
  }, []); // eslint-disable-line

  const startMove = useCallback(() => {
    setעמדה(1);
    setSטטוסבלוק('זזע');
    באזורPRef.current = false;
    כמעטPRef.current = false;
    התחלהRef.current = performance.now();

    const animate = (עכשיו: number) => {
      const חלף = עכשיו - התחלהRef.current;
      const התקדמות = Math.min(חלף / מהירות, 1);
      const עמדהחדשה = 1 - התקדמות;
      setעמדה(עמדהחדשה);

      if (עמדהחדשה <= חלוןכמעט && !כמעטPRef.current) {
        כמעטPRef.current = true;
        עדכןמגנטי('מתוח');
      }

      if (עמדהחדשה <= חלוןפגיעה && !באזורPRef.current) {
        באזורPRef.current = true;
        עדכןסטטוס('תפוס');
      }

      if (התקדמות < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        const מצבנוכחי = useGameStore.getState().סטטוס;
        if (מצבנוכחי !== 'הצלחה' && מצבנוכחי !== 'כישלון' && מצבנוכחי !== 'מושהה') {
          handleMiss('מאוחר');
        }
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [מהירות, חלוןפגיעה, חלוןכמעט, עדכןסטטוס, עדכןמגנטי]);

  useEffect(() => {
    if (סטטוס === 'מתחיל' && ביטוינוכחי) {
      setSטטוסבלוק('ממתין');
      const t = setTimeout(() => startMove(), 350);
      return () => clearTimeout(t);
    }
    if (סטטוס === 'הצלחה') {
      const t = setTimeout(() => {
        setהודעה('');
        setSטטוסבלוק('ממתין');

        const currentSuccesses = useGameStore.getState().הצלחות;
        if (currentSuccesses > 0 && currentSuccesses % 10 === 0) {
          setShowLevelUp(true);
          נגןרמהחדשה();
          setTimeout(() => {
            setShowLevelUp(false);
            עדכןביטוי();
          }, 2000);
        } else {
          עדכןביטוי();
        }
      }, 950);
      return () => clearTimeout(t);
    }
    if (סטטוס === 'כישלון' || סטטוס === 'כמעט') {
      const t = setTimeout(() => {
        setהודעה('');
        setSטטוסבלוק('ממתין');
        עדכןביטוי();
      }, 800);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [סטטוס, ביטוינוכחי]); // eslint-disable-line

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const triggerJuice = useCallback((type: 'success' | 'almost' | 'miss') => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 260);

    if (type === 'success') {
      setScreenFlash('green');
      setRings((prev) => [...prev, Date.now()]);
      setTimeout(() => setScreenFlash(null), 250);
    } else if (type === 'almost') {
      setScreenFlash('yellow');
      setTimeout(() => setScreenFlash(null), 200);
    } else {
      setScreenFlash('red');
      setTimeout(() => setScreenFlash(null), 250);
    }
  }, []);

  const handleMiss = useCallback((סיבה: 'מוקדם' | 'מאוחר' = 'מאוחר') => {
    cancelAnimationFrame(animRef.current);
    const currPhrase = useGameStore.getState().ביטוינוכחי;
    const currSpecial = useGameStore.getState().בלוקמיוחדנוכחי;

    if (currSpecial === 'פצצה') {
      setSטטוסבלוק('הצלחה');
      setהודעה('כל הכבוד! נמנעת מהפצצה! 💣✅');
      נגןהצלחה();
      triggerJuice('success');
      if (currPhrase) טפלבפספוס(currPhrase);
      return;
    }

    if (סיבה === 'מוקדם' && כמעטPRef.current) {
      setSטטוסבלוק('כמעט');
      setהודעה('כמעט! 🤏 קרוב מאוד!');
      נגןכמעט();
      רטטקל();
      triggerJuice('almost');
      טפלבכמעט();
    } else {
      setSטטוסבלוק('כישלון');
      setהודעה(סיבה === 'מוקדם' ? 'מוקדם מדי! ⏳' : 'מאוחר מדי! ⏱️');
      נגןכישלון();
      רטטכישלון();
      triggerJuice('miss');
      if (currPhrase) טפלבפספוס(currPhrase);
    }
  }, [נגןכמעט, נגןכישלון, נגןהצלחה, רטטקל, רטטכישלון, triggerJuice, טפלבכמעט, טפלבפספוס]);

  const handleTap = useCallback(() => {
    const מצבנוכחי = useGameStore.getState().סטטוס;
    if (מצבנוכחי === 'מושהה') return;

    const currSpecial = useGameStore.getState().בלוקמיוחדנוכחי;

    if (currSpecial === 'פצצה') {
      cancelAnimationFrame(animRef.current);
      setSטטוסבלוק('כישלון');
      setהודעה('בום! 💣 לחצת על הפצצה!');
      נגןכישלון();
      רטטכישלון();
      triggerJuice('miss');
      טפלבפצצה();
      return;
    }

    if (מצבנוכחי === 'תפוס') {
      cancelAnimationFrame(animRef.current);
      const { מכפיל: מכפילחדש, מטבעותנוספו } = טפלבהצלחה();
      setSטטוסבלוק('הצלחה');

      setCoinsPop(מטבעותנוספו);
      setTimeout(() => setCoinsPop(null), 1000);

      const currPhrase = useGameStore.getState().ביטוינוכחי;
      if (currPhrase) {
        setFloatingText({
          id: Date.now(),
          text: currSpecial === 'זהב'
            ? `🌟 ${currPhrase.שמאל} ${currPhrase.ימין} (+300!)`
            : הואטירוף
            ? `⚡ ${currPhrase.שמאל} ${currPhrase.ימין} (+2ש׳!)`
            : `${currPhrase.שמאל} ${currPhrase.ימין}`,
          isGold: currSpecial === 'זהב',
        });
      }

      const הודעהרנד = currSpecial === 'זהב'
        ? '🌟 בונוס זהב מטורף!'
        : currSpecial === 'האטה'
        ? '⏱️ הילוך איטי פועל!'
        : הודעותהצלחה[Math.floor(Math.random() * הודעותהצלחה.length)];

      setהודעה(הודעהרנד);
      setניקודקפיצה(true);
      setTimeout(() => setניקודקפיצה(false), 300);

      נגןהצלחה();
      if (מכפילחדש > 1) נגןקומבו(מכפילחדש);
      רטטהצלחה();
      if (מכפילחדש > 1) רטטקומבו(מכפילחדש);
      triggerJuice('success');
    } else if (מצבנוכחי === 'מתחיל' || מצבנוכחי === 'ממתין') {
      handleMiss('מוקדם');
    }
  }, [טפלבהצלחה, טפלבפצצה, נגןהצלחה, נגןקומבו, נגןכישלון, רטטהצלחה, רטטקומבו, רטטכישלון, triggerJuice, handleMiss, הואטירוף]);

  const לבבותמערך = Array.from({ length: 3 }, (_, i) => i < לבבות);
  const באזורפגיעה = סטטוס === 'תפוס';

  return (
    <motion.div
      animate={
        screenShake
          ? {
              x: [-6, 6, -5, 5, -2, 2, 0],
              y: [4, -4, 3, -3, 1, 0],
            }
          : {}
      }
      transition={{ duration: 0.25 }}
      className="fixed inset-0 flex flex-col select-none overflow-hidden transition-all duration-700 justify-between"
      style={{
        background: getBackgroundGradient(),
        touchAction: 'none',
        direction: 'rtl',
      }}
      onPointerDown={handleTap}
    >
      {/* Flash FX */}
      {screenFlash && (
        <div
          className={`absolute inset-0 z-50 pointer-events-none transition-opacity duration-150 ${
            screenFlash === 'green'
              ? 'bg-green-400/20'
              : screenFlash === 'yellow'
              ? 'bg-yellow-400/20'
              : 'bg-red-500/25'
          }`}
        />
      )}

      {/* ━━━━ 1. שורת מצב עליונה ━━━━ */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-safe-top pt-3 pb-1">
        <button
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-base active:scale-90 transition-transform"
          onPointerDown={(e) => {
            e.stopPropagation();
            cancelAnimationFrame(animRef.current);
            השהה();
          }}
        >
          ⏸️
        </button>

        {/* לבבות או שעון טירוף */}
        {הואטירוף ? (
          <div className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-500 px-4 py-1 rounded-full border border-yellow-300/40 shadow-lg text-white font-bold">
            <span className="text-xl animate-pulse">⏱️</span>
            <span className="text-lg" style={{ fontFamily: '"Varela Round"' }}>
              {זמןטירוףנותר} ש׳
            </span>
          </div>
        ) : (
          <div className="flex gap-1">
            {לבבותמערך.map((פעיל, i) => (
              <motion.span
                key={i}
                animate={!פעיל ? { scale: [1, 0, 0.8], opacity: [1, 0, 0.3] } : {}}
                className="text-2xl leading-none"
              >
                {פעיל ? '❤️' : '🖤'}
              </motion.span>
            ))}
          </div>
        )}

        {/* מטבעות & שלב */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-yellow-500/20 border border-yellow-400/30 px-2.5 py-1 rounded-full text-xs font-bold text-yellow-300">
            <span>🪙</span>
            <span>{מטבעות}</span>
          </div>

          <div className="text-center">
            <div className="text-white/60 text-[10px] flex items-center justify-center gap-1" style={{ fontFamily: '"Varela Round"' }}>
              <span>{הואטירוף ? '⚡ 60 שניות' : מצבמשחק === 'יומי' ? '📅 אתגר' : `${קטגוריותסמל[קטגוריהנבחרת]} ${קטגוריהנבחרת}`}</span>
            </div>
            <div className="text-white font-bold text-sm" style={{ fontFamily: '"Varela Round"' }}>
              שלב {שלב}
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━ 2. ניקוד ומשוב (מופרד לחלוטין מבועת הדיבור של הדמות!) ━━━━ */}
      <div className="relative z-10 flex flex-col items-center py-1">
        <motion.div
          animate={ניקודקפיצה ? { scale: [1, 1.25, 1] } : {}}
          transition={{ duration: 0.2 }}
          className="text-white font-bold"
          style={{
            fontFamily: '"Varela Round"',
            fontSize: 'clamp(1.8rem, 8vw, 2.5rem)',
            textShadow: '0 0 25px rgba(100,200,255,0.4)',
          }}
        >
          {ניקוד.toLocaleString('he-IL')}
        </motion.div>

        <div className="text-white/40 text-xs flex items-center gap-2" style={{ fontFamily: '"Varela Round"' }}>
          <span>שיא: {שיאאישי.toLocaleString('he-IL')}</span>
          {האטהפעילה && <span className="text-cyan-300 font-bold">⏱️ הילוך איטי</span>}
          {מסלולנוכחי !== 'ישר' && (
            <span className="text-yellow-300/80 font-bold">
              {מסלולנוכחי === 'אלכסון' ? '↗️ אלכסון' : מסלולנוכחי === 'קשת' ? '〰️ קשת' : '🌀 סחרור'}
            </span>
          )}
        </div>

        {/* קומבו */}
        <AnimatePresence>
          {מכפיל > 1 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="mt-1 px-3 py-0.5 rounded-full text-xs font-bold shadow-lg"
              style={{
                background: 'linear-gradient(90deg, #f7971e, #ffd200)',
                color: '#1a0533',
                fontFamily: '"Varela Round"',
              }}
            >
              {תגיותמכפיל[Math.min(מכפיל, 5)]}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🎯 הודעת תגובה ממוקמת כאן למעלה - לא חופפת לדמות! */}
        <div className="h-8 flex items-center justify-center mt-1">
          <AnimatePresence>
            {הודעה && (
              <motion.div
                key={הודעה + Math.random()}
                initial={{ scale: 0.6, opacity: 0, y: -10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                className="px-4 py-1 rounded-xl text-sm font-bold shadow-lg whitespace-nowrap"
                style={{
                  fontFamily: '"Varela Round"',
                  background: סטטוסבלוק === 'הצלחה'
                    ? 'linear-gradient(135deg, #11998e, #38ef7d)'
                    : סטטוסבלוק === 'כמעט'
                    ? 'linear-gradient(135deg, #f7971e, #ffd200)'
                    : 'linear-gradient(135deg, #f7797d, #fb8c00)',
                  color: סטטוסבלוק === 'כמעט' ? '#333' : 'white',
                  direction: 'rtl',
                }}
              >
                {הודעה}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ━━━━ 3. אזור המגנטים והאימפקט ━━━━ */}
      <div className="flex-1 relative flex flex-col items-center justify-center px-2">
        {/* מטבעות שנוספו */}
        <AnimatePresence>
          {coinsPop && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -40, scale: 1.2 }}
              exit={{ opacity: 0 }}
              className="absolute z-40 text-yellow-300 font-bold text-base bg-black/50 px-3 py-1 rounded-full border border-yellow-400/50 shadow-xl"
            >
              +{coinsPop} 🪙
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ring ripple effect */}
        {rings.map((ringId) => (
          <motion.div
            key={ringId}
            className="absolute rounded-full border-4 border-yellow-300 pointer-events-none"
            initial={{ width: 20, height: 20, opacity: 0.9, scale: 1 }}
            animate={{ width: 320, height: 320, opacity: 0, scale: 1.25 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onAnimationComplete={() => setRings((prev) => prev.filter((r) => r !== ringId))}
          />
        ))}

        {/* Floating phrase text */}
        <AnimatePresence>
          {floatingText && (
            <motion.div
              key={floatingText.id}
              initial={{ opacity: 0, y: 0, scale: 0.7 }}
              animate={{ opacity: 1, y: -70, scale: 1.2 }}
              exit={{ opacity: 0, y: -110 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="absolute z-30 font-bold px-5 py-2 rounded-2xl text-white shadow-2xl pointer-events-none whitespace-nowrap"
              style={{
                fontFamily: '"Varela Round"',
                fontSize: '1.4rem',
                background: floatingText.isGold
                  ? 'linear-gradient(135deg, #f7971e, #ffd200)'
                  : 'linear-gradient(135deg, #11998e, #38ef7d)',
                boxShadow: floatingText.isGold ? '0 0 35px rgba(255,210,0,0.9)' : '0 0 35px rgba(56,239,125,0.8)',
                direction: 'rtl',
                color: floatingText.isGold ? '#1a0533' : 'white',
              }}
              onAnimationComplete={() => setFloatingText(null)}
            >
              ✨ {floatingText.text} ✨
            </motion.div>
          )}
        </AnimatePresence>

        {/* מגנטים */}
        <div className="flex items-center justify-center w-full relative">
          <motion.div
            className="absolute w-0.5 h-20 rounded-full pointer-events-none"
            animate={{
              background: באזורפגיעה
                ? ['rgba(255,220,50,0.9)', 'rgba(255,150,0,0.9)', 'rgba(255,220,50,0.9)']
                : 'rgba(255,255,255,0.1)',
              boxShadow: באזורפגיעה
                ? ['0 0 20px rgba(255,220,50,0.6)', '0 0 40px rgba(255,150,0,0.8)', '0 0 20px rgba(255,220,50,0.6)']
                : 'none',
            }}
            transition={{ duration: 0.35, repeat: באזורפגיעה ? Infinity : 0 }}
          />

          {ביטוינוכחי && (
            <>
              <MagnetBlock
                טקסט={ביטוינוכחי.שמאל}
                צד="שמאל"
                סטטוס={סטטוסבלוק}
                עמדה={עמדה}
                סקין={סקיןפעיל}
                בלוקמיוחד={בלוקמיוחדנוכחי}
                מסלול={מסלולנוכחי}
              />
              <div className="w-4 flex-shrink-0" />
              <MagnetBlock
                טקסט={ביטוינוכחי.ימין}
                צד="ימין"
                סטטוס={סטטוסבלוק}
                עמדה={עמדה}
                סקין={סקיןפעיל}
                בלוקמיוחד={בלוקמיוחדנוכחי}
                מסלול={מסלולנוכחי}
              />
            </>
          )}
        </div>
      </div>

      {/* ━━━━ 4. דמות מגנטי המנחה (מותאמת לסקין) + כפתור הקש מעוצב היטב ━━━━ */}
      <div className="relative z-10 pb-safe-bottom pb-4 px-5 flex flex-col items-center gap-3">
        {/* 🐣 מגנטי המנחה - מותאם לסקין הפעיל */}
        <div className="w-full flex justify-center">
          <MascotMagneti מצב={מגנטימצב} סקין={סקיןפעיל} קומבו={מכפיל} />
        </div>

        {/* 🔘 כפתור הקש עכשיו - מסודר, מרווח ולא מעוך! */}
        <motion.div
          className="w-full min-h-[52px] h-14 rounded-2xl flex items-center justify-center text-base font-bold pointer-events-none shadow-xl border border-white/10"
          animate={{
            background: בלוקמיוחדנוכחי === 'פצצה'
              ? 'linear-gradient(135deg, #e52d27, #b31217)'
              : באזורפגיעה
              ? ['linear-gradient(135deg, #f7971e, #ffd200)', 'linear-gradient(135deg, #ffd200, #f7971e)']
              : 'rgba(255,255,255,0.08)',
            scale: באזורפגיעה ? [1, 1.02, 1] : 1,
          }}
          transition={{ duration: 0.3, repeat: באזורפגיעה ? Infinity : 0 }}
          style={{ fontFamily: '"Varela Round"' }}
        >
          <span className="text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            {בלוקמיוחדנוכחי === 'פצצה'
              ? '⚠️ פצצה! אל תקיש!'
              : באזורפגיעה
              ? '⚡ הקש עכשיו!'
              : סטטוסבלוק === 'הצלחה'
              ? '✅ כל הכבוד!'
              : '🧲 היה מוכן...'}
          </span>
        </motion.div>

        {/* סרגל זמן טירוף או קצב */}
        {הואטירוף ? (
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                background: 'linear-gradient(90deg, #ef4444, #f59e0b)',
                width: `${(זמןטירוףנותר / 60) * 100}%`,
              }}
            />
          </div>
        ) : (
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                background: 'linear-gradient(90deg, #4facfe, #00f2fe)',
                width: `${Math.min(((שלב - 1) / 35) * 100, 100)}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Level Up Overlay */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.3 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center"
            style={{ background: 'rgba(15,12,41,0.92)' }}
          >
            <div className="text-8xl mb-4">🚀</div>
            <h2 className="text-4xl font-bold text-yellow-400 mb-2" style={{ fontFamily: '"Varela Round"' }}>
              עלית שלב!
            </h2>
            <p className="text-white text-xl font-bold" style={{ fontFamily: '"Varela Round"' }}>
              השלמת {הצלחות} ביטויים! 🔥
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause Overlay */}
      <AnimatePresence>
        {סטטוס === 'מושהה' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center bg-black/90"
            style={{ direction: 'rtl' }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="text-7xl mb-4">⏸️</div>
            <h2 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: '"Varela Round"' }}>
              המשחק מושהה
            </h2>

            <div className="w-full max-w-xs flex flex-col gap-3">
              <button
                onClick={() => המשך()}
                className="w-full py-4 rounded-2xl font-bold text-xl text-white bg-gradient-to-r from-amber-500 to-yellow-400 text-purple-950 shadow-lg"
              >
                ▶️ המשך משחק
              </button>
              <button
                onClick={() => {
                  useGameStore.getState().אפסמשחק();
                  שנהמסך('פתיחה');
                }}
                className="w-full py-4 rounded-2xl font-bold text-white bg-white/10 border border-white/20"
              >
                🏠 יציאה לתפריט
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
