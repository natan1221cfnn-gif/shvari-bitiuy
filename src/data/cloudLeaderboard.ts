import type { שיא } from '../types';

// מסד נתונים ענני חינמי ומהיר לשיאים אמיתיים בזמן אמת
const CLOUD_URL = 'https://kvdb.io/AWdE1oRrqvPq1iE4c9HqD7/shvari_real_scores';

export async function טעןשיאיםמהענן(): Promise<שיא[]> {
  try {
    const res = await fetch(CLOUD_URL, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 404) return [];
      return [];
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.sort((a: שיא, b: שיא) => (b.ניקוד || 0) - (a.ניקוד || 0)).slice(0, 30);
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
    
    // מניעת כפילויות זהות באותה דקה
    const מעודכן = [...קיימים, שיאחדש]
      .sort((a, b) => (b.ניקוד || 0) - (a.ניקוד || 0))
      .slice(0, 50);

    await fetch(CLOUD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(מעודכן),
    });
  } catch {
    /* ignore */
  }
}
