import json
import chromadb

def load_corpus():
    with open("corpus/patents_act_chunks.json", "r", encoding="utf-8") as f:
        return json.load(f)


if __name__ == "__main__":
    corpus = load_corpus()
    print(f"Corpus loaded: {len(corpus)} sections")

    client = chromadb.PersistentClient(path="corpus/chroma_db")

    collection = client.get_or_create_collection(name="ayurveda_ip_corpus")

    documents = [c["text"] for c in corpus]
    metadatas = [{"act": c["act"], "section": c["section"]} for c in corpus]
    ids = [f"{c['act']}_{c['section']}" for c in corpus]

    print("making embeddings and storing in chroma...")
    print("(embedding model will be downloaded in the first run, it can take 1-2 mins)")

    collection.add(
        documents=documents,
        metadatas=metadatas,
        ids=ids
    )

    print(f"✅ {len(documents)} sections stored in chroma!")
    print(f"Database saved at: corpus/chroma_db")