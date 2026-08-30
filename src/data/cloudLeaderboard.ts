import type { שיא } from '../types';

const CLOUD_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a04ccf2d01a05043f1ea0e5a';
const PRESENCE_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a04ccf2d01a0504a60140e69';

function קבלמזההמכשיר(): string {
  try {
    let id = localStorage.getItem('שברי-ביטוי-מזהה-מכשיר');
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem('שברי-ביטוי-מזהה-מכשיר', id);
    }
    return id;
  } catch {
    return 'anon_' + Math.random().toString(36).substring(2, 8);
  }
}

// 🛡️ פונקציית סינון ומניעת כפילויות קשיחה (כל שחקן מופיע פעם אחת בלבד בשיא הגבוה ביותר שלו!)
export function סנןונקהכפילויות(רשימה: שיא[]): שיא[] {
  const מפה = new Map<string, שיא>();

  for (const ש of רשימה) {
    if (!ש || !ש.ניקוד || ש.ניקוד <= 0) continue;
    
    // ניקוי ואיחוד שמות ישנים
    let שםנקי = (ש.שם || 'שחקן').trim();
    if (שםנקי.includes('8819') || שםנקי === 'שחקן#8819') {
      שםנקי = 'בננה';
    }

    const שיאמתוקן: שיא = { ...ש, שם: שםנקי };
    const קיים = מפה.get(שםנקי);

    // אם השחקן לא קיים עדיין, או שהניקוד הנוכחי גבוה יותר מהקיים - שמור אותו
    if (!קיים || שיאמתוקן.ניקוד > קיים.ניקוד) {
      מפה.set(שםנקי, שיאמתוקן);
    }
  }

  return Array.from(מפה.values())
    .sort((a, b) => (b.ניקוד || 0) - (a.ניקוד || 0))
    .slice(0, 50);
}

export async function טעןשיאיםמהענן(): Promise<שיא[]> {
  try {
    const res = await fetch(CLOUD_ENDPOINT, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    const scores = json?.data?.scores;
    if (Array.isArray(scores)) {
      return סנןונקהכפילויות(scores);
    }
    return [];
  } catch {
    return [];
  }
}

export async function שלחשיאלענן(שיאחדש: שיא): Promise<void> {
  try {
    if (!שיאחדש.ניקוד || שיאחדש.ניקוד <= 0) return;
    const קיימים = await טעןשיאיםמהענן();

    // הוספה וסינון כפילויות קשיח
    const מעודכן = סנןונקהכפילויות([...קיימים, שיאחדש]);

    await fetch(CLOUD_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'shvari_real_scores_production_v1',
        data: { scores: מעודכן },
      }),
    });
  } catch {
    /* ignore */
  }
}

// 🔄 עדכון אוטומטי של שם השחקן בלוח השיאים העולמי
export async function עדכןשםשחקןבענן(שםישן: string, שםחדש: string): Promise<void> {
  try {
    if (!שםחדש || שםישן === שםחדש) return;
    const קיימים = await טעןשיאיםמהענן();

    const מעודכן = קיימים.map((s) => {
      if (s.שם === שםישן || (שםישן.includes('8819') && s.שם === 'שחקן#8819')) {
        return { ...s, שם: שםחדש };
      }
      return s;
    });

    const נקי = סנןונקהכפילויות(מעודכן);

    await fetch(CLOUD_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'shvari_real_scores_production_v1',
        data: { scores: נקי },
      }),
    });
  } catch {
    /* ignore */
  }
}

// 🟢 מונה שחקנים מחוברים אמיתי בזמן אמת (100% Real Live Online Counter)
export async function אותחייםומונהמחוברים(): Promise<number> {
  try {
    const deviceId = קבלמזההמכשיר();
    const now = Date.now();
    const res = await fetch(PRESENCE_ENDPOINT, { cache: 'no-store' });
    if (!res.ok) return 1;
    const json = await res.json();
    const active: Record<string, number> = json?.data?.active || {};

    // ניקוי מחוברים שלא שלחו אות חיים מעל 50 שניות
    const cleaned: Record<string, number> = {};
    for (const [id, time] of Object.entries(active)) {
      if (now - time < 50000) {
        cleaned[id] = time;
      }
    }
    cleaned[deviceId] = now;

    // עדכון מסד הנתונים
    fetch(PRESENCE_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'shvari_live_presence_production_v1',
        data: { active: cleaned },
      }),
    }).catch(() => {});

    return Math.max(Object.keys(cleaned).length, 1);
  } catch {
    return 1;
  }
}
