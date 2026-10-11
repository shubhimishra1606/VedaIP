import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { getSource } from "../services/sourceService";
function SourceDrawer({ id, onClose }) {
  const [s, setS] = useState();
  useEffect(() => {
    getSource(id).then(setS);
  }, [id]);
  return <motion.aside initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white border-l border-line shadow-2xl p-6 z-30 overflow-auto">
    <button onClick={onClose} className="float-right" aria-label="Close"><X size={18} /></button>
    {!s ? <p className="text-mut">Retrieving source…</p> : <>
      <span className="text-[11px] px-2 py-0.5 rounded bg-gold text-white font-semibold">{s.type}</span>
      <span className="ml-2 text-xs">{s.jurisdiction === "IN" ? "\u{1F1EE}\u{1F1F3} India" : "\u{1F310} International"}</span>
      <h2 className="text-xl font-semibold mt-3">{s.title}</h2>
      <p className="text-sm text-mut">{s.section} · {s.updated}</p>
      <blockquote className="my-4 border-l-4 border-gold bg-bg px-4 py-2 text-sm text-mut">{s.passage}</blockquote>
      <div className="flex gap-2"><button className="btn btn-p">Open source</button><button className="btn">Add to research</button></div></>}
  </motion.aside>;
}
export {
  SourceDrawer as default
};
