async function main() {
  const appRes = await fetch('https://keyvalue.immanuel.co/api/KeyVal/CreateApp', { method: 'POST' });
  const appKeyRaw = await appRes.text();
  const appKey = appKeyRaw.replace(/"/g, '').trim();
  console.log('CREATED APP KEY:', appKey);

  const initialScores = [
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

  const setRes = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/SetValue/${appKey}/leaderboard/${encodeURIComponent(JSON.stringify(initialScores))}`, { method: 'POST' });
  console.log('SET STATUS:', setRes.status);

  const getRes = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/${appKey}/leaderboard`);
  const getJson = await getRes.json();
  console.log('GET JSON:', getJson);
}

main().catch(console.error);
