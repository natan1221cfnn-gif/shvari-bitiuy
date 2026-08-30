const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const svg = `
<svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg" direction="rtl">
  <defs>
    <!-- Background Gradients -->
    <radialGradient id="bgGlow" cx="50%" cy="20%" r="80%">
      <stop offset="0%" stop-color="#2c0b4d"/>
      <stop offset="50%" stop-color="#120424"/>
      <stop offset="100%" stop-color="#040108"/>
    </radialGradient>

    <!-- Card 1: 100K Phoenix Fire -->
    <linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff0844"/>
      <stop offset="50%" stop-color="#ff4e50"/>
      <stop offset="100%" stop-color="#f9d423"/>
    </linearGradient>

    <!-- Card 2: 200K Quantum Thunder -->
    <linearGradient id="thunderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff"/>
      <stop offset="50%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#9333ea"/>
    </linearGradient>

    <!-- Card 3: 400K Cosmic Black Hole -->
    <linearGradient id="cosmicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d946ef"/>
      <stop offset="50%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>

    <!-- Card 4: 500K Prismatic Diamond -->
    <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="35%" stop-color="#f472b6"/>
      <stop offset="70%" stop-color="#facc15"/>
      <stop offset="100%" stop-color="#4ade80"/>
    </linearGradient>

    <!-- Card 5: 1M God Monarch -->
    <linearGradient id="godGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe259"/>
      <stop offset="50%" stop-color="#ffa751"/>
      <stop offset="100%" stop-color="#ff3366"/>
    </linearGradient>

    <!-- Filter Glows -->
    <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1920" fill="url(#bgGlow)"/>

  <!-- Cyber Grid Lines -->
  <g stroke="rgba(255,255,255,0.04)" stroke-width="2">
    <line x1="100" y1="0" x2="100" y2="1920"/>
    <line x1="300" y1="0" x2="300" y2="1920"/>
    <line x1="540" y1="0" x2="540" y2="1920"/>
    <line x1="780" y1="0" x2="780" y2="1920"/>
    <line x1="980" y1="0" x2="980" y2="1920"/>
  </g>

  <!-- Header Section -->
  <g transform="translate(540, 110)">
    <text text-anchor="middle" fill="#00f0ff" font-size="34" font-weight="900" letter-spacing="4">SHVARI BITIUY • GOD-TIER ARSENAL</text>
    <text text-anchor="middle" y="65" fill="#ffffff" font-size="56" font-weight="900">5 סקינים מיתולוגיים חדשים 🔥</text>
    <text text-anchor="middle" y="110" fill="rgba(255,255,255,0.6)" font-size="28" font-weight="bold">נפתחים אוטומטית רק לגדולים מכולם לפי ניקוד שיא</text>
  </g>

  <!-- 1. TIER 1: 100,000 PHOENIX FIRE -->
  <g transform="translate(70, 270)">
    <rect width="940" height="270" rx="30" fill="rgba(255,255,255,0.04)" stroke="#ff4e50" stroke-width="3" filter="url(#glowGold)"/>
    <rect width="940" height="270" rx="30" fill="url(#fireGrad)" opacity="0.15"/>
    
    <!-- Badge Box -->
    <rect x="740" y="35" width="160" height="200" rx="24" fill="#1f0710" stroke="#ff4e50" stroke-width="2"/>
    <text x="820" y="125" text-anchor="middle" font-size="65">🐉🔥</text>
    <text x="820" y="195" text-anchor="middle" fill="#ff4e50" font-size="22" font-weight="bold">סייבר להבה</text>

    <!-- Details -->
    <text x="700" y="75" text-anchor="end" fill="#ffffff" font-size="40" font-weight="900">פניקס הלהבה • 100,000 נק׳</text>
    <text x="700" y="125" text-anchor="end" fill="#fca5a5" font-size="26" font-weight="bold">שובל גחלים לוהטות + סופרנובה מתפוצצת בחיבור</text>
    <text x="700" y="170" text-anchor="end" fill="rgba(255,255,255,0.5)" font-size="22">שאגת דרקון עמוקה + אפקט אש שמבעיר את המסילה</text>

    <!-- Points Tag -->
    <rect x="40" y="40" width="160" height="50" rx="15" fill="#ff4e50"/>
    <text x="120" y="74" text-anchor="middle" fill="#000000" font-size="24" font-weight="900">100,000 ⭐</text>
  </g>

  <!-- 2. TIER 2: 200,000 QUANTUM THUNDER -->
  <g transform="translate(70, 580)">
    <rect width="940" height="270" rx="30" fill="rgba(255,255,255,0.04)" stroke="#00f0ff" stroke-width="3" filter="url(#glowCyan)"/>
    <rect width="940" height="270" rx="30" fill="url(#thunderGrad)" opacity="0.15"/>
    
    <!-- Badge Box -->
    <rect x="740" y="35" width="160" height="200" rx="24" fill="#031526" stroke="#00f0ff" stroke-width="2"/>
    <text x="820" y="125" text-anchor="middle" font-size="65">⚡🌩️</text>
    <text x="820" y="195" text-anchor="middle" fill="#00f0ff" font-size="22" font-weight="bold">רעם קוונטי</text>

    <!-- Details -->
    <text x="700" y="75" text-anchor="end" fill="#ffffff" font-size="40" font-weight="900">ת׳ור רעם קוונטי • 200,000 נק׳</text>
    <text x="700" y="125" text-anchor="end" fill="#7dd3fc" font-size="26" font-weight="bold">שובל פריקות חשמל כחולות + מכת ברק מחשמלת</text>
    <text x="700" y="170" text-anchor="end" fill="rgba(255,255,255,0.5)" font-size="22">צליל רעם קוסמי שמקפיץ את כל השברים יחד</text>

    <!-- Points Tag -->
    <rect x="40" y="40" width="160" height="50" rx="15" fill="#00f0ff"/>
    <text x="120" y="74" text-anchor="middle" fill="#000000" font-size="24" font-weight="900">200,000 ⚡</text>
  </g>

  <!-- 3. TIER 3: 400,000 COSMIC BLACK HOLE -->
  <g transform="translate(70, 890)">
    <rect width="940" height="270" rx="30" fill="rgba(255,255,255,0.04)" stroke="#d946ef" stroke-width="3" filter="url(#glowGold)"/>
    <rect width="940" height="270" rx="30" fill="url(#cosmicGrad)" opacity="0.25"/>
    
    <!-- Badge Box -->
    <rect x="740" y="35" width="160" height="200" rx="24" fill="#170424" stroke="#d946ef" stroke-width="2"/>
    <text x="820" y="125" text-anchor="middle" font-size="65">🕳️🌌</text>
    <text x="820" y="195" text-anchor="middle" fill="#d946ef" font-size="22" font-weight="bold">חור שחור</text>

    <!-- Details -->
    <text x="700" y="75" text-anchor="end" fill="#ffffff" font-size="40" font-weight="900">חור שחור גלקטי • 400,000 נק׳</text>
    <text x="700" y="125" text-anchor="end" fill="#f0abfc" font-size="26" font-weight="bold">עיוות מרחב (Space Warp) + שאיבת כוכבים לחיבור</text>
    <text x="700" y="170" text-anchor="end" fill="rgba(255,255,255,0.5)" font-size="22">אבק ערפיליות זוהר בצבעי אינדיגו ומג׳נטה</text>

    <!-- Points Tag -->
    <rect x="40" y="40" width="160" height="50" rx="15" fill="#d946ef"/>
    <text x="120" y="74" text-anchor="middle" fill="#ffffff" font-size="24" font-weight="900">400,000 🌌</text>
  </g>

  <!-- 4. TIER 4: 500,000 PRISMATIC DIAMOND -->
  <g transform="translate(70, 1200)">
    <rect width="940" height="270" rx="30" fill="rgba(255,255,255,0.04)" stroke="#38bdf8" stroke-width="3" filter="url(#glowCyan)"/>
    <rect width="940" height="270" rx="30" fill="url(#diamondGrad)" opacity="0.2"/>
    
    <!-- Badge Box -->
    <rect x="740" y="35" width="160" height="200" rx="24" fill="#041a24" stroke="#38bdf8" stroke-width="2"/>
    <text x="820" y="125" text-anchor="middle" font-size="65">💎✨</text>
    <text x="820" y="195" text-anchor="middle" fill="#38bdf8" font-size="22" font-weight="bold">יהלום על-חלל</text>

    <!-- Details -->
    <text x="700" y="75" text-anchor="end" fill="#ffffff" font-size="40" font-weight="900">יהלום פריזמטי • 500,000 נק׳</text>
    <text x="700" y="125" text-anchor="end" fill="#bae6fd" font-size="26" font-weight="bold">שבירת אור הולוגרפית ב-7 צבעי הקשת + לייזרים</text>
    <text x="700" y="170" text-anchor="end" fill="rgba(255,255,255,0.5)" font-size="22">צלצול קריסטל יוקרתי (פתוח לחבר של בוסיקו! 👑)</text>

    <!-- Points Tag -->
    <rect x="40" y="40" width="160" height="50" rx="15" fill="#38bdf8"/>
    <text x="120" y="74" text-anchor="middle" fill="#000000" font-size="24" font-weight="900">500,000 💎</text>
  </g>

  <!-- 5. TIER 5: 1,000,000 SUPREME GOD MONARCH -->
  <g transform="translate(70, 1510)">
    <rect width="940" height="290" rx="30" fill="rgba(255,255,255,0.05)" stroke="#fbbf24" stroke-width="4" filter="url(#glowGold)"/>
    <rect width="940" height="290" rx="30" fill="url(#godGrad)" opacity="0.3"/>
    
    <!-- Badge Box -->
    <rect x="740" y="45" width="160" height="200" rx="24" fill="#241502" stroke="#fbbf24" stroke-width="3"/>
    <text x="820" y="130" text-anchor="middle" font-size="65">👑🪐</text>
    <text x="820" y="200" text-anchor="middle" fill="#fbbf24" font-size="22" font-weight="bold">אלוהי המגנטים</text>

    <!-- Details -->
    <text x="700" y="85" text-anchor="end" fill="#ffffff" font-size="42" font-weight="900">כתר האלמוות GTA GOD • 1,000,000</text>
    <text x="700" y="135" text-anchor="end" fill="#fef08a" font-size="26" font-weight="bold">קרני שמש קדושות + שובל זיקוקי זהב אינסופי</text>
    <text x="700" y="180" text-anchor="end" fill="rgba(255,255,255,0.6)" font-size="22">רעידת אדמה ותרועת חצוצרות שמציפות את כל המשחק בזהב!</text>

    <!-- Points Tag -->
    <rect x="40" y="45" width="180" height="55" rx="16" fill="#fbbf24"/>
    <text x="130" y="82" text-anchor="middle" fill="#000000" font-size="24" font-weight="900">1,000,000 👑</text>
  </g>

  <!-- Footer Challenge -->
  <text x="540" y="1860" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="26" font-weight="bold">warm-paddle-156.harvis.page • שברי ביטוי 🧲</text>
</svg>
`;

async function renderPoster() {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1080,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  const outPath1 = path.join(__dirname, 'public', 'god_tier_skins_showcase.png');
  const outPathDist = path.join(__dirname, 'dist', 'god_tier_skins_showcase.png');
  const outPathArtifact = 'C:\\Users\\natan\\.gemini\\antigravity\\brain\\bd8ba70e-e99b-44ef-89b3-8a6f2ca9ea6d\\god_tier_skins_showcase.png';

  fs.writeFileSync(outPath1, pngBuffer);
  try { fs.writeFileSync(outPathDist, pngBuffer); } catch(e) {}
  try { fs.writeFileSync(outPathArtifact, pngBuffer); } catch(e) {}

  console.log('✅ Generated Poster PNG successfully at:', outPath1);
}

renderPoster();
