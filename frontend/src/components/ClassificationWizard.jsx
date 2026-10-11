import { useState } from "react";
import { questions, classify } from "../services/classificationService";
import { sources } from "../data/mockSources";
function ClassificationWizard({ onSource }) {
  const [a, setA] = useState([]);
  const i = a.length;
  if (i >= questions.length) {
    const r = classify(a);
    return <div><span className="text-xs border border-line rounded-full px-2 py-0.5">Preliminary · not definitive</span>
    <h2 className="font-display text-3xl font-semibold my-3">{r.title}</h2><div className="grid sm:grid-cols-2 gap-3">{r.sections.map(([h, t]) => <div key={h} className="card"><b>{h}</b><p className="text-mut text-sm">{t}</p></div>)}</div>
    <div className="mt-4">{r.sourceIds.map((id) => <button key={id} className="chip" onClick={() => onSource(id)}>{sources.find((s) => s.id === id)?.title}</button>)}</div>
    <p className="bg-warn border border-line rounded-xl px-3 py-2 text-sm my-4">Discuss with an IP/regulatory professional. This result is indicative only.</p><button className="btn" onClick={() => setA([])}>Start over</button></div>;
  }
  return <div><h2 className="font-display text-3xl font-semibold">Classify Your Product</h2><p className="text-mut">Answer a few questions to understand which framework may apply.</p>
    <p className="text-sm text-mut mt-4">Step {i + 1} of {questions.length}</p><div className="h-1 bg-line rounded my-2"><div className="h-full bg-ac rounded transition-all" style={{ width: (i + 1) * 20 + "%" }} /></div>
    <h3 className="font-medium my-4">{questions[i].q}</h3>{questions[i].o.map((o, k) => <button key={o} className="card block w-full text-left mb-2 hover:border-ac" onClick={() => setA([...a, k])}>{o}</button>)}
    {i > 0 && <button className="btn" onClick={() => setA(a.slice(0, -1))}>Back</button>}</div>;
}
export {
  ClassificationWizard as default
};
