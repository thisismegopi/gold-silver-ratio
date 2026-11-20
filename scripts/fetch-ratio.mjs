// Runs in GitHub Actions (Node 20+). Fetches gold & silver spot prices and writes data.json.
import { writeFile } from "node:fs/promises";

const UA = { "User-Agent": "Mozilla/5.0 (gold-silver-ratio GitHub Pages tool)", Accept: "application/json" };

async function getJSON(url) {
  const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(15000) });
  if (!r.ok) throw new Error(`${url} -> HTTP ${r.status}`);
  return r.json();
}

const sources = [
  async () => {
    const j = await getJSON("https://data-asg.goldprice.org/dbXRates/USD");
    const it = j.items?.[0];
    return { gold: +it.xauPrice, silver: +it.xagPrice, source: "goldprice.org" };
  },
  async () => {
    const [g, s] = await Promise.all([
      getJSON("https://api.gold-api.com/price/XAU"),
      getJSON("https://api.gold-api.com/price/XAG"),
    ]);
    return { gold: +g.price, silver: +s.price, source: "gold-api.com" };
  },
];

for (const load of sources) {
  try {
    const d = await load();
    if (!(d.gold > 0 && d.silver > 0)) throw new Error("bad values " + JSON.stringify(d));
    const out = { ...d, ratio: +(d.gold / d.silver).toFixed(4), time: new Date().toISOString() };
    await writeFile("data.json", JSON.stringify(out, null, 2) + "\n");
    console.log("Wrote data.json:", out);
    process.exit(0);
  } catch (e) {
    console.warn("Source failed:", e.message);
  }
}
console.error("All sources failed; data.json left unchanged.");
process.exit(0); // don't fail the workflow; the page will just show the older cached value
