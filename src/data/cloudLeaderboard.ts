import type { שיא } from '../types';

// מסד נתונים ענני חינמי, גלובלי ומהיר לשיאים אמיתיים בזמן אמת
const CLOUD_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a04ccf2d01a05043f1ea0e5a';

export async function טעןשיאיםמהענן(): Promise<שיא[]> {
  try {
    const res = await fetch(CLOUD_ENDPOINT, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    const scores = json?.data?.scores;
    if (Array.isArray(scores)) {
      return scores.sort((a: שיא, b: שיא) => (b.ניקוד || 0) - (a.ניקוד || 0)).slice(0, 50);
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

    // מניעת כפילויות של אותה תוצאה בדיוק
    const קיים = קיימים.some(
      (s) => s.שם === שיאחדש.שם && s.ניקוד === שיאחדש.ניקוד && s.תאריך === שיאחדש.תאריך
    );
    if (קיים) return;

    const מעודכן = [...קיימים, שיאחדש]
      .sort((a, b) => (b.ניקוד || 0) - (a.ניקוד || 0))
      .slice(0, 50);

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
