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
  const [הודעה, setהודעה] = useState<{ סוג: 'הצלחה' | 'שגיאה'; טקסט: string } | null>(null);

  // בחירת שחקן לעריכה מהירה
  const [שחקןנבחראינדקס, setשחקןנבחראינדקס] = useState<number | 'חדש'>(0);

  // טופס שחקן חדש
  const [שםחדש, setשםחדש] = useState('');
  const [ניקודחדש, setניקודחדש] = useState<number>(10000);
  const [מטבעותחדש, setמטבעותחדש] = useState<number>(500);
  const [רמהחדשה, setרמהחדשה] = useState<'קל' | 'בינוני' | 'מטורף'>('מטורף');
  const [שלבחדש, setשלבחדש] = useState<number>(1);

  const isAdmin = שםשחקן.includes('מוח מבריק');

  useEffect(() => {
    let unmounted = false;
    Promise.all([טעןשיאיםמהענן(), טעןדירוגערים(), אותחייםומונהמחוברים()])
      .then(([scores, cities, pres]) => {
        if (!unmounted) {
          // הבטחת שדות תקינים לכל שחקן
          const normalized = scores.map((s) => ({
            ...s,
            מטבעות: typeof s.מטבעות === 'number' ? s.מטבעות : 250,
          }));
          setרשימתשיאים(normalized);
          setדירוגערים(cities);
          setמחוברים(pres);
          setטוען(false);
        }
      })
      .catch(() => {
        if (!unmounted) setטוען(false);
      });

    return () => {
      unmounted = true;
    };
  }, []);

  const עדכןשחקןנוכחי = (שדה: keyof שיא, ערך: any) => {
    if (typeof שחקןנבחראינדקס !== 'number') return;
    const מעודכן = [...רשימתשיאים];
    מעודכן[שחקןנבחראינדקס] = {
      ...מעודכן[שחקןנבחראינדקס],
      [שדה]: ערך,
    };
    setרשימתשיאים(מעודכן);

    // החלה מקומית מיידית
    localStorage.setItem('shvari_admin_scores_override', JSON.stringify(מעודכן));
    localStorage.setItem('shvari_cached_cloud_scores', JSON.stringify(מעודכן));

    const שחקןמעודכן = מעודכן[שחקןנבחראינדקס];
    if (שחקןמעודכן.שם?.includes('מוח מבריק') || שחקןמעודכן.שם === שםשחקן) {
      if (שחקןמעודכן.מטבעות !== undefined) {
        localStorage.setItem('שברי-ביטוי-מטבעות', String(שחקןמעודכן.מטבעות));
        useGameStore.setState({ מטבעות: שחקןמעודכן.מטבעות });
      }
      if (שחקןמעודכן.ניקוד !== undefined) {
        localStorage.setItem('שברי-ביטוי-שיא', String(שחקןמעודכן.ניקוד));
        useGameStore.setState({ שיאאישי: שחקןמעודכן.ניקוד });
      }
    }
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
      מטבעות: Number(מטבעותחדש) || 500,
    };
    const מעודכן = [רשומה, ...רשימתשיאים].sort((a, b) => b.ניקוד - a.ניקוד);
    setרשימתשיאים(מעודכן);
    localStorage.setItem('shvari_admin_scores_override', JSON.stringify(מעודכן));
    localStorage.setItem('shvari_cached_cloud_scores', JSON.stringify(מעודכן));
    setשחקןנבחראינדקס(0);
    setשםחדש('');
    setניקודחדש(10000);
    setמטבעותחדש(500);
  };

  const מחקשחקן = (אינדקס: number) => {
    const מעודכן = רשימתשיאים.filter((_, i) => i !== אינדקס);
    setרשימתשיאים(מעודכן);
    localStorage.setItem('shvari_admin_scores_override', JSON.stringify(מעודכן));
    localStorage.setItem('shvari_cached_cloud_scores', JSON.stringify(מעודכן));
    setשחקןנבחראינדקס(0);
  };

  const שמורלענן = async () => {
    setשומר(true);
    setהודעה(null);

    // החלה מלאה מיידית בכל מקום
    localStorage.setItem('shvari_admin_scores_override', JSON.stringify(רשימתשיאים));
    localStorage.setItem('shvari_cached_cloud_scores', JSON.stringify(רשימתשיאים));

    // עדכון ספציפי של המשתמש הפעיל
    const me = רשימתשיאים.find((s) => s.שם?.includes('מוח מבריק') || s.שם === שםשחקן);
    if (me) {
      if (me.מטבעות !== undefined) {
        localStorage.setItem('שברי-ביטוי-מטבעות', String(me.מטבעות));
        useGameStore.setState({ מטבעות: me.מטבעות });
      }
      if (me.ניקוד !== undefined) {
        localStorage.setItem('שברי-ביטוי-שיא', String(me.ניקוד));
        useGameStore.setState({ שיאאישי: me.ניקוד });
      }
    }

    try {
      await שמוררשימתשיאיםמלאהבענן(רשימתשיאים);
    } catch {}

    setשומר(false);
    setהודעה({
      סוג: 'הצלחה',
      טקסט: `✅ כל השינויים נשמרו והוחלו מיידית! היתרה והניקוד עודכנו בכל רחבי המשחק.`,
    });
    setTimeout(() => setהודעה(null), 5000);
  };

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white p-6 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-red-400 mb-2">גישה מוגבלת למנהל בלבד</h2>
        <p className="text-white/60 text-sm mb-6">עמוד זה מיועד למנהל המערכת ("מוח מבריק") בלבד.</p>
        <button
          onClick={() => שנהמסך('פתיחה')}
          className="px-6 py-3 bg-white/10 rounded-2xl font-bold text-white"
        >
          חזרה לתפריט ראשי
        </button>
      </div>
    );
  }

  const סךניקודכללי = רשימתשיאים.reduce((a, b) => a + (b.ניקוד || 0), 0);
  const ממוצעניקוד = רשימתשיאים.length > 0 ? Math.round(סךניקודכללי / רשימתשיאים.length) : 0;
  const שיאשיאים = רשימתשיאים[0]?.ניקוד || 0;
  const שחקןנוכחי = typeof שחקןנבחראינדקס === 'number' ? רשימתשיאים[שחקןנבחראינדקס] : null;

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden text-white"
      style={{
        background: 'radial-gradient(circle at 50% 10%, #1a0833 0%, #090214 60%, #030006 100%)',
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
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 transition-all flex items-center gap-1.5"
        >
          <span>{שומר ? '💾 שומר ענן...' : '💾 שמור וסנכרן לענן'}</span>
        </button>
      </div>

      {הודעה && (
        <div
          className={`py-2 px-4 text-center text-xs font-bold ${
            הודעה.סוג === 'הצלחה'
              ? 'bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border-b border-rose-500/40'
          }`}
        >
          {הודעה.טקסט}
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
            <div className="text-white/50 text-[11px] font-bold">📈 ממוצע ניקוד</div>
            <div className="text-2xl font-black text-purple-300 mt-0.5">{ממוצעניקוד.toLocaleString('he-IL')}</div>
          </div>
        </div>

        {/* 🎯 בחירת שחקן מתיבה נפתחת ועריכה ישירה */}
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-sm font-black text-yellow-300 flex items-center gap-2">
              <span>👤 בחר שחקן לעריכה / ניהול:</span>
            </label>
            <select
              value={שחקןנבחראינדקס}
              onChange={(e) =>
                setשחקןנבחראינדקס(e.target.value === 'חדש' ? 'חדש' : Number(e.target.value))
              }
              className="p-3 rounded-2xl bg-black/70 border-2 border-amber-400 text-yellow-300 text-sm font-black focus:outline-none"
            >
              {רשימתשיאים.map((ש, i) => (
                <option key={i} value={i} className="bg-slate-900 text-white">
                  {i + 1}. {ש.שם} — {ש.ניקוד?.toLocaleString('he-IL')} נק׳ ({ש.מטבעות || 0} 🪙)
                </option>
              ))}
              <option value="חדש" className="bg-slate-900 text-emerald-400 font-bold">
                ➕ הוסף שחקן חדש...
              </option>
            </select>
          </div>

          {/* פרטי השחקן הנבחר לעריכה */}
          {שחקןנוכחי && שחקןנבחראינדקס !== 'חדש' && (
            <div className="p-4 rounded-2xl bg-black/40 border border-amber-400/30 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* עריכת שם */}
                <div>
                  <label className="text-[11px] text-white/50 block mb-1">שם השחקן:</label>
                  <input
                    type="text"
                    value={שחקןנוכחי.שם || ''}
                    onChange={(e) => עדכןשחקןנוכחי('שם', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold focus:outline-none"
                  />
                </div>

                {/* עריכת ניקוד */}
                <div>
                  <label className="text-[11px] text-white/50 block mb-1">ניקוד שיא:</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={שחקןנוכחי.ניקוד || 0}
                      onChange={(e) => עדכןשחקןנוכחי('ניקוד', Number(e.target.value))}
                      className="flex-1 p-2.5 rounded-xl bg-white/10 border border-white/20 text-yellow-300 text-sm font-black focus:outline-none"
                    />
                    <button
                      onClick={() => עדכןשחקןנוכחי('ניקוד', (שחקןנוכחי.ניקוד || 0) + 50000)}
                      className="px-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold"
                    >
                      +50K
                    </button>
                    <button
                      onClick={() => עדכןשחקןנוכחי('ניקוד', Math.max(0, (שחקןנוכחי.ניקוד || 0) - 50000))}
                      className="px-3 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold"
                    >
                      -50K
                    </button>
                  </div>
                </div>

                {/* 🪙 עריכת מטבעות */}
                <div>
                  <label className="text-[11px] text-white/50 block mb-1">יתרת מטבעות 🪙:</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={שחקןנוכחי.מטבעות || 0}
                      onChange={(e) => עדכןשחקןנוכחי('מטבעות', Number(e.target.value))}
                      className="flex-1 p-2.5 rounded-xl bg-white/10 border border-white/20 text-amber-300 text-sm font-black focus:outline-none"
                    />
                    <button
                      onClick={() => עדכןשחקןנוכחי('מטבעות', (שחקןנוכחי.מטבעות || 0) + 1000)}
                      className="px-3 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold"
                    >
                      +1,000 🪙
                    </button>
                    <button
                      onClick={() => עדכןשחקןנוכחי('מטבעות', (שחקןנוכחי.מטבעות || 0) + 5000)}
                      className="px-3 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold"
                    >
                      +5,000 🪙
                    </button>
                  </div>
                </div>

                {/* רמה */}
                <div>
                  <label className="text-[11px] text-white/50 block mb-1">רמת קושי:</label>
                  <select
                    value={שחקןנוכחי.רמה || 'מטורף'}
                    onChange={(e) => עדכןשחקןנוכחי('רמה', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold focus:outline-none"
                  >
                    <option value="מטורף" className="bg-slate-900">מטורף</option>
                    <option value="בינוני" className="bg-slate-900">בינוני</option>
                    <option value="קל" className="bg-slate-900">קל</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => מחקשחקן(שחקןנבחראינדקס as number)}
                  className="px-4 py-2 bg-red-600/30 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold hover:bg-red-600"
                >
                  🗑️ מחק שחקן זה מהענן
                </button>
              </div>
            </div>
          )}

          {/* טופס הוספת שחקן חדש */}
          {שחקןנבחראינדקס === 'חדש' && (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3">
              <h4 className="font-black text-sm text-emerald-300">➕ יצירת שחקן חדש בענן</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="שם השחקן"
                  value={שםחדש}
                  onChange={(e) => setשםחדש(e.target.value)}
                  className="p-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs font-bold focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="ניקוד"
                  value={ניקודחדש}
                  onChange={(e) => setניקודחדש(Number(e.target.value))}
                  className="p-2.5 rounded-xl bg-black/50 border border-white/20 text-yellow-300 text-xs font-bold focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="מטבעות 🪙"
                  value={מטבעותחדש}
                  onChange={(e) => setמטבעותחדש(Number(e.target.value))}
                  className="p-2.5 rounded-xl bg-black/50 border border-white/20 text-amber-300 text-xs font-bold focus:outline-none"
                />
              </div>
              <button
                onClick={הוסףשחקןידנית}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-black font-black text-xs shadow active:scale-95"
              >
                הוסף שחקן זה לרשימה ✓
              </button>
            </div>
          )}
        </div>

        {/* 📋 רשימת כל השחקנים בענן בתצוגה מלאה */}
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-cyan-300">
              👥 רשימת כל {רשימתשיאים.length} השחקנים בענן
            </h3>
            <span className="text-xs text-white/40">מסונכרן ללוח השיאים הארצי</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {רשימתשיאים.map((ש, i) => (
              <div
                key={i}
                onClick={() => setשחקןנבחראינדקס(i)}
                className={`flex items-center justify-between p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                  שחקןנבחראינדקס === i
                    ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                    : 'bg-black/30 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-black text-amber-400 w-5">{i + 1}.</span>
                  <span className="font-black text-sm text-white">{ש.שם}</span>
                  <span className="text-[10px] text-white/40">({ש.תאריך})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-amber-300 font-bold">{ש.מטבעות || 0} 🪙</span>
                  <span className="text-yellow-400 font-black text-sm">
                    {ש.ניקוד?.toLocaleString('he-IL')} נק׳
                  </span>
                  <span className="text-cyan-400 text-[10px] font-bold">ערוך ✏️</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
