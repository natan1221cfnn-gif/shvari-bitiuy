import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useSound } from '../hooks/useSound';
import { useHaptic } from '../hooks/useHaptic';
import { כלהביטויים } from '../data/phrases';
import {
  createDuelRoom,
  joinDuelRoom,
  getDuelRoom,
  updateDuelPlayer,
  restartDuelRoom,
  shareLinkGeneric,
  type DuelRoom,
} from '../data/duelCloud';
import type { ביטוי } from '../types';

export function DuelScreen({ initialRoomId }: { initialRoomId?: string | null }) {
  const { שםשחקן, שנהמסך, סקיןפעיל } = useGameStore();
  const { נגןהצלחה, נגןכישלון, נגןרמהחדשה, נגןקומבו, נגןתקתוק } = useSound();
  const { רטטהצלחה, רטטכישלון, רטטקומבו } = useHaptic();

  const [חדר, setחדר] = useState<DuelRoom | null>(null);
  const [תפקיד, setתפקיד] = useState<'host' | 'guest'>('host');
  const [קודקלט, setקודקלט] = useState('');
  const [הודעתשיתוף, setהודעתשיתוף] = useState<string | null>(null);
  const [טוען, setטוען] = useState(false);
  const [ספירהלאחור, setספירהלאחור] = useState<number | null>(null);

  // משתני המשחק של השחקן המקומי
  const [אינדקסנוכחי, setאינדקסנוכחי] = useState(0);
  const [ניקודמקומי, setניקודמקומי] = useState(0);
  const [פגיעותמקומיות, setפגיעותמקומיות] = useState(0);
  const [סטטוססבב, setסטטוססבב] = useState<'ממתין' | 'רץ' | 'הצלחה' | 'פספוס'>('ממתין');
  const [התקדמות, setהתקדמות] = useState(0);

  const התחלהRef = useRef(0);
  const animRef = useRef(0);
  const roundActiveRef = useRef(false);
  const tappedRef = useRef(false);

  // רשימת הביטויים לקרב
  const ביטוייקרב: ביטוי[] = (חדר?.phrasesIndices || []).map((idx) => כלהביטויים[idx % כלהביטויים.length]);
  const ביטוינוכחי = ביטוייקרב[אינדקסנוכחי] || כלהביטויים[0];

  // 1. חיבור אוטומטי אם יש room ב-URL
  useEffect(() => {
    if (initialRoomId) {
      setטוען(true);
      joinDuelRoom(initialRoomId, שםשחקן).then((joined) => {
        setטוען(false);
        if (joined) {
          setחדר(joined);
          setתפקיד('guest');
        }
      });
    }
  }, [initialRoomId, שםשחקן]);

  // 2. פולינג רציף לסנכרון החדר
  useEffect(() => {
    if (!חדר) return;
    const interval = setInterval(() => {
      getDuelRoom(חדר.id).then((updated) => {
        if (updated) {
          setחדר(updated);

          // התחלת ספירה לאחור כשהיריב הצטרף
          if (updated.status === 'countdown' && ספירהלאחור === null) {
            setספירהלאחור(3);
          }
        }
      });
    }, 900);

    return () => clearInterval(interval);
  }, [חדר, ספירהלאחור]);

  // 3. ניהול ספירה לאחור (3... 2... 1... צאו לדרך!)
  useEffect(() => {
    if (ספירהלאחור === null) return;
    if (ספירהלאחור > 0) {
      נגןתקתוק();
      const timer = setTimeout(() => setספירהלאחור(ספירהלאחור - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // סיום ספירה לאחור -> התחלת הקרב
      נגןרמהחדשה();
      setספירהלאחור(null);
      setאינדקסנוכחי(0);
      setניקודמקומי(0);
      setפגיעותמקומיות(0);
      setסטטוססבב('רץ');
      התחלסבב(0);
    }
  }, [ספירהלאחור]);

  // 4. לולאת אנימציה של המגנט שזז לכיוון השחקן (מהירות 2.2 שניות)
  const מהירותקרב = 2200;
  const התחלסבב = (אינדקס: number) => {
    cancelAnimationFrame(animRef.current);
    setאינדקסנוכחי(אינדקס);
    setסטטוססבב('רץ');
    setהתקדמות(0);
    tappedRef.current = false;
    roundActiveRef.current = true;
    התחלהRef.current = performance.now();

    const loop = (now: number) => {
      if (!roundActiveRef.current) return;
      const elapsed = now - התחלהRef.current;
      const prog = elapsed / מהירותקרב;
      setהתקדמות(Math.min(prog, 1.15));

      if (prog >= 1.15) {
        // פספוס - עבר את המגנט
        roundActiveRef.current = false;
        setסטטוססבב('פספוס');
        נגןכישלון();
        רטטכישלון();
        setTimeout(() => התחלסבב((אינדקס + 1) % (ביטוייקרב.length || 1)), 800);
      } else {
        animRef.current = requestAnimationFrame(loop);
      }
    };

    animRef.current = requestAnimationFrame(loop);
  };

  // 5. לחיצת שחקן על המגנט
  const handleTap = () => {
    if (!roundActiveRef.current || tappedRef.current || חדר?.status === 'ended') return;
    tappedRef.current = true;
    roundActiveRef.current = false;
    cancelAnimationFrame(animRef.current);

    const now = performance.now();
    const elapsed = now - התחלהRef.current;
    const prog = elapsed / מהירותקרב;

    // חלון פגיעה מדויק
    if (prog >= 0.70 && prog <= 1.08) {
      const פגיעותחדשות = פגיעותמקומיות + 1;
      const ניקודחדש = ניקודמקומי + 150;
      setסטטוססבב('הצלחה');
      setפגיעותמקומיות(פגיעותחדשות);
      setניקודמקומי(ניקודחדש);
      נגןהצלחה();
      רטטהצלחה();

      // עדכון ענן
      if (חדר) {
        updateDuelPlayer(חדר.id, תפקיד, ניקודחדש, פגיעותחדשות).then((res) => {
          if (res) setחדר(res);
        });
      }

      if (פגיעותחדשות >= 10) {
        נגןקומבו();
        רטטקומבו(5);
      } else {
        setTimeout(() => התחלסבב(אינדקסנוכחי + 1), 600);
      }
    } else {
      setסטטוססבב('פספוס');
      נגןכישלון();
      רטטכישלון();
      setTimeout(() => התחלסבב(אינדקסנוכחי + 1), 800);
    }
  };

  // יצירת חדר
  const צורחדר = async () => {
    setטוען(true);
    const newRoom = await createDuelRoom(שםשחקן, כלהביטויים.length);
    setחדר(newRoom);
    setתפקיד('host');
    setטוען(false);
  };

  // הצטרפות לפי קוד
  const הצטרףלחדר = async () => {
    if (!קודקלט.trim()) return;
    setטוען(true);
    const joined = await joinDuelRoom(קודקלט.trim(), שםשחקן);
    setטוען(false);
    if (joined) {
      setחדר(joined);
      setתפקיד('guest');
    } else {
      setהודעתשיתוף('❌ חדר לא נמצא או פג תוקפו');
      setTimeout(() => setהודעתשיתוף(null), 3000);
    }
  };

  // שיתוף גנרי חכם (Native Web Share + העתקה)
  const שתףקישור = async () => {
    if (!חדר) return;
    const url = `${window.location.origin}${window.location.pathname}?room=${חדר.id}`;
    const text = `⚔️ ${שםשחקן} מזמין אותך לדו-קרב 1 על 1 בשברי ביטוי! 🧲 קוד חדר: ${חדר.id}\nמי מחבר יותר מהר? כנס עכשיו:`;
    const res = await shareLinkGeneric('דו-קרב שברי ביטוי ⚔️', text, url);
    if (res === 'copied') {
      setהודעתשיתוף('הקישור הועתק ללוח בהצלחה! 📋');
      setTimeout(() => setהודעתשיתוף(null), 3000);
    }
  };

  // קרב חוזר
  const קרבחוזר = async () => {
    if (!חדר) return;
    setטוען(true);
    const res = await restartDuelRoom(חדר.id, כלהביטויים.length);
    setטוען(false);
    if (res) {
      setחדר(res);
      setספירהלאחור(3);
    }
  };

  return (
    <div
      className="fixed inset-0 flex flex-col justify-between overflow-hidden select-none"
      style={{
        background: 'linear-gradient(160deg, #130924 0%, #29124e 50%, #0d061a 100%)',
        direction: 'rtl',
      }}
      onClick={חדר?.status === 'playing' || חדר?.status === 'countdown' ? handleTap : undefined}
    >
      {/* ━━ כותרת עליונה ━━ */}
      <div className="relative z-20 flex items-center justify-between px-4 pt-safe-top pt-4 pb-2 border-b border-white/10">
        <button
          onClick={() => {
            cancelAnimationFrame(animRef.current);
            שנהמסך('פתיחה');
          }}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-lg active:scale-95"
        >
          ✕
        </button>
        <h1 className="text-white font-bold text-xl" style={{ fontFamily: '"Varela Round"' }}>
          ⚔️ דו-קרב אונליין (1 על 1)
        </h1>
        <div className="text-xs bg-amber-500/20 text-yellow-300 font-bold px-3 py-1 rounded-full border border-amber-400/30">
          👤 {שםשחקן}
        </div>
      </div>

      {/* ━━ 1. לובי יצירת חדר / הצטרפות ━━ */}
      {!חדר && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-sm mx-auto w-full">
          <div className="text-center space-y-2">
            <div className="text-6xl animate-bounce">⚔️</div>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: '"Varela Round"' }}>
              קרב ישראלי ראש בראש
            </h2>
            <p className="text-white/60 text-xs" style={{ fontFamily: '"Varela Round"' }}>
              התחרו על אותם ביטויים בזמן אמת — הראשון שמגיע ל-10 פגיעות מנצח!
            </p>
          </div>

          <div className="w-full space-y-3">
            <button
              onClick={צורחדר}
              disabled={טוען}
              className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-purple-950 shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
              style={{ fontFamily: '"Varela Round"' }}
            >
              <span>🎲</span>
              <span>צור חדר קרב חדש</span>
            </button>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="הקלד קוד חדר (4 ספרות)"
                value={קודקלט}
                onChange={(e) => setקודקלט(e.target.value)}
                maxLength={4}
                className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-center text-white font-bold text-lg placeholder:text-white/30 focus:outline-none focus:border-yellow-400"
              />
              <button
                onClick={הצטרףלחדר}
                disabled={טוען || !קודקלט.trim()}
                className="px-5 py-3 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95 transition-all"
                style={{ fontFamily: '"Varela Round"' }}
              >
                הצטרף
              </button>
            </div>
          </div>

          {הודעתשיתוף && (
            <div className="p-3 bg-red-500/20 border border-red-400/40 rounded-xl text-red-300 text-xs font-bold text-center">
              {הודעתשיתוף}
            </div>
          )}
        </div>
      )}

      {/* ━━ 2. חדר נוצר — ממתין ליריב ━━ */}
      {חדר && חדר.status === 'waiting' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-sm mx-auto w-full text-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-amber-500/20 border-2 border-yellow-400 flex items-center justify-center text-4xl animate-pulse">
              ⏳
            </div>
            <div className="absolute inset-0 rounded-full border border-yellow-400/40 animate-ping"></div>
          </div>

          <div>
            <div className="text-white/60 text-xs mb-1 font-bold">קוד החדר שלך:</div>
            <div className="text-4xl font-extrabold text-yellow-300 tracking-widest bg-white/10 px-6 py-2 rounded-2xl border border-white/20 inline-block">
              {חדר.id}
            </div>
          </div>

          <p className="text-white/70 text-sm font-bold" style={{ fontFamily: '"Varela Round"' }}>
            שלח את הקישור לחבר כדי להתחיל בקרב!
          </p>

          <button
            onClick={שתףקישור}
            className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            style={{ fontFamily: '"Varela Round"' }}
          >
            <span>📤</span>
            <span>שתף קישור קרב לחבר</span>
          </button>

          {הודעתשיתוף && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-300 text-xs font-bold animate-fade-in">
              {הודעתשיתוף}
            </div>
          )}
        </div>
      )}

      {/* ━━ 3. ספירה לאחור דרמטית (3... 2... 1...) ━━ */}
      {ספירהלאחור !== null && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md p-6 text-center">
          <div className="flex items-center justify-center gap-6 mb-8 w-full max-w-xs">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-yellow-400 flex items-center justify-center text-3xl mb-1">
                🧲
              </div>
              <span className="text-white font-bold text-sm">{חדר?.hostName}</span>
            </div>

            <div className="text-3xl font-extrabold text-red-500 animate-pulse">VS</div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 border-2 border-indigo-400 flex items-center justify-center text-3xl mb-1">
                🧲
              </div>
              <span className="text-white font-bold text-sm">{חדר?.guestName || 'יריב'}</span>
            </div>
          </div>

          <motion.div
            key={ספירהלאחור}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="text-8xl font-black text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)]"
            style={{ fontFamily: '"Varela Round"' }}
          >
            {ספירהלאחור === 0 ? 'צאו!' : ספירהלאחור}
          </motion.div>
        </div>
      )}

      {/* ━━ 4. מסך הקרב הפעיל (Live Battle) ━━ */}
      {חדר && (חדר.status === 'playing' || חדר.status === 'countdown') && (
        <div className="flex-1 flex flex-col justify-between p-4 relative z-10">
          {/* סרגל קרב עליון (Battle Health Bars) */}
          <div className="w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 shadow-lg flex items-center justify-between gap-4">
            {/* שחקן מארח */}
            <div className="flex-1 text-right">
              <div className="flex items-center justify-between text-xs text-yellow-300 font-bold mb-1">
                <span>{חדר.hostName}</span>
                <span>{תפקיד === 'host' ? פגיעותמקומיות : חדר.hostHits}/10 🎯</span>
              </div>
              <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                  style={{
                    width: `${((תפקיד === 'host' ? פגיעותמקומיות : חדר.hostHits) / 10) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="text-sm font-extrabold text-red-400">⚔️</div>

            {/* שחקן אורח */}
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between text-xs text-indigo-300 font-bold mb-1">
                <span>{חדר.guestHits}/10 🎯</span>
                <span>{חדר.guestName || 'יריב'}</span>
              </div>
              <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                  style={{
                    width: `${((תפקיד === 'guest' ? פגיעותמקומיות : חדר.guestHits) / 10) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* אזור המשחק והמגנטים */}
          <div className="flex-1 flex flex-col items-center justify-center relative my-4">
            {/* מגנט היעד התחתון של השחקן */}
            <div className="absolute bottom-8 w-44 h-16 rounded-2xl bg-white/10 border-2 border-dashed border-yellow-400/60 flex items-center justify-center shadow-inner">
              <span className="text-2xl font-bold text-yellow-300">{ביטוינוכחי.ימין}</span>
            </div>

            {/* המגנט שזז לעבר השחקן */}
            <motion.div
              style={{
                position: 'absolute',
                top: `${התקדמות * 75}%`,
              }}
              className={`w-44 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-2xl transition-transform ${
                סטטוססבב === 'הצלחה'
                  ? 'bg-emerald-500 text-white scale-110 border-2 border-white'
                  : סטטוססבב === 'פספוס'
                  ? 'bg-red-500 text-white border-2 border-white opacity-80'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-purple-950 border-2 border-white'
              }`}
            >
              <span>{ביטוינוכחי.שמאל}</span>
            </motion.div>
          </div>

          {/* כפתור הקשה גדול */}
          <div className="w-full pb-safe-bottom pb-4">
            <button
              onClick={handleTap}
              className="w-full py-5 rounded-3xl font-bold text-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-purple-950 shadow-2xl active:scale-95 transition-all border-2 border-white"
              style={{ fontFamily: '"Varela Round"' }}
            >
              חבר עכשיו! 🧲
            </button>
          </div>
        </div>
      )}

      {/* ━━ 5. מסך ניצחון / סיום הקרב ━━ */}
      {חדר && חדר.status === 'ended' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-sm mx-auto w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-8xl mb-2"
          >
            {חדר.winner === שםשחקן ? '🏆' : '🥈'}
          </motion.div>

          <div>
            <h2 className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: '"Varela Round"' }}>
              {חדר.winner === שםשחקן ? 'ניצחת בקרב! 🎉' : `${חדר.winner} ניצח בקרב!`}
            </h2>
            <p className="text-white/60 text-sm" style={{ fontFamily: '"Varela Round"' }}>
              {חדר.hostName} ({חדר.hostHits}) — {חדר.guestName} ({חדר.guestHits})
            </p>
          </div>

          <div className="w-full space-y-3">
            <button
              onClick={קרבחוזר}
              disabled={טוען}
              className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-purple-950 shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
              style={{ fontFamily: '"Varela Round"' }}
            >
              <span>🔄</span>
              <span>קרב חוזר (נקמה!)</span>
            </button>

            <button
              onClick={שתףקישור}
              className="w-full py-3.5 rounded-2xl font-bold text-base bg-white/10 hover:bg-white/15 border border-white/20 text-white active:scale-95 transition-all flex items-center justify-center gap-2"
              style={{ fontFamily: '"Varela Round"' }}
            >
              <span>📤</span>
              <span>שתף תוצאה</span>
            </button>

            <button
              onClick={() => שנהמסך('פתיחה')}
              className="w-full py-3 text-white/60 hover:text-white text-sm font-bold"
            >
              חזרה לעמוד הבית 🏠
            </button>
          </div>

          {הודעתשיתוף && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-300 text-xs font-bold animate-fade-in">
              {הודעתשיתוף}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
