const DUEL_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a04ccf2d01a0505020f30e7d';

export interface DuelRoom {
  id: string;
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

// 📤 פונקציית שיתוף אוניברסלית חכמה (Native Web Share + העתקה ללוח)
export async function shareLinkGeneric(title: string, text: string, url: string): Promise<'shared' | 'copied' | 'error'> {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch {
      /* ignore cancel */
    }
  }

  // Fallback להעתקה ללוח
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

async function fetchRooms(): Promise<Record<string, DuelRoom>> {
  try {
    const res = await fetch(DUEL_ENDPOINT, { cache: 'no-store' });
    if (!res.ok) return {};
    const json = await res.json();
    return json?.data?.rooms || {};
  } catch {
    return {};
  }
}

async function saveRooms(rooms: Record<string, DuelRoom>): Promise<void> {
  try {
    await fetch(DUEL_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'shvari_duel_rooms_v1',
        data: { rooms },
      }),
    });
  } catch {
    /* ignore */
  }
}

// 🎲 יצירת חדר קרב חדש
export async function createDuelRoom(hostName: string, totalPhrasesAvailable: number): Promise<DuelRoom> {
  const rooms = await fetchRooms();
  const id = Math.floor(1000 + Math.random() * 9000).toString(); // 4 ספרות
  
  // בחירת 15 אינדקסים של ביטויים אקראיים לסבב
  const indices: number[] = [];
  while (indices.length < 15) {
    const r = Math.floor(Math.random() * totalPhrasesAvailable);
    if (!indices.includes(r)) indices.push(r);
  }

  const newRoom: DuelRoom = {
    id,
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

  // ניקוי חדרים ישנים מעל 30 דקות
  const now = Date.now();
  const cleaned: Record<string, DuelRoom> = {};
  for (const [k, v] of Object.entries(rooms)) {
    if (now - v.createdAt < 30 * 60 * 1000) {
      cleaned[k] = v;
    }
  }
  cleaned[id] = newRoom;

  await saveRooms(cleaned);
  return newRoom;
}

// 🚪 הצטרפות לחדר קיים
export async function joinDuelRoom(roomId: string, guestName: string): Promise<DuelRoom | null> {
  const rooms = await fetchRooms();
  const room = rooms[roomId];
  if (!room) return null;

  room.guestName = guestName || 'שחקן 2';
  room.guestReady = true;
  room.status = 'countdown';
  room.updatedAt = Date.now();

  rooms[roomId] = room;
  await saveRooms(rooms);
  return room;
}

// 🔍 קבלת מצב חדר עדכני
export async function getDuelRoom(roomId: string): Promise<DuelRoom | null> {
  const rooms = await fetchRooms();
  return rooms[roomId] || null;
}

// ⚡ עדכון ניקוד ופגיעות של שחקן
export async function updateDuelPlayer(
  roomId: string,
  role: 'host' | 'guest',
  score: number,
  hits: number
): Promise<DuelRoom | null> {
  const rooms = await fetchRooms();
  const room = rooms[roomId];
  if (!room) return null;

  if (role === 'host') {
    room.hostScore = score;
    room.hostHits = hits;
    if (hits >= room.targetHits && !room.winner) {
      room.winner = room.hostName;
      room.status = 'ended';
    }
  } else {
    room.guestScore = score;
    room.guestHits = hits;
    if (hits >= room.targetHits && !room.winner) {
      room.winner = room.guestName;
      room.status = 'ended';
    }
  }

  room.updatedAt = Date.now();
  rooms[roomId] = room;
  await saveRooms(rooms);
  return room;
}

// 🔄 קרב חוזר (נקמה!)
export async function restartDuelRoom(roomId: string, totalPhrasesAvailable: number): Promise<DuelRoom | null> {
  const rooms = await fetchRooms();
  const room = rooms[roomId];
  if (!room) return null;

  const indices: number[] = [];
  while (indices.length < 15) {
    const r = Math.floor(Math.random() * totalPhrasesAvailable);
    if (!indices.includes(r)) indices.push(r);
  }

  room.hostScore = 0;
  room.hostHits = 0;
  room.guestScore = 0;
  room.guestHits = 0;
  room.phrasesIndices = indices;
  room.winner = null;
  room.status = 'countdown';
  room.updatedAt = Date.now();

  rooms[roomId] = room;
  await saveRooms(rooms);
  return room;
}
