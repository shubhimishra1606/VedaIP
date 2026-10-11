import fitz

doc = fitz.open("corpus/raw_pdfs/biological_diversity_act_2002.pdf")
full_text = ""
for page in doc:
    full_text += page.get_text()
doc.close()

markers = [
    "In exercise of the powers conferred",
    "BIOLOGICAL DIVERSITY RULES",
    "FORM I",
    "G.S.R.",
    "Short title and commencement"
]

for marker in markers:
    idx = full_text.find(marker)
    count = full_text.count(marker)
    print(f"'{marker}' -> pehli baar mila at: {idx}, total occurrences: {count}")

print(f"\nTotal text length: {len(full_text)}")