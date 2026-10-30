import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf, Sparkles, Check, ArrowUpRight, Scale, ScrollText, FlaskConical, BadgeCheck, Globe, Search, ShieldCheck } from "lucide-react";
import JurisdictionToggle from "./components/JurisdictionToggle";
import SourceDrawer from "./components/SourceDrawer";
import AssistantChat from "./components/AssistantChat";
import ClassificationWizard from "./components/ClassificationWizard";
import Knowledge from "./components/Knowledge";
import Disclaimer from "./components/Disclaimer";
import Login from "./Pages/Login";
import { getToken, logout } from "./api";

const LANGS = ["English","Hindi","Malayalam","Tamil","Telugu","Kannada","Bengali","Marathi","Gujarati","Punjabi","Odia","Assamese"];

const CARDS = [
  ["Patentability","Can I patent this Ayurvedic formulation?",Scale],
  ["Traditional Knowledge","How does the WIPO GRATK Treaty affect traditional knowledge?",ScrollText],
  ["ABS Compliance","Does my product require ABS compliance?",Leaf],
  ["Formulation Classification","Is this formulation considered a classical medicine?",FlaskConical],
  ["Trademark / GI","What IP protection is available for my herbal product?",BadgeCheck],
  ["International IP","What are the requirements for exporting this product?",Globe]];

const label = { home: "Home", assistant: "Ask VedaIP", classify: "Classify", knowledge: "Knowledge" };

const fade = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: .35 } };


