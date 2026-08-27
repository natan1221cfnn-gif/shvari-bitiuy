import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface שלבהוראה {
  סמל: string;
  כותרת: string;
  תיאור: string;
}

export function InstructionsScreen() {
  const { שנהמסך, התחלמשחק } = useGameStore();

  const שלבים: שלבהוראה[] = [
    { סמל: '🧲', כותרת: 'שני מגנטים', תיאור: 'שני בלוקים עפים ממרכז המסך לכיוונך' },
    { סמל: '⚡', כותרת: 'תזמון מושלם', תיאור: 'כשהבלוקים קרובים זה לזה, הקש על המסך' },
    { סמל: '🎯', כותרת: 'חיבור הביטוי', תיאור: 'אם תזמנת נכון, הביטוי מתחבר ואתה מקבל נקודות!' },
    { סמל: '🔥', כותרת: 'קומבו', תיאור: 'ביטויים רצופים מגדילים את מכפיל הניקוד עד x5' },
    { סמל: '❤️', כותרת: '3 לבבות', תיאור: '3 פספוסים וזה נגמר – שמור על הלבבות!' },
  ];

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        direction: 'rtl',
      }}
    >
      <div className="relative z-10 flex items-center px-4 pt-6 pb-4">
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
          📖 איך משחקים?
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {שלבים.map((שלב, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span className="text-4xl">{שלב.סמל}</span>
            <div>
              <div className="text-white font-bold" style={{ fontFamily: '"Varela Round"' }}>
                {שלב.כותרת}
              </div>
              <div className="text-white/60 text-sm mt-1" style={{ fontFamily: '"Varela Round"' }}>
                {שלב.תיאור}
              </div>
            </div>
          </motion.div>
        ))}

        {/* דוגמה */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-4 rounded-2xl text-center"
          style={{ background: 'rgba(247,151,30,0.1)', border: '1px solid rgba(247,151,30,0.3)' }}
        >
          <p className="text-yellow-400 font-bold mb-2" style={{ fontFamily: '"Varela Round"' }}>
            💡 דוגמה
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="px-3 py-1 rounded-xl text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>
              חבל על
            </span>
            <span className="text-white">+</span>
            <span className="px-3 py-1 rounded-xl text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #f7971e, #ffd200)' }}>
              הזמן
            </span>
            <span className="text-green-400">= ✅</span>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 px-4 pb-8">
        <button
          onClick={התחלמשחק}
          className="w-full py-5 rounded-3xl font-bold text-xl text-white"
          style={{
            fontFamily: '"Varela Round"',
            background: 'linear-gradient(135deg, #f7971e, #ffd200)',
            boxShadow: '0 8px 32px rgba(247,151,30,0.4)',
          }}
        >
          🚀 שחק עכשיו!
        </button>
      </div>
    </div>
  );
}
