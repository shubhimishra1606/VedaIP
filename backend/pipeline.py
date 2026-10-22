"""
Pipeline: Classification + RAG
"""

from classification.rules import classify_formulation
from rag.test_query import load_corpus, hybrid_search, ask_with_citation


def build_rag_query(category_key: str) -> str:
    query_map = {
    "CLASSICAL": "Can a classical Ayurvedic formulation be patented? What are the exclusions under Section 3?",
    "PROPRIETARY": "How can a proprietary Ayurvedic formulation obtain a patent? What are the novelty and inventive step requirements?",
    "NEW_DRUG": "How can a new drug obtain a patent when clinical safety and effectiveness proof is available?",
    "PHYTOPHARMACEUTICAL": "What are the patent and regulatory requirements for a phytopharmaceutical formulation?",
    "AYURVEDA_AAHAR": "How can IP protection be obtained for a nutraceutical or food product?",
    "COSMETIC": "How can patent or design protection be obtained for a cosmetic product?",
}
    return query_map.get(category_key, "What are the IP rights for an Ayurveda formulation?")


def run_pipeline(answers: dict):

    # Step 1: Classification
    classification_result = classify_formulation(answers)
    print("=" * 50)
    print(f"CATEGORY: {classification_result['name']}")
    print(f"IP Posture (rule-based): {classification_result['ip_posture']}")
    print(f"Regulatory (rule-based): {classification_result['regulatory']}")
    print("=" * 50)

    # Step 2: RAG query 
    rag_query = build_rag_query(classification_result["category_key"])
    print(f"\nRAG Query (auto-generated): {rag_query}\n")

    # Step 3: citation-backed ans from RAG
    corpus = load_corpus()
    relevant_chunks = hybrid_search(corpus, rag_query)
    detailed_answer = ask_with_citation(rag_query, relevant_chunks)

    print("--- DETAILED CITATION-BACKED ANSWER ---")
    print(detailed_answer)

    return {
        "classification": classification_result,
        "rag_query": rag_query,
        "detailed_answer": detailed_answer
    }


if __name__ == "__main__":

    test_answers = {
        "is_classical_text": True,
        "is_edible": False,
        "is_topical": False,
        "has_clinical_proof": False,
        "is_standardized_extract": False
    }

    run_pipeline(test_answers)