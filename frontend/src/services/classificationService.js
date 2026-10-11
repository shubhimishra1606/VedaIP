const questions = [
  { q: "What is the intended use?", o: ["Medicine", "Food / nutraceutical", "Cosmetic", "Other"] },
  { q: "Is it based on an authoritative classical Ayurvedic text?", o: ["Yes, as written", "Yes, with changes", "No"] },
  { q: "Is the formulation modified or newly developed?", o: ["Classical, unmodified", "Modified", "Newly developed"] },
  { q: "How will it be marketed?", o: ["Ayurvedic drug", "Proprietary medicine", "Food product", "Not sure"] },
  { q: "Does it contain biological resources?", o: ["Yes, Indian-sourced", "Yes, imported", "No"] }
];
const classify = (a) => {
  const novel = a[2] !== 0 || a[1] === 2;
  return {
    title: novel ? "Potentially Patent / Proprietary Medicine" : "Potentially Classical Formulation",
    sections: [
      ["Regulatory", novel ? "Likely proprietary route with safety and efficacy evidence." : "Classical (Schedule I) licensing route."],
      ["IP", novel ? "Patent possible if novel; check TKDL first." : "Patent unlikely (s.3(p)); consider trademark."],
      ["ABS", a[4] === 2 ? "No biological resources reported." : "Potential ABS consideration."],
      ["Evidence", novel ? "Stability data, prior-art analysis, clinical rationale." : "Textual reference and preparation records."]
    ],
    sourceIds: ["patents", "dc", "bda", "tkdl"]
  };
};
export {
  classify,
  questions
};
