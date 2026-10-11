import json
import chromadb

def load_corpus():
    with open("corpus/patents_act_chunks.json", "r", encoding="utf-8") as f:
        return json.load(f)


if __name__ == "__main__":
    corpus = load_corpus()
    print(f"Corpus loaded: {len(corpus)} sections")

    # Persistent client = data disk pe save hoga, har baar dobara banane ki zaroorat nahi
    client = chromadb.PersistentClient(path="corpus/chroma_db")

    # Collection = ek "table" jisme hum apne sections store karenge
    collection = client.get_or_create_collection(name="ayurveda_ip_corpus")

    documents = [c["text"] for c in corpus]
    metadatas = [{"act": c["act"], "section": c["section"]} for c in corpus]
    ids = [f"{c['act']}_{c['section']}" for c in corpus]

    print("Embeddings bana rahe hain aur Chroma me store kar rahe hain...")
    print("(Pehli baar chalane pe embedding model download hoga, 1-2 min lag sakte hain)")

    collection.add(
        documents=documents,
        metadatas=metadatas,
        ids=ids
    )

    print(f"✅ {len(documents)} sections Chroma me store ho gaye!")
    print(f"Database saved at: corpus/chroma_db")