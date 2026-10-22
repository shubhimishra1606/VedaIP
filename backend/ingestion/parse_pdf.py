import fitz  
import re
import json
import os


def extract_text_from_pdf(pdf_path: str) -> str:
    """extracting text from pdf"""
    doc = fitz.open(pdf_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    doc.close()
    return full_text



def trim_to_actual_law(full_text: str) -> str:
    start_marker = "BE it enacted"
    start_idx = full_text.find(start_marker)
    if start_idx == -1:
        print("WARNING: 'BE it enacted' not found, using text from the beginning.")
        start_idx = 0

    end_markers = [
        "THE FIRST SCHEDULE",
        "THE SCHEDULE",
        "\nSCHEDULE\n",
        "In exercise of the powers conferred",
    ]
    end_idx = len(full_text)
    for marker in end_markers:
        idx = full_text.find(marker)
        if idx != -1 and idx > start_idx:
            end_idx = min(end_idx, idx)

    return full_text[start_idx:end_idx]


def split_into_sections(full_text: str, act_name: str) -> list[dict]:
    section_pattern = re.compile(r'\n\s*(\d+[A-Z]?)\.\s+(?=[A-Z])', re.MULTILINE)
    matches = list(section_pattern.finditer(full_text))

    footnote_starts = (
        "Ins. by", "Subs. by", "Omitted by", "Rep. by", "Added by",
        "Section ", "Clause ", "In section", "In clause",
        "The words", "The proviso", "The brackets", "The figures",
        "The letters", "For the words", "After the words", "Sub-section",
    )
    footnote_keywords = ("w.e.f.", "ibid", "omitted by", "ins. by", "subs. by")

    candidates = {}

    for i, match in enumerate(matches):
        section_number = match.group(1)
        start = match.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(full_text)
        section_text = full_text[start:end].strip()

        if len(section_text) < 50:
            continue

        text_after_number = section_text.split(".", 1)[-1].strip()
        is_footnote_start = text_after_number.startswith(footnote_starts)
        is_footnote_keyword = any(kw.lower() in section_text[:150].lower() for kw in footnote_keywords)
        if is_footnote_start or is_footnote_keyword:
            continuessName="dots"
            continue

        if section_number not in candidates or len(section_text) > len(candidates[section_number]):
            candidates[section_number] = section_text

    def sort_key(num):
        digits = re.match(r'(\d+)', num).group(1)
        suffix = num[len(digits):]
        return (int(digits), suffix)

    sorted_sections = sorted(candidates.items(), key=lambda x: sort_key(x[0]))

    chunks = [
        {"act": act_name, "section": num, "text": text}
        for num, text in sorted_sections
    ]
    return chunks


def process_pdf(pdf_path: str, act_name: str, output_name: str):
    if not os.path.exists(pdf_path):
        print(f"ERROR: File nahi mili: {pdf_path}")
        return None

    print(f"\n{'='*50}")
    print(f"Processing: {act_name}")
    print(f"{'='*50}")

    print("extracting text from pdf...")
    text = extract_text_from_pdf(pdf_path)
    print(f"Total characters (raw): {len(text)}")

    text = trim_to_actual_law(text)
    print(f"Total characters (TOC + after removing schedule): {len(text)}")

    print("Splitting into sections...")
    chunks = split_into_sections(text, act_name)
    print(f"Total unique sections: {len(chunks)}")

    print("\n--- FIRST 3 CHUNKS (sample) ---")
    for c in chunks[:3]:
        print(f"\n[Section {c['section']}]")
        print(c['text'][:150] + "...")

    output_path = f"corpus/{output_name}.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Data saved: {output_path}")
    return chunks


if __name__ == "__main__":
    documents_to_process = [
        {
            "pdf_path": "corpus/raw_pdfs/patents_act_1970.pdf",
            "act_name": "The Patents Act, 1970",
            "output_name": "patents_act_chunks"
        },
        {
            "pdf_path": "corpus/raw_pdfs/biological_diversity_act_2002.pdf",
            "act_name": "The Biological Diversity Act, 2002",
            "output_name": "biological_diversity_act_chunks"
        },
    ]

    for doc in documents_to_process:
        process_pdf(doc["pdf_path"], doc["act_name"], doc["output_name"])