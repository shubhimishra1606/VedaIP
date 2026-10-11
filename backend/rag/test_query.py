import json
import os
from groq import Groq
from dotenv import load_dotenv
from rank_bm25 import BM25Okapi
import chromadb

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def load_corpus():
    with open("corpus/patents_act_chunks.json", "r", encoding="utf-8") as f:
        return json.load(f)


def vector_search(query, top_k=3):
    chroma_client = chromadb.PersistentClient(path="corpus/chroma_db")
    collection = chroma_client.get_or_create_collection(name="ayurveda_ip_corpus")

    results = collection.query(query_texts=[query], n_results=top_k)

    chunks = []
    for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
        chunks.append({"act": meta["act"], "section": meta["section"], "text": doc})
    return chunks


def hybrid_search(corpus, query, top_k=3):
    # --- BM25 (keyword) search ---
    tokenized_corpus = [c["text"].lower().split() for c in corpus]
    bm25 = BM25Okapi(tokenized_corpus)
    bm25_scores = bm25.get_scores(query.lower().split())
    bm25_top_idx = sorted(range(len(bm25_scores)), key=lambda i: bm25_scores[i], reverse=True)[:top_k]
    bm25_sections = {corpus[i]["section"] for i in bm25_top_idx}
    print("BM25 ne ye sections diye:", list(bm25_sections))

    # --- Vector (semantic) search ---
    vector_chunks = vector_search(query, top_k=top_k)
    vector_sections = {c["section"] for c in vector_chunks}
    print("Vector search ne ye sections diye:", list(vector_sections))

    # --- Combine karo ---
    combined_sections = bm25_sections | vector_sections
    final_chunks = [c for c in corpus if c["section"] in combined_sections]
    return final_chunks


def ask_with_citation(query, relevant_chunks):
    context = "\n\n".join(
        [f"[Section {c['section']}]\n{c['text']}" for c in relevant_chunks]
    )

    system_prompt = """Tum ek Ayurveda IP advisor ho. Neeche diye gaye legal
text ke ALAWA kisi aur jaankari ka use mat karo. Har claim ke saath
section number zaroor do, jaise [Section 3]. Agar jawab is text me nahi
hai, to saaf bol do "Mujhe iska reliable source nahi mila," guess mat karo."""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Context:\n{context}\n\nSawaal: {query}"}
        ],
        temperature=0,
    )
    return response.choices[0].message.content


if __name__ == "__main__":
    corpus = load_corpus()
    print(f"Corpus loaded: {len(corpus)} sections\n")

    query = "Kya classical Ayurvedic formulation ka patent ho sakta hai?"
    print(f"Sawaal: {query}\n")

    relevant_chunks = hybrid_search(corpus, query)
    print(f"\nFinal combined chunks: {[c['section'] for c in relevant_chunks]}\n")

    answer = ask_with_citation(query, relevant_chunks)
    print("--- JAWAB ---")
    print(answer)