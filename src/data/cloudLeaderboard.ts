import type { שיא } from '../types';

const CLOUD_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a04ccf2d01a05043f1ea0e5a';
const PRESENCE_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a04ccf2d01a0504a60140e69';

// רשימת שיאים אמיתיים מוכחת
const שיאיםאמיתייםברירתמחדל: שיא[] = [
  {
    שם: 'חבר של בוסיקו',
    ניקוד: 514037,
    תאריך: '30.8.2026',
    רמה: 'מטורף',
    שלב: 100,
    מצב: 'רגיל',
  },
  {
    שם: 'פלאפל מאסטר 🧆',
    ניקוד: 398323,
    תאריך: '30.8.2026',
    רמה: 'מטורף',
    שלב: 100,
    מצב: 'רגיל',
  },
  {
    שם: 'שחקן#5764',
    ניקוד: 105393,
    תאריך: '30.8.2026',
    רמה: 'מטורף',
    שלב: 87,
    מצב: 'רגיל',
  },
  {
    שם: 'בוסיקו מספר 1',
    ניקוד: 102876,
    תאריך: '30.8.2026',
    רמה: 'מטורף',
    שלב: 100,
    מצב: 'רגיל',
  },
  {
    שם: 'שחקן#5279',
    ניקוד: 79581,
    תאריך: '30.8.2026',
    רמה: 'מטורף',
    שלב: 71,
    מצב: 'רגיל',
  },
  {
    שם: 'מוח מבריק 💡',
    ניקוד: 25000,
    תאריך: '30.8.2026',
    רמה: 'מטורף',
    שלב: 70,
    מצב: 'טירוף',
    מטבעות: 50000,
  },
  {
    שם: 'שחקן#7857',
    ניקוד: 17963,
    תאריך: '30.8.2026',
    רמה: 'בינוני',
    שלב: 31,
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

// 🛡️ סינון, איחוד ומניעת כפילויות חכם: תמיד שומר את הניקוד המקסימלי לכל שחקן
export function סנןונקהכפילויות(רשימה: שיא[]): שיא[] {
  const מפה = new Map<string, שיא>();

  for (const ש of [...שיאיםאמיתייםברירתמחדל, ...רשימה]) {
    if (!ש || !ש.ניקוד || ש.ניקוד <= 0) continue;
    
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

// 🚀 טעינת שיאים מהענן
export async function טעןשיאיםמהענן(): Promise<שיא[]> {
  try {
    const url = `${CLOUD_ENDPOINT}?_t=${Date.now()}`;
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      const scores = json?.data?.scores;
      if (Array.isArray(scores) && scores.length > 0) {
        const decoded = scores.map((s: any) => {
          let name = s.שם || 'שחקן';
          try {
            name = decodeURIComponent(name);
          } catch {}
          return {
            ...s,
            שם: name,
          };
        });
        const filtered = סנןונקהכפילויות(decoded);
        localStorage.setItem('shvari_cached_cloud_scores', JSON.stringify(filtered));
        return filtered;
      }
    }
  } catch {
    /* ignore */
  }

  try {
    const cached = localStorage.getItem('shvari_cached_cloud_scores');
    if (cached) {
      return סנןונקהכפילויות(JSON.parse(cached));
    }
  } catch {
    /* ignore */
  }

  return סנןונקהכפילויות([]);
}

// 👑 עדכון ישיר מלא של רשימת השיאים (פאנל מנהל)
export async function שמוררשימתשיאיםמלאהבענן(רשימה: שיא[]): Promise<boolean> {
  try {
    const מסודר = [...רשימה].sort((a, b) => (b.ניקוד || 0) - (a.ניקוד || 0));
    localStorage.setItem('shvari_cached_cloud_scores', JSON.stringify(מסודר));

    // קידוד בטוח של כל התווים בעברית למניעת שגיאת 500 ב-REST API
    const encoded = מסודר.map((s) => ({
      ...s,
      שם: encodeURIComponent(s.שם || 'שחקן'),
      רמה: s.רמה || 'מטורף',
      מצב: s.מצב || 'רגיל',
      תאריך: s.תאריך || new Date().toLocaleDateString('he-IL'),
      ניקוד: Number(s.ניקוד) || 0,
      מטבעות: Number(s.מטבעות) || 100,
    }));

    const res = await fetch(CLOUD_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'shvari_real_scores_production_v1',
        data: { scores: encoded },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ⚡ שליחת שיא חדש לענן ללא דריסת שיאים קיימים
export async function שלחשיאלענן(שיאחדש: שיא): Promise<void> {
  try {
    if (!שיאחדש.ניקוד || שיאחדש.ניקוד <= 0) return;
    
    // שליפה חיה וטריים ביותר כדי לא לדרוס אף שחקן
    const קיימים = await טעןשיאיםמהענן();

    const מעודכן = סנןונקהכפילויות([...קיימים, שיאחדש]);
    localStorage.setItem('shvari_cached_cloud_scores', JSON.stringify(מעודכן));

    const encoded = מעודכן.map((s) => ({
      ...s,
      שם: encodeURIComponent(s.שם || 'שחקן'),
      רמה: s.רמה || 'מטורף',
      מצב: s.מצב || 'רגיל',
      תאריך: s.תאריך || new Date().toLocaleDateString('he-IL'),
      ניקוד: Number(s.ניקוד) || 0,
      מטבעות: Number(s.מטבעות) || 100,
    }));

    await fetch(CLOUD_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'shvari_real_scores_production_v1',
        data: { scores: encoded },
      }),
    });
  } catch {
    /* ignore */
  }
}

// 🔄 עדכון שם שחקן
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

// 🟢 מונה שחקנים מחוברים אמיתי בזמן אמת
export async function אותחייםומונהמחוברים(): Promise<number> {
  try {
    const deviceId = קבלמזההמכשיר();
    const now = Date.now();
    const url = `${PRESENCE_ENDPOINT}?_t=${now}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return 1;
    const json = await res.json();
    const active: Record<string, number> = json?.data?.active || {};

    const cleaned: Record<string, number> = {};
    for (const [id, time] of Object.entries(active)) {
      if (now - time < 50000) {
        cleaned[id] = time;
      }
    }
    cleaned[deviceId] = now;

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