export default function App() {

  const [view, setView] = useState("home"); 
  const [jur, setJur] = useState("IN"); 
  const [lang, setLang] = useState("English");
  const [src, setSrc] = useState(null); 
  const [pre, setPre] = useState(); 
  const [toast, setToast] = useState("");
  const [authed, setAuthed] = useState(!!getToken());

  const changeJur = j => { setJur(j); 
    setToast(j === "IN" ? "Showing India-specific sources and requirements." : "Showing international frameworks and market-access requirements."); 
    setTimeout(() => setToast(""), 2200); 
  };

  if(!authed) return <Login onLoggedIn={() => setAuthed(true)} />;

  return <div className="min-h-screen">
    
    <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 px-4 sm:px-6 py-3 bg-bg/80 backdrop-blur-md border-b border-line">
      <button onClick={() => setView("home")} className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-xl bg-ac grid place-items-center text-white shadow-soft"><Leaf size={17}/></span>
        <span className="font-display text-xl font-semibold tracking-tight">Veda<span className="text-gold">IP</span></span>
      </button>
      <nav className="flex gap-1 order-last w-full sm:order-none sm:w-auto sm:ml-4 overflow-x-auto">{Object.keys(label).map(v =>
        <button key={v} onClick={() => { setPre(undefined); setView(v); }} className={`px-3.5 py-1.5 rounded-full text-sm whitespace-nowrap transition ${view === v ? "bg-ink text-white" : "text-mut hover:text-ink"}`}>{label[v]}</button>)}
      </nav>
      <div className="flex-1"/><JurisdictionToggle value={jur} onChange={changeJur}/>
      <select value={lang} onChange={e => setLang(e.target.value)} className="border border-line rounded-xl px-2.5 py-1.5 text-sm bg-white" aria-label="Language">{LANGS.map(l => <option key={l}>{l}</option>)}</select>
      <button onClick={() => { logout(); setAuthed(false); }} className="text-sm text-mut hover:text-ink">Logout</button>
    </header>

    <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-ink text-white text-sm px-4 py-2 rounded-full shadow-lift">{toast}</motion.div>}</AnimatePresence>
    {view === "home" && <div className="hero-bg"><div className="dots">
      <motion.section {...fade} className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium border border-line rounded-full px-3.5 py-1.5 text-ac bg-white shadow-soft"><Sparkles size={13} className="text-gold"/>AI-powered IP &amp; Regulatory Guidance for Ayurveda</span>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.08] my-6">Navigate Ayurveda's IP &amp; Regulatory Landscape with <em className="text-ac not-italic underline decoration-gold decoration-4 underline-offset-8">Confidence.</em></h1>
        <p className="text-lg text-mut max-w-2xl mx-auto">Get source-cited guidance across patents, traditional knowledge, biodiversity, regulatory compliance, and international IP regimes.</p>
        <div className="flex gap-3 mt-8 justify-center flex-wrap"><button className="btn btn-p !px-7 !py-3" onClick={() => setView("assistant")}>Ask VedaIP</button><button className="btn !px-7 !py-3" onClick={() => setView("knowledge")}>Explore Knowledge</button></div>
        <div className="flex flex-wrap justify-center gap-2 mt-10">{["Source-cited answers","India & International","Multilingual","RAG-powered","Information, not legal advice"].map(t =>
          <span key={t} className="inline-flex items-center gap-1.5 text-xs bg-white/80 border border-line rounded-full px-3 py-1.5 text-mut"><Check size={12} className="text-ac"/>{t}</span>)}</div>
      </motion.section></div></div>}
    <main className={`max-w-5xl mx-auto px-4 sm:px-6 ${view === "home" ? "pb-10" : "py-10 max-w-4xl"}`}>
      {view === "home" && <motion.div {...fade}>
        <h2 className="font-display text-2xl font-semibold mb-1">What can I help with?</h2><p className="text-mut mb-5 text-sm">Pick a topic and VedaIP starts with a ready question.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">{CARDS.map(([t, q, Icon]) =>
          <button key={t} onClick={() => { setPre(q); setView("assistant"); }} className="group card !p-5 text-left hover:border-gold hover:-translate-y-1 hover:shadow-lift transition">
            <div className="flex justify-between">
              <span className="w-10 h-10 rounded-xl bg-acs text-ac grid place-items-center group-hover:bg-ac group-hover:text-white transition"><Icon size={19}/></span><ArrowUpRight size={18} className="text-mut group-hover:text-gold transition"/>
            </div>
            <b className="block mt-4 font-display text-lg">{t}</b>
            <p className="text-sm text-mut mt-1">{q}</p></button>)}
        </div>
        <h2 className="font-display text-2xl font-semibold mb-5">From Question → Source → Action</h2>
        <div className="grid md:grid-cols-3 gap-4">{[["Ask your question",Search],["Retrieve authoritative sources",ScrollText],["Get a traceable answer",ShieldCheck]].map(([s, Icon], i) =>
          <div key={s} className="card !p-5 flex gap-3 items-center">
            <span className="font-display text-3xl text-gold/70">{i + 1}</span>
            <span className="flex-1 font-medium">{s}</span>
            <Icon size={20} className="text-ac"/></div>)}
          </div>
        <div className="card !p-6 mt-8 border-l-4 !border-l-gold"><div className="text-[11px] tracking-widest text-mut mb-2">EXAMPLE ANSWER · 🇮🇳 INDIA</div>
          <p>Purely traditional formulations are generally not patentable in India.
          <button className="chip ml-2" onClick={() => setSrc("patents")}>Patents Act, 1970</button><button className="chip" onClick={() => setSrc("tkdl")}>Traditional Knowledge Digital Library</button></p>
          <div className="flex items-center gap-2 text-xs text-mut mt-3"><div className="h-1.5 w-24 bg-line rounded"><div className="h-full w-4/5 bg-ac rounded"/></div>High confidence</div>
        </div>
      </motion.div>}
      {view === "assistant" && <AssistantChat key={jur + lang + pre} jur={jur} lang={lang} initial={pre} onSource={setSrc}/>}
      {view === "classify" && <motion.div {...fade}><ClassificationWizard onSource={setSrc}/></motion.div>}
      {view === "knowledge" && <motion.div {...fade}><Knowledge onSource={setSrc}/></motion.div>}
      {view !== "assistant" && <div className="mt-14 pt-5 border-t border-line"><Disclaimer/></div>}
    </main>
    <AnimatePresence>{src && <SourceDrawer key={src} id={src} onClose={() => setSrc(null)}/>}</AnimatePresence>
  </div>;
}
