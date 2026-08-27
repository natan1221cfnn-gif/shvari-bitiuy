import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

export function useHaptic() {
  const { הגדרות } = useGameStore();

  const רטט = useCallback(
    (דפוס: number | number[]) => {
      if (!הגדרות.רטט) return;
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(דפוס);
        } catch {}
      }
    },
    [הגדרות.רטט]
  );

  const רטטהצלחה = useCallback(() => רטט([30, 10, 30]), [רטט]);
  const רטטכישלון = useCallback(() => רטט([100, 50, 100]), [רטט]);
  const רטטקומבו = useCallback((מכפיל: number) => {
    const דפוס = Array.from({ length: מכפיל }, (_, i) => [20 + i * 10, 10]).flat();
    רטט(דפוס);
  }, [רטט]);
  const רטטקל = useCallback(() => רטט(15), [רטט]);

  return { רטטהצלחה, רטטכישלון, רטטקומבו, רטטקל };
}
