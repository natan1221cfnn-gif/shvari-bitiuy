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

        {/* גרסה */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/20 text-xs"
          style={{ fontFamily: '"Varela Round"' }}
        >
          שברי ביטוי גרסה 1.1.2 🧲
        </motion.div>
      </div>
    </div>
  );
}
