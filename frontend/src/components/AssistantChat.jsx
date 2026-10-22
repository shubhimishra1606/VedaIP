import { useEffect, useRef, useState } from "react";
import { Paperclip, Mic, Send } from "lucide-react";
import { motion } from "framer-motion";
import { askQuestion } from "../services/chatService";
import { sources } from "../data/mockSources";
import Disclaimer from "./Disclaimer";

const PROMPTS = ["Can I patent this Ayurvedic formulation?", "Does my product require ABS compliance?", "Is this formulation considered a classical medicine?", "What IP protection is available for my herbal product?", "What are the requirements for exporting this product?", "How does the WIPO GRATK Treaty affect traditional knowledge?"];
const H = ({ children }) => <h4 className="text-xs uppercase tracking-wider text-mut">{children}</h4>;

function AssistantChat({ jur, lang, initial, onSource }) {

  const [msgs, setMsgs] = useState([]);
  const [v, setV] = useState("");
  const end = useRef(null);

  const send = async (q) => {
    if (!q.trim()) return;
    setV("");
    setMsgs((m) => [...m, { q, loading: true }]);
    const a = await askQuestion(q, jur, lang);
    setMsgs((m) => m.map((x, i) => i === m.length - 1 ? { q, a } : x));
  };

  useEffect(() => {
    if (initial) send(initial);
  }, []);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const chip = (id) => <button key={id} className="chip" onClick={() => onSource(id)}>{sources.find((s) => s.id === id)?.title}</button>;

  return <div className="pb-44">

    {!msgs.length && <div className="text-center pt-10">
      <h1 className="font-display text-4xl font-semibold">How can VedaIP help?</h1>
      <p className="text-mut mt-2">Every answer is traced to a source.</p>
      <div className="grid sm:grid-cols-2 gap-3 mt-8 text-left">
        {PROMPTS.map((p) => <button key={p} className="card hover:border-gold transition" onClick={() => send(p)}>{p}</button>)}
      </div>
    </div>}

    {msgs.map((m, i) => <div key={i}><div className="ml-auto mt-6 w-fit max-w-[85%] bg-acs rounded-2xl px-4 py-2">{m.q}</div>
      {m.loading ? <div className="card mt-4 text-mut animate-pulse">Retrieving sources…</div> : m.a ? <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="card mt-4 space-y-3">
        <div className="text-xs flex gap-2">
          <span className="border border-line rounded-full px-2">{jur === "IN" ? "\u{1F1EE}\u{1F1F3} India" : "\u{1F310} International"}</span>
          <span className="border border-line rounded-full px-2">Answer language: {lang}</span></div>
        <section><H>Answer</H><p>{m.a.answer}</p></section>
        <section><H>Why</H><p>{m.a.why}</p></section>
        <section><H>Applicable framework</H>{m.a.framework.map((f) => <span key={f} className="mr-1 text-xs border border-line rounded-full px-2 py-0.5">{f}</span>)}</section>
        <section><H>Sources</H>{m.a.sourceIds.map(chip)}</section>
        <section><H>Confidence</H><div className="flex items-center gap-2 text-sm"><div className="h-1.5 w-28 bg-line rounded"><div className="h-full bg-ac rounded" style={{ width: m.a.confidence + "%" }} /></div>{m.a.confidence >= 80 ? "High" : "Moderate"} confidence</div></section>
        <section><H>Next steps</H><ol className="list-decimal pl-5">{m.a.nextSteps.map((n) => <li key={n}>{n}</li>)}</ol></section>
        <div className="bg-warn border border-line rounded-xl px-3 py-2 text-sm">⚖ VedaIP provides information and research assistance, not legal advice.</div>
      </motion.div> : <div className="card mt-4 border-gold"><b>I couldn't verify this confidently from the available sources.</b>
        <div className="flex gap-2 mt-3 flex-wrap"><button className="btn">View sources</button><button className="btn">Refine question</button><button className="btn">Escalate to expert</button></div></div>}</div>)}
    <div ref={end} />
    <div className="fixed inset-x-0 bottom-0 px-4 pb-3 pt-6 bg-gradient-to-t from-bg via-bg"><div className="max-w-3xl mx-auto card !p-3 shadow-lg">
      <div className="text-xs text-mut flex gap-4 mb-1 flex-wrap"><span>Jurisdiction: {jur === "IN" ? "India" : "International"}</span><span>Source: Official / Verified</span><span>Language: {lang}</span></div>
      <div className="flex items-center gap-2"><Paperclip size={18} /><input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(v)} placeholder="Ask about patents, ABS, classification…" className="flex-1 outline-none bg-transparent min-w-0" /><Mic size={18} />
        <button onClick={() => send(v)} className="btn btn-p !p-2" aria-label="Send"><Send size={16} /></button></div>
      <div className="mt-2"><Disclaimer /></div></div></div></div>;
}
export {
  AssistantChat as default
};
