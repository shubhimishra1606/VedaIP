"""
Pipeline: Classification + RAG ko jodta hai.

Flow:
1. User formulation ke baare me kuch basic sawaalon ka jawab deta hai
2. Classification engine category decide karta hai (Classical, New Drug, etc.)
3. Category ke hisaab se ek RAG query automatically banta hai
4. RAG system us query ka citation-backed jawab deta hai
5. Dono (classification + RAG answer) ek saath user ko milte hain
"""

from classification.rules import classify_formulation
from rag.test_query import load_corpus, hybrid_search, ask_with_citation


def build_rag_query(category_key: str) -> str:
    """
    Classification category ke hisaab se ek relevant RAG query banata hai.
    Ye queries hum refine karte rahenge jaise-jaise corpus badhega.
    """
    query_map = {
        "CLASSICAL": "Kya classical Ayurvedic formulation ka patent ho sakta hai? Section 3 ke tehat kya exclusions hain?",
        "PROPRIETARY": "Proprietary Ayurvedic formulation ka patent kaise milta hai? Novelty aur inventive step kya hai?",
        "NEW_DRUG": "Naye drug ka patent kaise milta hai jab clinical safety aur effectiveness proof ho?",
        "PHYTOPHARMACEUTICAL": "Phytopharmaceutical formulation ke liye patent aur regulatory requirements kya hain?",
        "AYURVEDA_AAHAR": "Nutraceutical ya food product ke liye IP protection kaise milta hai?",
        "COSMETIC": "Cosmetic product ke liye patent ya design protection kaise milta hai?",
    }
    return query_map.get(category_key, "Ayurveda formulation ke IP rights kya hain?")


def run_pipeline(answers: dict):
    """
    Poora flow chalata hai: classify karo, fir us category ke hisaab se
    RAG se citation-backed jawab lao.
    """
    # Step 1: Classification
    classification_result = classify_formulation(answers)
    print("=" * 50)
    print(f"CATEGORY: {classification_result['name']}")
    print(f"IP Posture (rule-based): {classification_result['ip_posture']}")
    print(f"Regulatory (rule-based): {classification_result['regulatory']}")
    print("=" * 50)

    # Step 2: RAG query banao is category ke hisaab se
    rag_query = build_rag_query(classification_result["category_key"])
    print(f"\nRAG Query (auto-generated): {rag_query}\n")

    # Step 3: RAG se citation-backed jawab lao
    corpus = load_corpus()
    relevant_chunks = hybrid_search(corpus, rag_query)
    detailed_answer = ask_with_citation(rag_query, relevant_chunks)

    print("--- DETAILED CITATION-BACKED ANSWER ---")
    print(detailed_answer)

    # Sab kuch ek structured response me return karo (API ke liye useful hoga)
    return {
        "classification": classification_result,
        "rag_query": rag_query,
        "detailed_answer": detailed_answer
    }


if __name__ == "__main__":
    # Test: ek classical formulation ka example
    test_answers = {
        "is_classical_text": True,
        "is_edible": False,
        "is_topical": False,
        "has_clinical_proof": False,
        "is_standardized_extract": False
    }

    run_pipeline(test_answers)