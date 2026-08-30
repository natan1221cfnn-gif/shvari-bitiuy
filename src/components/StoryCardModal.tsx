import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface StoryCardModalProps {
  onClose: () => void;
  ניקודמשחק?: number;
  ביטוייםשחוברו?: number;
}

export function StoryCardModal({ onClose, ניקודמשחק, ביטוייםשחוברו }: StoryCardModalProps) {
  const { שםשחקן, שיאאישי, עירשחקן, ניקוד: ניקודסטור, הצלחות } = useGameStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const finalScore = ניקודמשחק ?? (ניקודסטור > 0 ? ניקודסטור : שיאאישי);
  const finalHits = ביטוייםשחוברו ?? הצלחות;

  // חישוב דרגה / תואר ישראלי
  const קבלתואר = (score: number) => {
    if (score >= 300000) return { title: 'אגדת שועל ישראלי 🦊', color: '#ff007f', crown: '👑👑👑' };
    if (score >= 100000) return { title: 'אלוף הסלנג הישראלי 🏆', color: '#ffd700', crown: '👑👑' };
    if (score >= 40000) return { title: 'מאסטר שברי ביטוי ⚡', color: '#00f0ff', crown: '👑' };
    if (score >= 15000) return { title: 'מוח מבריק 💡', color: '#a855f7', crown: '⭐' };
    return { title: 'לוחם סלנג מתחיל 🧲', color: '#38bdf8', crown: '✨' };
  };

  const rankInfo = קבלתואר(finalScore);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // הגדרת מימדי סטורי 9:16 באיכות גבוהה
    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;

    // 🌌 1. רקע ניאון עמוק
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#0f051d');
    bgGrad.addColorStop(0.3, '#1c0a38');
    bgGrad.addColorStop(0.7, '#120424');
    bgGrad.addColorStop(1, '#05010a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // ✨ 2. אפקטי כוכבים וזוהר ניאון
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const r = Math.random() * 3 + 1;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 🔲 3. מסגרת סייבר-ניאון חיצונית
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 12;
    ctx.strokeRect(50, 50, W - 100, H - 100);

    ctx.strokeStyle = '#ff007f';
    ctx.lineWidth = 4;
    ctx.strokeRect(70, 70, W - 140, H - 140);

    // 🧲 4. כותרת המשחק
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px "Varela Round", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🧲 שברי ביטוי 🧲', W / 2, 190);

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 36px "Varela Round", sans-serif';
    ctx.fillText('משחק הסלנג והפתגמים של ישראל', W / 2, 260);

    // 👑 5. כתר ודרגה
    ctx.fillStyle = rankInfo.color;
    ctx.font = 'bold 54px "Varela Round", sans-serif';
    ctx.fillText(rankInfo.crown, W / 2, 410);
    ctx.fillText(rankInfo.title, W / 2, 490);

    // 👤 6. שם השחקן
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 84px "Varela Round", sans-serif';
    ctx.fillText(שםשחקן, W / 2, 630);

    // 🏙️ 7. עיר השחקן
    ctx.fillStyle = '#fbcfe8';
    ctx.font = 'bold 44px "Varela Round", sans-serif';
    ctx.fillText(`🏛️ מייצג את: ${עירשחקן}`, W / 2, 710);

    // 📦 8. קופסת ניקוד זוהרת
    const boxX = 140;
    const boxY = 820;
    const boxW = W - 280;
    const boxH = 420;

    const boxGrad = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY + boxH);
    boxGrad.addColorStop(0, 'rgba(251, 191, 36, 0.25)');
    boxGrad.addColorStop(1, 'rgba(217, 70, 239, 0.25)');
    ctx.fillStyle = boxGrad;
    ctx.roundRect ? ctx.roundRect(boxX, boxY, boxW, boxH, 40) : ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.fill();

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 48px "Varela Round", sans-serif';
    ctx.fillText('ניקוד סופי מטורף', W / 2, boxY + 110);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 130px "Varela Round", sans-serif';
    ctx.fillText(finalScore.toLocaleString('he-IL'), W / 2, boxY + 270);

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 42px "Varela Round", sans-serif';
    ctx.fillText(`⚡ ${finalHits} ביטויים חוברו בדיוק מושלם`, W / 2, boxY + 360);

    // 🎯 9. קריאה לאתגר חברים
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px "Varela Round", sans-serif';
    ctx.fillText('🔥 מי מעז לאתגר אותי? 🔥', W / 2, 1420);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 40px "Varela Round", sans-serif';
    ctx.fillText('כנסו עכשיו לשברי ביטוי ושברו את השיא!', W / 2, 1500);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '34px "Varela Round", sans-serif';
    ctx.fillText('warm-paddle-156.harvis.page', W / 2, 1720);

    try {
      setImageUri(canvas.toDataURL('image/png'));
    } catch {
      /* ignore */
    }
  }, [finalScore, finalHits, שםשחקן, עירשחקן, rankInfo]);

  const handleDownload = () => {
    if (!imageUri) return;
    const a = document.createElement('a');
    a.href = imageUri;
    a.download = `shvari_story_${שםשחקן}_${finalScore}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    const shareText = `הגעתי ל-${finalScore.toLocaleString('he-IL')} נקודות בשברי ביטוי! 🧲🔥 מי מעז לנצח אותי? ${window.location.href}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'שברי ביטוי 🧲',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        /* ignore */
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg overflow-y-auto"
      style={{ direction: 'rtl', fontFamily: '"Varela Round", sans-serif' }}
    >
      <canvas ref={canvasRef} className="hidden" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl p-5 border border-cyan-400/50 shadow-[0_0_40px_rgba(0,240,255,0.4)] flex flex-col items-center gap-4 my-auto text-white"
        style={{
          background: 'linear-gradient(160deg, #180830 0%, #0c0418 100%)',
        }}
      >
        {/* כותרת מודאל */}
        <div className="w-full flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <div>
              <h3 className="font-black text-base text-cyan-300">כרטיס סטורי מעוצב</h3>
              <p className="text-[10px] text-white/50">מוכן לשיתוף באינסטגרם, טיקטוק ווואטסאפ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm"
          >
            ✕
          </button>
        </div>

        {/* תצוגה מקדימה של הכרטיס */}
        {imageUri && (
          <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-400/40 shadow-2xl max-h-[52vh] flex items-center justify-center">
            <img src={imageUri} alt="Story Card Preview" className="max-h-[52vh] object-contain rounded-xl" />
          </div>
        )}

        {/* כפתורי פעולה */}
        <div className="w-full space-y-2">
          <button
            onClick={handleShare}
            className="w-full py-3.5 rounded-2xl font-black text-base text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-yellow-300 shadow-[0_0_20px_rgba(0,240,255,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>🚀</span>
            <span>שתף לסטורי / וואטסאפ</span>
          </button>

          <button
            onClick={handleDownload}
            className="w-full py-3 rounded-2xl font-bold text-sm text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/40 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>💾</span>
            <span>הורד תמונה למכשיר</span>
          </button>

          {copied && (
            <p className="text-center text-xs text-yellow-300 font-bold animate-bounce">
              ✓ הקישור והתוצאה הועתקו ללוח!
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
