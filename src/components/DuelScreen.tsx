import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Peer, type DataConnection } from 'peerjs';
import { useGameStore } from '../store/gameStore';
import { useSound } from '../hooks/useSound';
import { useHaptic } from '../hooks/useHaptic';
import { כלהביטויים } from '../data/phrases';
import type { ביטוי } from '../types';

export function DuelScreen({ initialRoomId }: { initialRoomId?: string | null }) {
  const { שםשחקן, שנהמסך } = useGameStore();
  const { נגןהצלחה, נגןכישלון, נגןרמהחדשה, נגןקומבו, נגןתקתוק } = useSound();
  const { רטטהצלחה, רטטכישלון, רטטקומבו } = useHaptic();

  // מצבי חדר
  const [מצבמסך, setמצבמסך] = useState<'lobby' | 'creating' | 'waiting' | 'joining' | 'countdown' | 'playing' | 'ended'>('lobby');
  const [קודחדר, setקודחדר] = useState('');
  const [קודקלט, setקודקלט] = useState('');
  const [שםיריב, setשםיריב] = useState('');
  const [תפקיד, setתפקיד] = useState<'host' | 'guest'>('host');
  const [הודעתשגיאה, setהודעתשגיאה] = useState<string | null>(null);
  const [ספירהלאחור, setספירהלאחור] = useState<number | null>(null);
  const [מנצח, setמנצח] = useState<string | null>(null);

  // משתני המשחק
  const [ביטוייקרב, setביטוייקרב] = useState<ביטוי[]>([]);
  const [אינדקסנוכחי, setאינדקסנוכחי] = useState(0);
  const [פגיעותשלי, setפגיעותשלי] = useState(0);
  const [ניקודשלי, setניקודשלי] = useState(0);
  const [פגיעותיריב, setפגיעותיריב] = useState(0);
  const [התקדמות, setהתקדמות] = useState(0);
  const [סטטוססבב, setסטטוססבב] = useState<'רץ' | 'הצלחה' | 'פספוס'>('רץ');

  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const animRef = useRef(0);
  const התחלהRef = useRef(0);
  const roundActiveRef = useRef(false);
  const tappedRef = useRef(false);

  const ביטוינוכחי = ביטוייקרב[אינדקסנוכחי] || כלהביטויים[0];

  // 1. חיבור אוטומטי אם יש room ב-URL
  useEffect(() => {
    if (initialRoomId) {
      הצטרףלחדר(initialRoomId);
    }
  }, [initialRoomId]); // eslint-disable-line

  // ניקוי בעת יציאה
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animRef.current);
      connRef.current?.close();
      peerRef.current?.destroy();
    };
  }, []);

  // 2. יצירת חדר קרב חדש (Host)
  const צורחדר = () => {
    setמצבמסך('creating');
    setהודעתשגיאה(null);

    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    const peerId = `shvari_${randomCode}`;

    try {
      peerRef.current?.destroy();
      const peer = new Peer(peerId, { debug: 0 });
      peerRef.current = peer;

      peer.on('open', () => {
        setקודחדר(randomCode);
        setתפקיד('host');
        setמצבמסך('waiting');
      });

      peer.on('connection', (conn) => {
        connRef.current = conn;

        conn.on('open', () => {
          // יצירת ביטויים אקראיים
          const indices: number[] = [];
          while (indices.length < 15) {
            const r = Math.floor(Math.random() * כלהביטויים.length);
            if (!indices.includes(r)) indices.push(r);
          }

          // שליחת פתיחת משחק לאורח
          conn.send({
            type: 'START_MATCH',
            hostName: שםשחקן,
            indices,
          });

          const phrases = indices.map((i) => כלהביטויים[i % כלהביטויים.length]);
          setביטוייקרב(phrases);
          setספירהלאחור(3);
          setמצבמסך('countdown');
        });

        conn.on('data', (data: any) => {
          handleIncomingData(data);
        });

        conn.on('close', () => {
          setהודעתשגיאה('היריב התנתק מהקרב');
          setמצבמסך('lobby');
        });
      });

      peer.on('error', (err) => {
        console.error('Peer error:', err);
        // אם הקוד תפוס - נסה שוב
        if (err.type === 'unavailable-id') {
          צורחדר();
        } else {
          setהודעתשגיאה('שגיאה בחיבור לרשת. נסה שוב.');
          setמצבמסך('lobby');
        }
      });
    } catch {
      setהודעתשגיאה('שגיאה ביצירת החדר');
      setמצבמסך('lobby');
    }
  };

  // 3. הצטרפות לחדר קיים (Guest)
  const הצטרףלחדר = (codeToJoin?: string) => {
    const code = (codeToJoin || קודקלט).trim();
    if (!code) return;

    setמצבמסך('joining');
    setהודעתשגיאה(null);

    try {
      peerRef.current?.destroy();
      const guestPeer = new Peer({ debug: 0 });
      peerRef.current = guestPeer;

      guestPeer.on('open', () => {
        const targetId = `shvari_${code}`;
        const conn = guestPeer.connect(targetId, { reliable: true });
        connRef.current = conn;

        conn.on('open', () => {
          setתפקיד('guest');
          setקודחדר(code);
          conn.send({ type: 'GUEST_READY', guestName: שםשחקן });
        });

        conn.on('data', (data: any) => {
          handleIncomingData(data);
        });

        conn.on('close', () => {
          setהודעתשגיאה('החיבור עם החדר נותק');
          setמצבמסך('lobby');
        });
      });

      guestPeer.on('error', () => {
        setהודעתשגיאה('❌ חדר לא נמצא או שאינו מחובר כרגע');
        setמצבמסך('lobby');
      });

      // Timeout של 8 שניות אם לא מתחבר
      setTimeout(() => {
        if (connRef.current && !connRef.current.open) {
          setהודעתשגיאה('❌ חדר לא נמצא או שפג תוקפו');
          setמצבמסך('lobby');
        }
      }, 8000);
    } catch {
      setהודעתשגיאה('שגיאה בהתחברות');
      setמצבמסך('lobby');
    }
  };

  // 4. טיפול בהודעות נכנסות מהיריב
  const handleIncomingData = (data: any) => {
    if (!data) return;

    if (data.type === 'START_MATCH') {
      setשםיריב(data.hostName || 'יריב');
      const phrases = (data.indices || []).map((i: number) => כלהביטויים[i % כלהביטויים.length]);
      setביטוייקרב(phrases);
      setספירהלאחור(3);
      setמצבמסך('countdown');
    } else if (data.type === 'GUEST_READY') {
      setשםיריב(data.guestName || 'יריב');
    } else if (data.type === 'UPDATE_SCORE') {
      setפגיעותיריב(data.hits);
      if (data.hits >= 10 && !מנצח) {
        setמנצח(שםיריב || 'יריב');
        setמצבמסך('ended');
      }
    } else if (data.type === 'REMATCH') {
      const phrases = (data.indices || []).map((i: number) => כלהביטויים[i % כלהביטויים.length]);
      setביטוייקרב(phrases);
      setפגיעותשלי(0);
      setניקודשלי(0);
      setפגיעותיריב(0);
      setמנצח(null);
      setספירהלאחור(3);
      setמצבמסך('countdown');
    }
  };

  // 5. ניהול ספירה לאחור (3... 2... 1... צאו לדרך!)
  useEffect(() => {
    if (ספירהלאחור === null) return;
    if (ספירהלאחור > 0) {
      נגןתקתוק();
      const timer = setTimeout(() => setספירהלאחור(ספירהלאחור - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      נגןרמהחדשה();
      setספירהלאחור(null);
      setאינדקסנוכחי(0);
      setפגיעותשלי(0);
      setניקודשלי(0);
      setפגיעותיריב(0);
      setמנצח(null);
      setמצבמסך('playing');
      התחלסבב(0);
    }
  }, [ספירהלאחור]); // eslint-disable-line

  // 6. תנועת המגנט (2.2 שניות לסבב)
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

  // 7. לחיצה על המגנט
  const handleTap = () => {
    if (!roundActiveRef.current || tappedRef.current || מצבמסך !== 'playing') return;
    tappedRef.current = true;
    roundActiveRef.current = false;
    cancelAnimationFrame(animRef.current);

    const now = performance.now();
    const elapsed = now - התחלהRef.current;
    const prog = elapsed / מהירותקרב;

    if (prog >= 0.70 && prog <= 1.08) {
      const newHits = פגיעותשלי + 1;
      const newScore = ניקודשלי + 150;
      setסטטוססבב('הצלחה');
      setפגיעותשלי(newHits);
      setניקודשלי(newScore);
      נגןהצלחה();
      רטטהצלחה();

      // שידור מיידי ליריב
      connRef.current?.send({
        type: 'UPDATE_SCORE',
        hits: newHits,
        score: newScore,
      });

      if (newHits >= 10) {
        נגןקומבו();
        רטטקומבו(5);
        setמנצח(שםשחקן);
        setמצבמסך('ended');
      } else {
        setTimeout(() => התחלסבב((אינדקסנוכחי + 1) % (ביטוייקרב.length || 1)), 600);
      }
    } else {
      setסטטוססבב('פספוס');
      נגןכישלון();
      רטטכישלון();
      setTimeout(() => התחלסבב((אינדקסנוכחי + 1) % (ביטוייקרב.length || 1)), 800);
    }
  };

  // 8. שיתוף קישור קרב
  const שתףקישור = async () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${קודחדר}`;
    const text = `⚔️ ${שםשחקן} מזמין אותך לדו-קרב 1 על 1 בשברי ביטוי! 🧲\nקוד חדר: ${קודחדר}\nמי מחבר יותר מהר? כנס לקרב:`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'דו-קרב שברי ביטוי ⚔️', text, url });
        return;
      } catch { /* cancel */ }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setהודעתשגיאה('הקישור הועתק בהצלחה! 📋');
      setTimeout(() => setהודעתשגיאה(null), 3000);
    } catch { /* ignore */ }
  };

  // 9. קרב חוזר (נקמה)
  const קרבחוזר = () => {
    const indices: number[] = [];
    while (indices.length < 15) {
      const r = Math.floor(Math.random() * כלהביטויים.length);
      if (!indices.includes(r)) indices.push(r);
    }

    connRef.current?.send({
      type: 'REMATCH',
      indices,
    });

    const phrases = indices.map((i) => כלהביטויים[i % כלהביטויים.length]);
    setביטוייקרב(phrases);
    setפגיעותשלי(0);
    setניקודשלי(0);
    setפגיעותיריב(0);
    setמנצח(null);
    setספירהלאחור(3);
    setמצבמסך('countdown');
  };

  return (
    <div
      className="fixed inset-0 flex flex-col justify-between overflow-hidden select-none"
      style={{
        background: 'linear-gradient(160deg, #130924 0%, #29124e 50%, #0d061a 100%)',
        direction: 'rtl',
      }}
      onClick={מצבמסך === 'playing' ? handleTap : undefined}
    >
      {/* ━━ כותרת עליונה ━━ */}
      <div className="relative z-20 flex items-center justify-between px-4 pt-safe-top pt-4 pb-2 border-b border-white/10">
        <button
          onClick={() => {
            cancelAnimationFrame(animRef.current);
            connRef.current?.close();
            peerRef.current?.destroy();
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
      {מצבמסך === 'lobby' && (
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
                onClick={() => הצטרףלחדר()}
                disabled={!קודקלט.trim()}
                className="px-5 py-3 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95 transition-all disabled:opacity-50"
                style={{ fontFamily: '"Varela Round"' }}
              >
                הצטרף
              </button>
            </div>
          </div>

          {הודעתשגיאה && (
            <div className="p-3 bg-red-500/20 border border-red-400/40 rounded-xl text-red-300 text-xs font-bold text-center">
              {הודעתשגיאה}
            </div>
          )}
        </div>
      )}

      {/* ━━ 2. אנימציית יצירת חדר ━━ */}
      {מצבמסך === 'creating' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <h3 className="text-white font-bold text-lg" style={{ fontFamily: '"Varela Round"' }}>
            יוצר ומחבר חדר קרב ברשת... 🌐
          </h3>
          <p className="text-white/50 text-xs">פתיחת חיבור ישיר ומאובטח</p>
        </div>
      )}

      {/* ━━ 3. אנימציית הצטרפות ━━ */}
      {מצבמסך === 'joining' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <h3 className="text-white font-bold text-lg" style={{ fontFamily: '"Varela Round"' }}>
            מתחבר לחדר של היריב... ⚔️
          </h3>
          <p className="text-white/50 text-xs">יוצר חיבור ישיר בזמן אמת</p>
        </div>
      )}

      {/* ━━ 4. חדר מוכן — ממתין ליריב שיכנס ━━ */}
      {מצבמסך === 'waiting' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-sm mx-auto w-full text-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-amber-500/20 border-2 border-yellow-400 flex items-center justify-center text-4xl animate-pulse">
              ⏳
            </div>
            <div className="absolute inset-0 rounded-full border border-yellow-400/40 animate-ping"></div>
          </div>

          <div>
            <div className="text-white/60 text-xs mb-1 font-bold">החדר מוכן! קוד החדר שלך:</div>
            <div className="text-4xl font-extrabold text-yellow-300 tracking-widest bg-white/10 px-6 py-2 rounded-2xl border border-white/20 inline-block">
              {קודחדר}
            </div>
          </div>

          <p className="text-white/80 text-sm font-bold" style={{ fontFamily: '"Varela Round"' }}>
            שתף את הקישור או שלח את הקוד לחבר כדי להתחיל מיד!
          </p>

          <button
            onClick={שתףקישור}
            className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            style={{ fontFamily: '"Varela Round"' }}
          >
            <span>📤</span>
            <span>שתף קישור קרב לחבר</span>
          </button>

          {הודעתשגיאה && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-300 text-xs font-bold animate-fade-in">
              {הודעתשגיאה}
            </div>
          )}
        </div>
      )}

      {/* ━━ 5. ספירה לאחור דרמטית (3... 2... 1...) ━━ */}
      {מצבמסך === 'countdown' && ספירהלאחור !== null && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md p-6 text-center">
          <div className="flex items-center justify-center gap-6 mb-8 w-full max-w-xs">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-yellow-400 flex items-center justify-center text-3xl mb-1">
                🧲
              </div>
              <span className="text-white font-bold text-sm">{תפקיד === 'host' ? שםשחקן : שםיריב}</span>
            </div>

            <div className="text-3xl font-extrabold text-red-500 animate-pulse">VS</div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 border-2 border-indigo-400 flex items-center justify-center text-3xl mb-1">
                🧲
              </div>
              <span className="text-white font-bold text-sm">{תפקיד === 'guest' ? שםשחקן : (שםיריב || 'יריב')}</span>
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

      {/* ━━ 6. מסך הקרב הפעיל (Live Battle) ━━ */}
      {מצבמסך === 'playing' && (
        <div className="flex-1 flex flex-col justify-between p-4 relative z-10">
          {/* סרגל קרב עליון (Battle Health Bars) */}
          <div className="w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 shadow-lg flex items-center justify-between gap-4">
            {/* שחקן 1 */}
            <div className="flex-1 text-right">
              <div className="flex items-center justify-between text-xs text-yellow-300 font-bold mb-1">
                <span>{שםשחקן} (אני)</span>
                <span>{פגיעותשלי}/10 🎯</span>
              </div>
              <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                  style={{
                    width: `${(פגיעותשלי / 10) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="text-sm font-extrabold text-red-400">⚔️</div>

            {/* שחקן 2 (יריב) */}
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between text-xs text-indigo-300 font-bold mb-1">
                <span>{פגיעותיריב}/10 🎯</span>
                <span>{שםיריב || 'יריב'}</span>
              </div>
              <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                  style={{
                    width: `${(פגיעותיריב / 10) * 100}%`,
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

      {/* ━━ 7. מסך ניצחון / סיום הקרב ━━ */}
      {מצבמסך === 'ended' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-sm mx-auto w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-8xl mb-2"
          >
            {מנצח === שםשחקן ? '🏆' : '🥈'}
          </motion.div>

          <div>
            <h2 className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: '"Varela Round"' }}>
              {מנצח === שםשחקן ? 'ניצחת בקרב! 🎉' : `${מנצח || 'היריב'} ניצח בקרב!`}
            </h2>
            <p className="text-white/60 text-sm" style={{ fontFamily: '"Varela Round"' }}>
              {שםשחקן} ({פגיעותשלי}) — {שםיריב || 'יריב'} ({פגיעותיריב})
            </p>
          </div>

          <div className="w-full space-y-3">
            <button
              onClick={קרבחוזר}
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
              onClick={() => {
                connRef.current?.close();
                peerRef.current?.destroy();
                שנהמסך('פתיחה');
              }}
              className="w-full py-3 text-white/60 hover:text-white text-sm font-bold"
            >
              חזרה לעמוד הבית 🏠
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
