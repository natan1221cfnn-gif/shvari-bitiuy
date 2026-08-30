import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { טעןשיאיםמהענן, שמוררשימתשיאיםמלאהבענן, אותחייםומונהמחוברים } from '../data/cloudLeaderboard';
import { טעןדירוגערים } from '../data/cityBattlesCloud';
import type { שיא, עירמידע } from '../types';

export function AdminScreen() {
  const { שנהמסך, שםשחקן } = useGameStore();
  const [רשימתשיאים, setרשימתשיאים] = useState<שיא[]>([]);
  const [דירוגערים, setדירוגערים] = useState<עירמידע[]>([]);
  const [מחוברים, setמחוברים] = useState(1);
  const [טוען, setטוען] = useState(true);
  const [שומר, setשומר] = useState(false);
  const [הודעה, setהודעה] = useState<string | null>(null);

  // טפסי הוספה/עריכה
  const [שםחדש, setשםחדש] = useState('');
  const [ניקודחדש, setניקודחדש] = useState<number>(10000);
  const [רמהחדשה, setרמהחדשה] = useState<'קל' | 'בינוני' | 'מטורף'>('מטורף');
  const [שלבחדש, setשלבחדש] = useState<number>(20);

  const isAdmin = שםשחקן.includes('מוח מבריק');

  useEffect(() => {
    let unmounted = false;
    Promise.all([טעןשיאיםמהענן(), טעןדירוגערים(), אותחייםומונהמחוברים()]).then(
      ([scores, cities, pres]) => {
        if (!unmounted) {
          setרשימתשיאים(scores);
          setדירוגערים(cities);
          setמחוברים(pres);
          setטוען(false);
        }
      }
    );
    return () => {
      unmounted = true;
    };
  }, []);

  const עדכןניקוד = (אינדקס: number, ערך: number) => {
    const מעודכן = [...רשימתשיאים];
    מעודכן[אינדקס].ניקוד = Math.max(0, ערך);
    setרשימתשיאים(מעודכן);
  };

  const מחקשחקן = (אינדקס: number) => {
    const מעודכן = רשימתשיאים.filter((_, i) => i !== אינדקס);
    setרשימתשיאים(מעודכן);
  };

  const הוסףשחקןידנית = () => {
    if (!שםחדש.trim()) return;
    const רשומה: שיא = {
      שם: שםחדש.trim(),
      ניקוד: Number(ניקודחדש) || 1000,
      תאריך: new Date().toLocaleDateString('he-IL'),
      רמה: רמהחדשה,
      שלב: Number(שלבחדש) || 1,
      מצב: 'רגיל',
    };
    const מעודכן = [רשומה, ...רשימתשיאים].sort((a, b) => b.ניקוד - a.ניקוד);
    setרשימתשיאים(מעודכן);
    setשםחדש('');
    setניקודחדש(10000);
  };

  const שמורלענן = async () => {
    setשומר(true);
    const הצלחה = await שמוררשימתשיאיםמלאהבענן(רשימתשיאים);
    setשומר(false);
    if (הצלחה) {
      setהודעה('✅ כל הנתונים נשמרו בהצלחה בענן והופצו לכל השחקנים בעולם!');
    } else {
      setהודעה('❌ שגיאה בשמירה לענן.');
    }
    setTimeout(() => setהודעה(null), 4000);
  };

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white p-6 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-red-400 mb-2">גישה מוגבלת למנהל בלבד</h2>
        <p className="text-white/60 text-sm mb-6">עמוד זה מיועד למנהל המערכת ("מוח מבריק") בלבד.</p>
        <button
          onClick={() => שנהמסך('פתיחה')}
          className="px-6 py-3 bg-white/10 rounded-2xl font-bold"
        >
          חזרה לתפריט ראשי
        </button>
      </div>
    );
  }

  // סטטיסטיקות
  const סךניקודכללי = רשימתשיאים.reduce((a, b) => a + (b.ניקוד || 0), 0);
  const ממוצעניקוד = רשימתשיאים.length > 0 ? Math.round(סךניקודכללי / רשימתשיאים.length) : 0;
  const שיאשיאים = רשימתשיאים[0]?.ניקוד || 0;

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden text-white"
      style={{
        background: 'radial-gradient(circle at 50% 10%, #150628 0%, #090212 60%, #030006 100%)',
        direction: 'rtl',
        fontFamily: '"Varela Round", sans-serif',
      }}
    >
      {/* 👑 כותרת עליונה של פאנל המנהל */}
      <div className="relative z-20 flex items-center justify-between px-4 pt-safe-top pt-4 pb-3 border-b border-amber-500/30 bg-black/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => שנהמסך('פתיחה')}
            className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-300 text-xl font-bold shadow-[0_0_15px_rgba(251,191,36,0.4)] active:scale-90"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-rose-400 bg-clip-text text-transparent flex items-center gap-2">
              <span>👑 פאנל ניהול ענן בלייב</span>
            </h1>
            <p className="text-[10px] text-amber-300/70 font-bold">מנהל מערכת: מוח מבריק 💡</p>
          </div>
        </div>

        <button
          onClick={שמורלענן}
          disabled={שומר}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 transition-all flex items-center gap-1.5"
        >
          <span>{שומר ? '💾 שומר...' : '💾 שמור וסנכרן לענן'}</span>
        </button>
      </div>

      {הודעה && (
        <div className="bg-emerald-500/20 border-b border-emerald-500/40 py-2 px-4 text-center text-xs font-bold text-emerald-300">
          {הודעה}
        </div>
      )}

      {/* 📊 תוכן פאנל הניהול */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* קוביות סטטיסטיקה בזמן אמת */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 shadow">
            <div className="text-white/50 text-[11px] font-bold">🟢 שחקנים מחוברים כרגע</div>
            <div className="text-2xl font-black text-cyan-300 mt-0.5">{מחוברים} מחוברים</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 shadow">
            <div className="text-white/50 text-[11px] font-bold">🏆 שיא ארצי מוביל</div>
            <div className="text-2xl font-black text-amber-300 mt-0.5">{שיאשיאים.toLocaleString('he-IL')}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-fuchsia-950/30 border border-fuchsia-500/30 shadow">
            <div className="text-white/50 text-[11px] font-bold">👥 שחקנים בטבלת השיאים</div>
            <div className="text-2xl font-black text-fuchsia-300 mt-0.5">{רשימתשיאים.length} שחקנים</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 shadow">
            <div className="text-white/50 text-[11px] font-bold">📈 ממוצע ניקוד בטבלה</div>
            <div className="text-2xl font-black text-purple-300 mt-0.5">{ממוצעניקוד.toLocaleString('he-IL')}</div>
          </div>
        </div>

        {/* ➕ טופס הוספת שחקן / שיא ידנית לענן */}
        <div className="p-4 rounded-3xl bg-white/5 border border-white/10 space-y-3">
          <h3 className="font-black text-base text-yellow-300 flex items-center gap-1.5">
            <span>➕ הוספת שחקן / שיא חדש ידנית לענן</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <input
              type="text"
              placeholder="שם השחקן (למשל: חבר של בוסיקו)"
              value={שםחדש}
              onChange={(e) => setשםחדש(e.target.value)}
              className="p-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
            />
            <input
              type="number"
              placeholder="ניקוד (למשל: 514037)"
              value={ניקודחדש}
              onChange={(e) => setניקודחדש(Number(e.target.value))}
              className="p-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
            />
            <select
              value={רמהחדשה}
              onChange={(e) => setרמהחדשה(e.target.value as any)}
              className="p-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs font-bold focus:outline-none"
            >
              <option value="מטורף">מטורף</option>
              <option value="בינוני">בינוני</option>
              <option value="קל">קל</option>
            </select>
            <button
              onClick={הוסףשחקןידנית}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs shadow"
            >
              הוסף לטבלה ✓
            </button>
          </div>
        </div>

        {/* 📋 רשימת השחקנים בענן ועריכה מהירה */}
        <div className="p-4 rounded-3xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-cyan-300">
              👥 רשימת כל השחקנים בענן (עריכה / הוספה / מחיקה בזמן אמת)
            </h3>
            <span className="text-xs text-white/40">{רשימתשיאים.length} שחקנים רשומים</span>
          </div>

          {טוען ? (
            <div className="text-center py-8 text-white/50">טוען נתונים מהענן...</div>
          ) : (
            <div className="space-y-2">
              {רשימתשיאים.map((ש, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-black/40 border border-white/10 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-[160px]">
                    <span className="font-black w-6 text-amber-400">{i + 1}.</span>
                    <span className="font-black text-sm text-white">{ש.שם}</span>
                    <span className="text-[10px] text-white/40">({ש.רמה})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-white/50">ניקוד:</span>
                    <input
                      type="number"
                      value={ש.ניקוד}
                      onChange={(e) => עדכןניקוד(i, Number(e.target.value))}
                      className="w-28 p-1.5 rounded-lg bg-white/10 border border-white/20 text-yellow-300 font-bold text-center text-xs"
                    />
                    <button
                      onClick={() => עדכןניקוד(i, ש.ניקוד + 50000)}
                      className="px-2 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] font-bold"
                    >
                      +50K
                    </button>
                    <button
                      onClick={() => עדכןניקוד(i, ש.ניקוד - 50000)}
                      className="px-2 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-lg text-[10px] font-bold"
                    >
                      -50K
                    </button>
                    <button
                      onClick={() => מחקשחקן(i)}
                      className="px-2.5 py-1 bg-red-600/30 text-red-300 border border-red-500/40 rounded-lg text-[10px] font-bold hover:bg-red-600"
                    >
                      🗑️ מחק
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
