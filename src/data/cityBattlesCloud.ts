import type { עירמידע } from '../types';

const CITY_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a04ccf2d01a05268ecfd1646';

export const עריברירתמחדל: עירמידע[] = [
  { id: 'jerusalem', name: 'ירושלים', score: 4850300, players: 4821, icon: '🦁', title: 'שומרי הקודש' },
  { id: 'telaviv', name: 'תל אביב', score: 4710150, players: 5103, icon: '🌊', title: 'אליטת הסייבר' },
  { id: 'haifa', name: 'חיפה', score: 4590800, players: 3598, icon: '🚢', title: 'נמרי המפרץ' },
  { id: 'beersheva', name: 'באר שבע', score: 4320400, players: 2912, icon: '🐪', title: 'סערת המדבר' },
  { id: 'rishon', name: 'ראשון לציון', score: 4115700, players: 2756, icon: '🍇', title: 'מאסטרי היין' },
  { id: 'netanya', name: 'נתניה', score: 3890200, players: 2140, icon: '⚡', title: 'יהלומי השרון' },
  { id: 'ashdod', name: 'אשדוד', score: 3650400, players: 1980, icon: '⚓', title: 'עוגן הדרום' },
  { id: 'petah', name: 'פתח תקווה', score: 3410900, players: 1720, icon: '🏙️', title: 'עיר העתיד' },
  { id: 'holon', name: 'חולון', score: 3120500, players: 1540, icon: '🎭', title: 'אלופי הילדים' },
  { id: 'batyam', name: 'בת ים', score: 2980300, players: 1390, icon: '🏖️', title: 'מלכי החוף' },
  { id: 'ramatgan', name: 'רמת גן', score: 2850100, players: 1280, icon: '💎', title: 'מגדלי הברזל' },
  { id: 'eilat', name: 'אילת', score: 2640800, players: 1120, icon: '🌴', title: 'דרום לוהט' },
  { id: 'herzliya', name: 'הרצליה', score: 2450000, players: 980, icon: '🚀', title: 'סטארטאפ ניישן' },
  { id: 'kfasaba', name: 'כפר סבא', score: 2310000, players: 890, icon: '🌳', title: 'העיר הירוקה' },
  { id: 'ashkelon', name: 'אשקלון', score: 2180000, players: 840, icon: '🛡️', title: 'חומת הדרום' },
  { id: 'tiberias', name: 'טבריה', score: 1950000, players: 760, icon: '🌊', title: 'פנינת הכנרת' },
];

export async function טעןדירוגערים(): Promise<עירמידע[]> {
  try {
    const res = await fetch(`${CITY_ENDPOINT}?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      const rawList = json?.data?.list;
      if (Array.isArray(rawList) && rawList.length > 0) {
        const decoded: עירמידע[] = rawList.map((c) => ({
          ...c,
          name: decodeURIComponent(c.name || ''),
          title: decodeURIComponent(c.title || ''),
        }));
        
        // מיזוג עם רשימת ברירת המחדל כדי שאף עיר לא תיעלם לעולם
        const map = new Map<string, עירמידע>();
        for (const d of עריברירתמחדל) map.set(d.name, d);
        for (const c of decoded) {
          const exist = map.get(c.name);
          if (exist) {
            map.set(c.name, { ...exist, score: Math.max(exist.score, c.score), players: Math.max(exist.players, c.players) });
          } else {
            map.set(c.name, c);
          }
        }
        const merged = Array.from(map.values()).sort((a, b) => b.score - a.score);
        localStorage.setItem('shvari_city_ranks_cache', JSON.stringify(merged));
        return merged;
      }
    }
  } catch {
    /* ignore */
  }

  return עריברירתמחדל.sort((a, b) => b.score - a.score);
}

export async function תרוםנקודותלעיר(שםעיר: string, נקודות: number): Promise<void> {
  if (!שםעיר || נקודות <= 0) return;
  try {
    const קיימות = await טעןדירוגערים();
    let עודכן = false;

    const מעודכנות = קיימות.map((ע) => {
      if (ע.name === שםעיר || ע.id === שםעיר) {
        עודכן = true;
        return {
          ...ע,
          score: ע.score + נקודות,
          players: ע.players + 1,
        };
      }
      return ע;
    });

    if (!עודכן) {
      מעודכנות.push({
        id: 'custom_' + Date.now(),
        name: שםעיר,
        score: נקודות,
        players: 1,
        icon: '🇮🇱',
        title: 'נבחרת העיר',
      });
    }

    const ממוין = מעודכנות.sort((a, b) => b.score - a.score);
    localStorage.setItem('shvari_city_ranks_cache', JSON.stringify(ממוין));

    const encoded = ממוין.map((c) => ({
      ...c,
      name: encodeURIComponent(c.name),
      title: encodeURIComponent(c.title),
    }));

    await fetch(CITY_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'shvari_cities',
        data: { list: encoded },
      }),
    });
  } catch {
    /* ignore */
  }
}
