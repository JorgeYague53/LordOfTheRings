  fetch("https://the-one-api.dev/v2/character?limit=1000", headers)
  .then(r => r.json())
  .then(data => buildArray(data.docs))   // <- this adds the image
  .then(characters => showCharacters(characters));
  async function fetchThumbs(titles) {
  const list = titles.map(t => encodeURIComponent(t.replace(/ /g, "_"))).join(",");
  const url = "https://lotr.fandom.com/api/v1/Articles/Details?abstract=0&width=400&height=533&titles=" + list;
  const res = await fetch(url);
  const data = await res.json();

  const out = {};
  Object.values(data.items || {}).forEach(it => { out[it.title] = it.thumbnail || null; });
  titles.forEach(t => { if (!(t in out)) out[t] = null; });
  return out;
}
// inside buildArray, replace the empty catch:
try { Object.assign(found, await fetchThumbs(titles.slice(i, i + 50))); }
catch (e) { console.error("wiki request failed:", e); }