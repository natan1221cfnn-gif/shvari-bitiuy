import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const מדליות = ['🥇', '🥈', '🥉'];

// שיאים ארציים לדוגמה (ישראל)
const שיאיםארציים = [
  { שם: 'איתי מ. (תל אביב)', ניקוד: 28400, שלב: 42, רמה: 'מטורף' },
  { שם: 'נועה כ. (ירושלים)', ניקוד: 24150, שלב: 38, רמה: 'מטורף' },
  { שם: 'עומר ש. (חיפה)', ניקוד: 19800, שלב: 31, רמה: 'בינוני' },
  { שם: 'גל ב. (באר שבע)', ניקוד: 17500, שלב: 27, רמה: 'מטורף' },
  { שם: 'מיכל ל. (ראשון לציון)', ניקוד: 15200, שלב: 24, רמה: 'בינוני' },
  { שם: 'יוסי פ. (נתניה)', ניקוד: 12900, שלב: 20, רמה: 'קל' },
];

export function LeaderboardScreen() {
  const { שיאים, שנהמסך, שיאאישי } = useGameStore();
  const [טאב, setטאב] = useState<'אישי' | 'ארצי'>('ארצי');

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        direction: 'rtl',
      }}
    >
      {/* כותרת */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-safe-top pt-6 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => שנהמסך('פתיחה')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-lg"
          >
            ←
          </button>
          <h1 className="text-white font-bold text-2xl" style={{ fontFamily: '"Varela Round"' }}>
            🏆 לוח שיאים
          </h1>
        </div>

        <div className="text-xs bg-yellow-400/20 text-yellow-300 font-bold px-3 py-1 rounded-full border border-yellow-400/30">
          שיא שלך: {שיאאישי.toLocaleString('he-IL')}
        </div>
      </div>

      {/* טאבים: ארצי / אישי */}
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
          🇮🇱 מובילים בישראל
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
      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-3">
        {טאב === 'ארצי' ? (
          שיאיםארציים.map((שיא, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{
                background: i === 0
                  ? 'linear-gradient(135deg, rgba(247,151,30,0.25), rgba(255,210,0,0.15))'
                  : 'rgba(255,255,255,0.06)',
                border: i === 0
                  ? '1px solid rgba(247,151,30,0.5)'
                  : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span className="text-3xl font-bold">{מדליות[i] ?? `${i + 1}.`}</span>
              <div className="flex-1">
                <div className="text-white font-bold text-base" style={{ fontFamily: '"Varela Round"' }}>
                  {שיא.שם}
                </div>
                <div className="text-white/40 text-xs" style={{ fontFamily: '"Varela Round"' }}>
                  שלב {שיא.שלב} · רמה {שיא.רמה}
                </div>
              </div>
              <div className="text-yellow-400 font-bold text-xl" style={{ fontFamily: '"Varela Round"' }}>
                {שיא.ניקוד.toLocaleString('he-IL')}
              </div>
            </motion.div>
          ))
        ) : שיאים.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-6xl mb-3">🎮</div>
            <p className="text-white/50 text-sm" style={{ fontFamily: '"Varela Round"' }}>
              עוד אין שיאים אישיים.
              <br />
              שחק כדי לרשום את הראשון!
            </p>
          </div>
        ) : (
          שיאים.map((שיא, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{
                background: i === 0
                  ? 'linear-gradient(135deg, rgba(247,151,30,0.25), rgba(255,210,0,0.15))'
                  : 'rgba(255,255,255,0.06)',
                border: i === 0
                  ? '1px solid rgba(247,151,30,0.5)'
                  : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span className="text-3xl font-bold">{מדליות[i] ?? `${i + 1}.`}</span>
              <div className="flex-1">
                <div className="text-white font-bold text-xl" style={{ fontFamily: '"Varela Round"' }}>
                  {שיא.ניקוד.toLocaleString('he-IL')} נקודות
                </div>
                <div className="text-white/40 text-xs" style={{ fontFamily: '"Varela Round"' }}>
                  {שיא.תאריך} · {שיא.רמה}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
