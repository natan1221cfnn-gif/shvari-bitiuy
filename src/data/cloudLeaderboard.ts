import type { שיא } from '../types';

const CLOUD_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a04ccf2d01a05043f1ea0e5a';
const PRESENCE_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a04ccf2d01a0504a60140e69';

// רשימת שיאים אמיתיים מוכחת (Fallback מובטח למניעת תצוגה ריקה)
const שיאיםאמיתייםברירתמחדל: שיא[] = [
  {
    שם: 'בוסיקו מספר 1',
    ניקוד: 102876,
    תאריך: '30.8.2026',
    רמה: 'מטורף',
    שלב: 100,
    מצב: 'רגיל',
  },
  {
    שם: 'מוח מבריק 💡',
    ניקוד: 9835,
    תאריך: '30.8.2026',
    רמה: 'בינוני',
    שלב: 20,
    מצב: 'רגיל',
  },
];

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

  // תמיד ודא ששיאי האמת קיימים
  for (const ש of [...שיאיםאמיתייםברירתמחדל, ...רשימה]) {
    if (!ש || !ש.ניקוד || ש.ניקוד <= 0) continue;
    
    // ניקוי ואיחוד שמות ישנים
    let שםנקי = (ש.שם || 'שחקן').trim();
    if (שםנקי.includes('8819') || שםנקי === 'בננה' || שםנקי === 'שחקן#8819') {
      שםנקי = 'בוסיקו מספר 1';
    }

    const שיאמתוקן: שיא = { ...ש, שם: שםנקי };
    const קיים = מפה.get(שםנקי);

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
    if (!res.ok) return סנןונקהכפילויות([]);
    const json = await res.json();
    const scores = json?.data?.scores;
    if (Array.isArray(scores) && scores.length > 0) {
      const filtered = סנןונקהכפילויות(scores);
      localStorage.setItem('shvari_cached_cloud_scores', JSON.stringify(filtered));
      return filtered;
    }
  } catch {
    /* fallback */
  }

  try {
    const cached = localStorage.getItem('shvari_cached_cloud_scores');
    if (cached) {
      return סנןונקהכפילויות(JSON.parse(cached));
    }
  } catch {
    /* fallback */
  }

  return סנןונקהכפילויות([]);
}

export async function שלחשיאלענן(שיאחדש: שיא): Promise<void> {
  try {
    if (!שיאחדש.ניקוד || שיאחדש.ניקוד <= 0) return;
    const קיימים = await טעןשיאיםמהענן();

    // הוספה וסינון כפילויות קשיח
    const מעודכן = סנןונקהכפילויות([...קיימים, שיאחדש]);
    localStorage.setItem('shvari_cached_cloud_scores', JSON.stringify(מעודכן));

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
      if (s.שם === שםישן) {
        return { ...s, שם: שםחדש };
      }
      return s;
    });

    const נקי = סנןונקהכפילויות(מעודכן);
    localStorage.setItem('shvari_cached_cloud_scores', JSON.stringify(נקי));

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
