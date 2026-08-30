import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export function SettingsScreen() {
  const { הגדרות, שנההגדרות, שנהמסך } = useGameStore();

  const רמות = ['קל', 'בינוני', 'מטורף'] as const;

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        direction: 'rtl',
      }}
    >
      {/* כותרת */}
      <div className="relative z-10 flex items-center px-4 pt-safe-top pt-6 pb-4">
        <button
          onClick={() => שנהמסך('פתיחה')}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-lg ml-3"
        >
          ←
        </button>
        <h1
          className="text-white font-bold text-2xl"
          style={{ fontFamily: '"Varela Round"' }}
        >
          ⚙️ הגדרות
        </h1>
      </div>

      {/* תוכן */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-4">

        {/* רמת קושי */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl p-5"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <h3 className="text-white font-bold mb-3" style={{ fontFamily: '"Varela Round"' }}>
            🎮 רמת קושי
          </h3>
          <div className="flex gap-2">
            {רמות.map((רמה) => (
              <button
                key={רמה}
                onClick={() => שנההגדרות({ רמה })}
                className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
                style={{
                  fontFamily: '"Varela Round"',
                  background: הגדרות.רמה === רמה
                    ? 'linear-gradient(135deg, #f7971e, #ffd200)'
                    : 'rgba(255,255,255,0.05)',
                  color: הגדרות.רמה === רמה ? '#333' : 'white',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {רמה === 'קל' ? '😊 קל' : רמה === 'בינוני' ? '🔥 בינוני' : '💀 מטורף'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* סאונד */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl p-5"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold" style={{ fontFamily: '"Varela Round"' }}>
              🔊 אפקטי קול
            </h3>
            <button
              onClick={() => שנההגדרות({ סאונד: !הגדרות.סאונד })}
              className={`w-14 h-8 rounded-full transition-all relative ${הגדרות.סאונד ? 'bg-green-500' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${הגדרות.סאונד ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold" style={{ fontFamily: '"Varela Round"' }}>
              🎵 מוזיקת רקע
            </h3>
            <button
              onClick={() => שנההגדרות({ מוזיקה: !הגדרות.מוזיקה })}
              className={`w-14 h-8 rounded-full transition-all relative ${הגדרות.מוזיקה ? 'bg-green-500' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${הגדרות.מוזיקה ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </motion.div>

        {/* עוצמת סאונד */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-3xl p-5"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <h3 className="text-white font-bold mb-3" style={{ fontFamily: '"Varela Round"' }}>
            🔈 עוצמת קול: {Math.round(הגדרות.עוצמתסאונד * 100)}%
          </h3>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={הגדרות.עוצמתסאונד}
            onChange={(e) => שנההגדרות({ עוצמתסאונד: parseFloat(e.target.value) })}
            className="w-full accent-yellow-400"
            dir="rtl"
          />
        </motion.div>

        {/* רטט */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl p-5"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold" style={{ fontFamily: '"Varela Round"' }}>
              📳 רטט
            </h3>
            <button
              onClick={() => שנההגדרות({ רטט: !הגדרות.רטט })}
              className={`w-14 h-8 rounded-full transition-all relative ${הגדרות.רטט ? 'bg-green-500' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${הגדרות.רטט ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </motion.div>

        {/* 🚀 אודות המפתח והפיתוח - Natan Webs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-3xl p-5 border-2 border-cyan-400/40 relative overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.2)]"
          style={{
            background: 'linear-gradient(135deg, rgba(12,4,28,0.95) 0%, rgba(30,10,60,0.9) 100%)',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-amber-300 p-0.5 flex items-center justify-center shadow-[0_0_15px_#00f0ff]">
              <div className="w-full h-full bg-black/80 rounded-[14px] flex items-center justify-center text-2xl">
                💻
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-black text-lg" style={{ fontFamily: '"Varela Round"' }}>
                  Natan Webs
                </h3>
                <span className="bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-black px-2 py-0.5 rounded-full">
                  יוצר המשחק
                </span>
              </div>
              <p className="text-white/60 text-xs mt-0.5 font-medium">
                פיתוח משחקים, אפליקציות ואתרי פרימיום
              </p>
            </div>
          </div>

          <p className="text-white/70 text-xs leading-relaxed mb-4" style={{ fontFamily: '"Varela Round"' }}>
            המשחק "שברי ביטוי" פותח ועוצב מ-0 ע״י <strong className="text-amber-300">Natan Webs</strong>. רוצים אתר, משחק או אפליקציה מותאמת אישית לעסק שלכם?
          </p>

          <a
            href="https://natanwebs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-2xl font-black text-sm text-black flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.7)] active:scale-95 transition-all"
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #38bdf8 50%, #facc15 100%)',
              fontFamily: '"Varela Round"',
            }}
          >
            <span>🌐</span>
            <span>בקרו באתר natanwebs.com ←</span>
          </a>
        </motion.div>

        {/* גרסה */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/30 text-xs pt-2"
          style={{ fontFamily: '"Varela Round"' }}
        >
          שברי ביטוי • פותח ע״י Natan Webs 💡
        </motion.div>
      </div>
    </div>
  );
}
