import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { קבלשלבמפה } from '../data/israelMapData';

interface VictoryModalProps {
  מספרשלב: number;
  לבבותשנותרו: number;
  ניקודשלב: number;
  onNextStage: () => void;
  onBackToMap: () => void;
}

export function MapStageVictoryModal({
  מספרשלב,
  לבבותשנותרו,
  ניקודשלב,
  onNextStage,
  onBackToMap,
}: VictoryModalProps) {
  const מידעשלב = קבלשלבמפה(מספרשלב);
  const כוכבים = לבבותשנותרו >= 3 ? 3 : לבבותשנותרו >= 2 ? 2 : 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      style={{ direction: 'rtl', fontFamily: '"Varela Round", sans-serif' }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl p-6 border-2 border-yellow-400 shadow-[0_0_50px_rgba(251,191,36,0.5)] text-center text-white space-y-4"
        style={{
          background: 'linear-gradient(160deg, #1f0a38 0%, #0d041c 100%)',
        }}
      >
        {/* כוכבי ניצחון מונפשים */}
        <div className="flex items-center justify-center gap-2 text-4xl my-2">
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className={כוכבים >= 1 ? 'text-amber-300 drop-shadow-[0_0_10px_#fbbf24]' : 'text-white/20'}
          >
            ⭐
          </motion.span>
          <motion.span
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1.2, rotate: 0 }}
            transition={{ delay: 0.25, type: 'spring' }}
            className={כוכבים >= 2 ? 'text-amber-300 drop-shadow-[0_0_15px_#fbbf24]' : 'text-white/20'}
          >
            ⭐
          </motion.span>
          <motion.span
            initial={{ scale: 0, rotate: 30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className={כוכבים >= 3 ? 'text-amber-300 drop-shadow-[0_0_10px_#fbbf24]' : 'text-white/20'}
          >
            ⭐
          </motion.span>
        </div>

        <div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-cyan-300 bg-clip-text text-transparent">
            🎉 שלב {מספרשלב} הושלם!
          </h2>
          <p className="text-xs text-cyan-300 font-bold mt-1">
            {מידעשלב.אייקוןאזור} {מידעשלב.שםאזור} נכבש בהצלחה!
          </p>
        </div>

        {/* תיבת ניקוד ופרסים */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-white/60">ניקוד שהושג:</span>
            <span className="font-black text-yellow-300 text-sm">{ניקודשלב.toLocaleString('he-IL')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">בונוס מטבעות:</span>
            <span className="font-black text-emerald-400 text-sm">+50 🪙</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">כוכבים שנצברו:</span>
            <span className="font-bold text-amber-300">
              {כוכבים === 3 ? '⭐⭐⭐ מושלם!' : כוכבים === 2 ? '⭐⭐ מעולה!' : '⭐ עברת!'}
            </span>
          </div>
        </div>

        {/* כפתורי מעבר */}
        <div className="space-y-2 pt-2">
          {מספרשלב < 50 && (
            <button
              onClick={onNextStage}
              className="w-full py-4 rounded-2xl font-black text-lg text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-yellow-300 shadow-[0_0_20px_rgba(0,240,255,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>▶️</span>
              <span>לשלב הבא (שלב {מספרשלב + 1})</span>
            </button>
          )}

          <button
            onClick={onBackToMap}
            className="w-full py-3 rounded-2xl font-bold text-sm text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>🗺️</span>
            <span>חזרה למפת ישראל</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
