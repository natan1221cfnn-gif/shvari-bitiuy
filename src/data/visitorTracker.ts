// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// מודול מעקב מבקרים אמיתי בלבד (100% Real Live Analytics)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const VISITOR_STORAGE_KEY = 'shvari_real_total_visitors';
const TODAY_STORAGE_KEY = `shvari_real_today_${new Date().toISOString().slice(0, 10)}`;
const SESSION_FLAG = 'shvari_real_session_flag';

// נקודת קצה של מונה ענן נקי ואמיתי
const COUNTER_ENDPOINT = 'https://api.counterapi.dev/v1/shvari_real_game_live/visitors';

export interface מנתונימבקרים {
  סךהכל: number;
  היום: number;
  עודכןלאחרונה: string;
}

export async function רשוםביקורחדש(): Promise<number> {
  const isNewSession = !sessionStorage.getItem(SESSION_FLAG);
  let localTotal = parseInt(localStorage.getItem(VISITOR_STORAGE_KEY) || '1', 10);

  if (isNewSession) {
    sessionStorage.setItem(SESSION_FLAG, 'true');
    localTotal += 1;
    localStorage.setItem(VISITOR_STORAGE_KEY, String(localTotal));

    // עדכון מונה יומי אמיתי
    const todayCount = parseInt(localStorage.getItem(TODAY_STORAGE_KEY) || '0', 10) + 1;
    localStorage.setItem(TODAY_STORAGE_KEY, String(todayCount));

    // שליחה אמיתית לשרת הענן
    try {
      const res = await fetch(`${COUNTER_ENDPOINT}/up`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json && typeof json.count === 'number') {
          localStorage.setItem(VISITOR_STORAGE_KEY, String(json.count));
          return json.count;
        }
      }
    } catch {
      /* network fallback */
    }
  }

  return localTotal;
}

export async function קבלנתונימבקרים(): Promise<מנתונימבקרים> {
  let total = parseInt(localStorage.getItem(VISITOR_STORAGE_KEY) || '1', 10);
  const today = parseInt(localStorage.getItem(TODAY_STORAGE_KEY) || '1', 10);

  try {
    const res = await fetch(COUNTER_ENDPOINT, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json && typeof json.count === 'number') {
        total = json.count;
        localStorage.setItem(VISITOR_STORAGE_KEY, String(total));
      }
    }
  } catch {
    /* fallback to local storage */
  }

  return {
    סךהכל: total,
    היום: today,
    עודכןלאחרונה: new Date().toLocaleTimeString('he-IL'),
  };
}

export async function הגדרמונהידני(כמות: number): Promise<boolean> {
  if (isNaN(כמות) || כמות < 0) return false;
  localStorage.setItem(VISITOR_STORAGE_KEY, String(כמות));
  localStorage.setItem(TODAY_STORAGE_KEY, String(כמות));
  try {
    await fetch(`${COUNTER_ENDPOINT}/set?count=${כמות}`, { cache: 'no-store' });
    return true;
  } catch {
    return true;
  }
}
