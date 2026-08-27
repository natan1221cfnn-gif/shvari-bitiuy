import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { טעןשיאיםמהענן, שלחשיאלענן } from '../data/cloudLeaderboard';
import type { שיא } from '../types';

const מדליות = ['🥇', '🥈', '🥉'];

export function LeaderboardScreen() {
  const { שיאים, שנהמסך, שםשחקן, שיאאישי, הגדרות } = useGameStore();
  const [טאב, setטאב] = useState<'אישי' | 'ארצי'>('ארצי');
  const [שיאיםענן, setשיאיםענן] = useState<שיא[]>([]);
  const [טוען, setטוען] = useState(true);

  useEffect(() => {
    let unmounted = false;
    טעןשיאיםמהענן().then((נתונים) => {
      if (!unmounted) {
        let רשימהמשולבת = [...נתונים];

        // אם יש לשחקן שיא אישי שלא מופיע ברשימת הענן, הוסף וסנכרן אותו מיד!
        if (שיאאישי > 0) {
          const השיאהכיטוב: שיא = שיאים[0] || {
            שם: שםשחקן,
            ניקוד: שיאאישי,
            תאריך: new Date().toLocaleDateString('he-IL'),
            רמה: הגדרות.רמה,
            שלב: 1,
            מצב: 'רגיל' as const,
          };

          const קיים = רשימהמשולבת.some((ש) => ש.שם === שםשחקן && ש.ניקוד >= שיאאישי);
          if (!קיים) {
            רשימהמשולבת = [...רשימהמשולבת.filter((ש) => ש.שם !== שםשחקן), השיאהכיטוב]
              .sort((a, b) => (b.ניקוד || 0) - (a.ניקוד || 0))
              .slice(0, 50);
            שלחשיאלענן(השיאהכיטוב);
          }
        }

        setשיאיםענן(רשימהמשולבת);
        setטוען(false);
      }
    });
    return () => {
      unmounted = true;
    };
  }, [שיאאישי, שיאים, שםשחקן, הגדרות.רמה]);

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        direction: 'rtl',
      }}
    >
      {/* כותרת עליונה */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-safe-top pt-5 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => שנהמסך('פתיחה')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-lg active:scale-95"
          >
            ←
          </button>
          <h1 className="text-white font-bold text-2xl" style={{ fontFamily: '"Varela Round"' }}>
            🏆 לוח שיאים
          </h1>
        </div>

        <div className="text-xs bg-yellow-400/20 text-yellow-300 font-bold px-3 py-1 rounded-full border border-yellow-400/30">
          👤 {שםשחקן}
        </div>
      </div>

      {/* טאבים: ארצי (זמן אמת) / אישי */}
      <div className="p-4 flex gap-2">
        <button
          onClick={() => setטאב('ארצי')}
          className={`flex-1 py-2.5 rounded-2xl font-bold text-sm transition-all ${
            טאב === 'ארצי'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-purple-950 shadow-lg'
              : 'bg-white/10 text-white'
          }`}
          style={{ fontFamily: '"Varela Round"' }}
        >
          🇮🇱 שיאים ארציים (זמן אמת)
        </button>
        <button
          onClick={() => setטאב('אישי')}
          className={`flex-1 py-2.5 rounded-2xl font-bold text-sm transition-all ${
            טאב === 'אישי'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-purple-950 shadow-lg'
              : 'bg-white/10 text-white'
          }`}
          style={{ fontFamily: '"Varela Round"' }}
        >
          👤 השיאים שלי
        </button>
      </div>

      {/* תוכן הלוח */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2.5">
        {טאב === 'ארצי' ? (
          טוען ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-4xl animate-spin mb-3">🌀</div>
              <p className="text-white/60 font-bold text-sm" style={{ fontFamily: '"Varela Round"' }}>
                טוען שיאים אמיתיים מהשרת...
              </p>
            </div>
          ) : שיאיםענן.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-6xl mb-3">🎯</div>
              <p className="text-white font-bold text-base mb-1" style={{ fontFamily: '"Varela Round"' }}>
                טרם נרשמו שיאים בענן
              </p>
              <p className="text-white/50 text-xs" style={{ fontFamily: '"Varela Round"' }}>
                שחק עכשיו והיה הראשון שנכנס ללוח השיאים הארצי!
              </p>
            </div>
          ) : (
            שיאיםענן.map((שיא, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-3.5 p-3.5 rounded-2xl ${
                  שיא.שם === שםשחקן
                    ? 'bg-amber-500/20 border-2 border-yellow-400/80 shadow-lg'
                    : i === 0
                    ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border border-yellow-400/40'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <span className="text-2xl font-bold w-8 text-center">{מדליות[i] ?? `${i + 1}.`}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-base truncate flex items-center gap-1.5" style={{ fontFamily: '"Varela Round"' }}>
                    <span>{שיא.שם || 'שחקן אנונימי'}</span>
                    {שיא.שם === שםשחקן && (
                      <span className="text-[10px] bg-yellow-400 text-purple-950 px-1.5 py-0.2 rounded-md font-bold">
                        אני
                      </span>
                    )}
                  </div>
                  <div className="text-white/40 text-xs truncate" style={{ fontFamily: '"Varela Round"' }}>
                    שלב {שיא.שלב} · {שיא.מצב === 'טירוף' ? '⚡ 60 שניות' : `רמה ${שיא.רמה}`} · {שיא.תאריך}
                  </div>
                </div>
                <div className="text-yellow-400 font-bold text-lg" style={{ fontFamily: '"Varela Round"' }}>
                  {שיא.ניקוד.toLocaleString('he-IL')}
                </div>
              </motion.div>
            ))
          )
        ) : (
          שיאים.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-6xl mb-3">🎮</div>
              <p className="text-white/80 font-bold text-base mb-1" style={{ fontFamily: '"Varela Round"' }}>
                שלום {שםשחקן}!
              </p>
              <p className="text-white/40 text-xs" style={{ fontFamily: '"Varela Round"' }}>
                עוד לא שיחקת משחקים במכשיר זה.
                <br />
                שחק עכשיו כדי לראות את ההישגים האישיים שלך!
              </p>
            </div>
          ) : (
            שיאים.map((שיא, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10"
              >
                <span className="text-2xl font-bold w-8 text-center">{מדליות[i] ?? `${i + 1}.`}</span>
                <div className="flex-1">
                  <div className="text-white font-bold text-base" style={{ fontFamily: '"Varela Round"' }}>
                    {שיא.ניקוד.toLocaleString('he-IL')} נקודות
                  </div>
                  <div className="text-white/40 text-xs" style={{ fontFamily: '"Varela Round"' }}>
                    שלב {שיא.שלב} · {שיא.תאריך} · רמה {שיא.רמה}
                  </div>
                </div>
              </motion.div>
            ))
          )
        )}
      </div>
    </div>
  );
}
