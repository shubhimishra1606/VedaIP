function JurisdictionToggle({ value, onChange }) {
  const b = (j, l) => <button onClick={() => onChange(j)} className={`px-3 py-1 rounded-lg text-sm ${value === j ? "bg-ac text-white" : ""}`}>{l}</button>;
  return <div className="inline-flex border border-line rounded-xl p-0.5 bg-white">{b("IN", "\u{1F1EE}\u{1F1F3} India")}{b("INTL", "\u{1F310} International")}</div>;
}
export {
  JurisdictionToggle as default
};
