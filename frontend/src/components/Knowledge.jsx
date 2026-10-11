import { useEffect, useState } from "react";
import { searchSources } from "../services/sourceService";
function Knowledge({ onSource }) {
  const [q, setQ] = useState("");
  const [r, setR] = useState([]);
  useEffect(() => {
    searchSources(q).then(setR);
  }, [q]);
  return <div><h2 className="font-display text-3xl font-semibold">Knowledge &amp; Sources</h2>
    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search statutes, treaties, regulations, cases…" className="w-full my-3 px-4 py-3 rounded-xl border border-line bg-white" />
    {!r.length ? <div className="card text-center text-mut">No results. Try “biodiversity”.</div> : <div className="grid sm:grid-cols-2 gap-3">{r.map((s) => <button key={s.id} className="card text-left hover:border-gold transition" onClick={() => onSource(s.id)}>
      <span className="text-[11px] px-2 py-0.5 rounded bg-gold text-white">{s.type}</span> <span className="text-xs">{s.jurisdiction === "IN" ? "\u{1F1EE}\u{1F1F3}" : "\u{1F310}"}</span>
      <div className="font-medium mt-2">{s.title}</div><div className="text-sm text-mut">{s.passage.slice(0, 90)}…</div><div className="text-xs text-mut mt-1">{s.updated}</div></button>)}</div>}
    <p className="bg-warn border border-line rounded-xl px-3 py-2 text-sm mt-6">Traditional knowledge may affect novelty and patentability. Results are informational and should be professionally verified.</p></div>;
}
export {
  Knowledge as default
};
