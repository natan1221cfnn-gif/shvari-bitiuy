import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

function Confetti() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(35)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            background: `hsl(${Math.random() * 360}, 90%, 65%)`,
            right: `${Math.random() * 100}%`,
            top: -20,
          }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [0, Math.random() * 720 - 360],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: Math.random() * 2.2 + 1.5,
            delay: Math.random() * 1.5,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}

export function LoseScreen() {
  const {
    ניקוד,
    שיאאישי,
    שלב,
    הצלחות,
    הגדרות,
    פספוסים,
    מצבמשחק,
    מטבעות,
    השתמשבהצלה,
    שנהמסך,
    התחלמשחק,
    אפסמשחק,
    הצלתמשחק,
  } = useGameStore();

  const [copied, setCopied] = useState(false);
  const שיאחדש = ניקוד >= שיאאישי && ניקוד > 0;
  const הואטירוף = מצבמשחק === 'טירוף';

  const handleWhatsAppChallenge = () => {
    const text = הואטירוף
      ? `השגתי ${ניקוד.toLocaleString('he-IL')} נקודות וחיברתי ${הצלחות} ביטויים ב-60 שניות טירוף בשברי ביטוי! ⚡🔥\nתנסו לנצח אותי בקישור: ${window.location.href}`
      : `השגתי ${ניקוד.toLocaleString('he-IL')} נקודות וחיברתי ${הצלחות} ביטויים בשברי ביטוי! 🧲🔥\nתנסו לנצח אותי בקישור: ${window.location.href}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = async () => {
    const text = הואטירוף
      ? `השגתי ${ניקוד.toLocaleString('he-IL')} נקודות ב-60 שניות טירוף בשברי ביטוי! ⚡🔥`
      : `השגתי ${ניקוד.toLocaleString('he-IL')} נקודות וחיברתי ${הצלחות} ביטויים בשברי ביטוי! 🧲🔥\nתנסו לנצח אותי! 🇮🇱`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'שברי ביטוי 🧲',
          text,
          url: window.location.href,
        });
        return;
      } catch { /* fallback */ }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-between overflow-y-auto"
      style={{
        background: 'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        direction: 'rtl',
      }}
    >
      {שיאחדש && <Confetti />}

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-5 py-6 text-center w-full max-w-md mx-auto gap-4">
        {/* אימוג׳י */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="text-7xl"
        >
          {הואטירוף ? '⏱️' : שלב > 15 ? '🏆' : שלב > 8 ? '🎯' : '😅'}
        </motion.div>

        {/* כותרת */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2
            className="font-bold text-white"
            style={{ fontFamily: '"Varela Round"', fontSize: 'clamp(1.8rem, 7vw, 2.4rem)' }}
          >
            {הואטירוף ? 'נגמר הזמן! ⏱️' : שלב > 20 ? 'מדהים! 🔥' : שלב > 10 ? 'כל הכבוד! 👏' : 'משחק נגמר'}
          </h2>
          {שיאחדש && (
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="mt-1 text-yellow-400 font-bold text-lg"
              style={{ fontFamily: '"Varela Round"' }}
            >
              🎉 שיא חדש! 🎉
            </motion.p>
          )}
        </motion.div>

        {/* סטטיסטיקות */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full rounded-3xl p-4 grid grid-cols-2 gap-3"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="flex flex-col items-center">
            <span className="text-white/50 text-xs" style={{ fontFamily: '"Varela Round"' }}>ניקוד סופי</span>
            <span className="text-white font-bold text-2.5xl" style={{ fontFamily: '"Varela Round"' }}>
              {ניקוד.toLocaleString('he-IL')}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white/50 text-xs" style={{ fontFamily: '"Varela Round"' }}>ביטויים שחיברת</span>
            <span className="text-white font-bold text-2.5xl" style={{ fontFamily: '"Varela Round"' }}>
              {הצלחות}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white/50 text-xs" style={{ fontFamily: '"Varela Round"' }}>שיא אישי</span>
            <span className="text-yellow-400 font-bold text-xl" style={{ fontFamily: '"Varela Round"' }}>
              {שיאאישי.toLocaleString('he-IL')}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white/50 text-xs" style={{ fontFamily: '"Varela Round"' }}>מטבעות שהורווחו</span>
            <span className="text-yellow-300 font-bold text-xl" style={{ fontFamily: '"Varela Round"' }}>
              +{הצלחות * 2} 🪙
            </span>
          </div>
        </motion.div>

        {/* 📖 ביטויים שפוספסו */}
        {פספוסים.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full rounded-2xl p-4 text-right"
            style={{ background: 'rgba(247,121,125,0.1)', border: '1px solid rgba(247,121,125,0.25)' }}
          >
            <div className="text-pink-300 font-bold text-xs mb-2 flex items-center gap-1" style={{ fontFamily: '"Varela Round"' }}>
              <span>💡 ביטויים שפספסת:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {פספוסים.map((ב, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl text-white text-xs font-bold bg-white/10"
                  style={{ fontFamily: '"Varela Round"' }}
                >
                  {ב.שמאל} {ב.ימין}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* 🆘 הצלת משחק */}
        {!השתמשבהצלה && (
          <motion.button
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.98, 1.02, 0.98] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            onClick={() => הצלתמשחק()}
            disabled={מטבעות < 50}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              מטבעות >= 50
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-purple-950 active:scale-95'
                : 'bg-white/10 text-white/40 opacity-70 cursor-not-allowed'
            }`}
            style={{ fontFamily: '"Varela Round"' }}
          >
            <span>{הואטירוף ? '⚡ עוד 30 שניות טירוף!' : '❤️ הצל את המשחק! (המשך מאיפה שעצרת)'}</span>
            <span className="bg-black/20 px-2 py-0.5 rounded-full">50 🪙</span>
          </motion.button>
        )}

        {/* כפתורי פעולה */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full flex flex-col gap-2.5"
        >
          {/* 💬 אתגר חבר בוואטסאפ */}
          <button
            onClick={handleWhatsAppChallenge}
            className="w-full py-3.5 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
            style={{
              fontFamily: '"Varela Round"',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
            }}
          >
            <span>💬 אתגר חבר בוואטסאפ!</span>
          </button>

          {/* שתף כללי */}
          <button
            onClick={handleShare}
            className="w-full py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 bg-white/10 border border-white/20"
            style={{ fontFamily: '"Varela Round"' }}
          >
            <span>{copied ? '✅ הועתק!' : '📲 שתף תוצאה'}</span>
          </button>

          <button
            onClick={() => התחלמשחק(מצבמשחק)}
            className="w-full py-4 rounded-3xl font-bold text-xl text-white"
            style={{
              fontFamily: '"Varela Round"',
              background: 'linear-gradient(135deg, #f7971e, #ffd200)',
              color: '#1a0533',
              boxShadow: '0 8px 32px rgba(247,151,30,0.4)',
            }}
          >
            🔄 שחק שוב
          </button>

          <button
            onClick={() => {
              אפסמשחק();
              שנהמסך('פתיחה');
            }}
            className="w-full py-3 rounded-2xl font-bold text-white text-sm"
            style={{
              fontFamily: '"Varela Round"',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            🏠 תפריט ראשי
          </button>
        </motion.div>
      </div>
    </div>
  );
}
