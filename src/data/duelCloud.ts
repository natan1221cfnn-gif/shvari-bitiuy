const REGISTRY_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a04ccf2d01a0505020f30e7d';

export interface DuelRoom {
  id: string; // קוד חדר מקוצר 4 ספרות
  cloudId?: string; // מזהה ענן ייעודי של החדר
  hostName: string;
  hostScore: number;
  hostHits: number;
  hostReady: boolean;
  guestName: string | null;
  guestScore: number;
  guestHits: number;
  guestReady: boolean;
  status: 'waiting' | 'countdown' | 'playing' | 'ended';
  phrasesIndices: number[];
  targetHits: number;
  winner: string | null;
  createdAt: number;
  updatedAt: number;
}

// 📤 שיתוף אוניברסלי (Native Web Share + העתקה ללוח)
export async function shareLinkGeneric(title: string, text: string, url: string): Promise<'shared' | 'copied' | 'error'> {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch {
      /* ignore cancel */
    }
  }

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      return 'copied';
    }
  } catch {
    /* ignore */
  }

  return 'error';
}

// 🎲 יצירת חדר קרב ייעודי ועצמאי בענן (ללא שום התנגשות ופועל מיד!)
export async function createDuelRoom(hostName: string, totalPhrasesAvailable: number): Promise<DuelRoom> {
  const shortCode = Math.floor(1000 + Math.random() * 9000).toString();
  
  const indices: number[] = [];
  while (indices.length < 15) {
    const r = Math.floor(Math.random() * totalPhrasesAvailable);
    if (!indices.includes(r)) indices.push(r);
  }

  const roomData: DuelRoom = {
    id: shortCode,
    hostName: hostName || 'שחקן 1',
    hostScore: 0,
    hostHits: 0,
    hostReady: true,
    guestName: null,
    guestScore: 0,
    guestHits: 0,
    guestReady: false,
    status: 'waiting',
    phrasesIndices: indices,
    targetHits: 10,
    winner: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  try {
    // 1. יצירת אובייקט חדר ייעודי ונפרד בענן
    const createRes = await fetch('https://api.restful-api.dev/objects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `duel_room_${shortCode}`,
        data: roomData,
      }),
    });
    const createdObj = await createRes.json();
    roomData.cloudId = createdObj.id;

    // 2. רישום הקוד המקוצר במפת החדרים
    fetch(REGISTRY_ENDPOINT, { cache: 'no-store' })
      .then((r) => r.json())
      .then((json) => {
        const rooms = json?.data?.rooms || {};
        rooms[shortCode] = createdObj.id;
        fetch(REGISTRY_ENDPOINT, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'shvari_duel_rooms_v1',
            data: { rooms },
          }),
        }).catch(() => {});
      })
      .catch(() => {});

    // שמירה מקומית
    localStorage.setItem(`shvari_room_${shortCode}`, JSON.stringify(roomData));
    return roomData;
  } catch {
    return roomData;
  }
}

// 🚪 הצטרפות לחדר (לפי קוד 4 ספרות או מזהה ענן מלא)
export async function joinDuelRoom(roomIdOrCode: string, guestName: string): Promise<DuelRoom | null> {
  const query = roomIdOrCode.trim();
  let cloudId = query;

  // אם זה קוד של 4 ספרות - חפש את ה-cloudId ברישום
  if (query.length <= 6) {
    try {
      const regRes = await fetch(REGISTRY_ENDPOINT, { cache: 'no-store' });
      if (regRes.ok) {
        const json = await regRes.json();
        const rooms = json?.data?.rooms || {};
        if (rooms[query]) {
          cloudId = rooms[query];
        }
      }
    } catch {
      /* ignore */
    }
  }

  // שליפת החדר הישיר מהענן
  try {
    const res = await fetch(`https://api.restful-api.dev/objects/${cloudId}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    const room: DuelRoom = json?.data;
    if (!room) return null;

    room.cloudId = cloudId;
    room.guestName = guestName || 'שחקן 2';
    room.guestReady = true;
    room.status = 'countdown';
    room.updatedAt = Date.now();

    // עדכון מיידי בענן שהאורח נכנס
    await fetch(`https://api.restful-api.dev/objects/${cloudId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `duel_room_${room.id}`,
        data: room,
      }),
    });

    return room;
  } catch {
    return null;
  }
}

// 🔍 קבלת מצב חדר עדכני בזמן אמת
export async function getDuelRoom(room: DuelRoom): Promise<DuelRoom | null> {
  const targetId = room.cloudId || room.id;
  try {
    const res = await fetch(`https://api.restful-api.dev/objects/${targetId}`, { cache: 'no-store' });
    if (!res.ok) return room;
    const json = await res.json();
    if (json?.data) {
      return { ...json.data, cloudId: targetId };
    }
    return room;
  } catch {
    return room;
  }
}

// ⚡ עדכון ניקוד ופגיעות של שחקן
export async function updateDuelPlayer(
  room: DuelRoom,
  role: 'host' | 'guest',
  score: number,
  hits: number
): Promise<DuelRoom | null> {
  const updated = { ...room };
  if (role === 'host') {
    updated.hostScore = score;
    updated.hostHits = hits;
    if (hits >= updated.targetHits && !updated.winner) {
      updated.winner = updated.hostName;
      updated.status = 'ended';
    }
  } else {
    updated.guestScore = score;
    updated.guestHits = hits;
    if (hits >= updated.targetHits && !updated.winner) {
      updated.winner = updated.guestName;
      updated.status = 'ended';
    }
  }

  updated.updatedAt = Date.now();
  const targetId = room.cloudId || room.id;

  fetch(`https://api.restful-api.dev/objects/${targetId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `duel_room_${updated.id}`,
      data: updated,
    }),
  }).catch(() => {});

  return updated;
}

// 🔄 קרב חוזר (נקמה!)
export async function restartDuelRoom(room: DuelRoom, totalPhrasesAvailable: number): Promise<DuelRoom | null> {
  const indices: number[] = [];
  while (indices.length < 15) {
    const r = Math.floor(Math.random() * totalPhrasesAvailable);
    if (!indices.includes(r)) indices.push(r);
  }

  const updated: DuelRoom = {
    ...room,
    hostScore: 0,
    hostHits: 0,
    guestScore: 0,
    guestHits: 0,
    phrasesIndices: indices,
    winner: null,
    status: 'countdown',
    updatedAt: Date.now(),
  };

  const targetId = room.cloudId || room.id;
  fetch(`https://api.restful-api.dev/objects/${targetId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `duel_room_${updated.id}`,
      data: updated,
    }),
  }).catch(() => {});

  return updated;
}
