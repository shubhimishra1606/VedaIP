"""
Formulation Classification Engine — Rule-based decision tree.

Ye code LLM use NAHI karta. Ye pure Python logic hai, kyunki
classification ek factual/legal decision hai, LLM ka "guess" nahi
hona chahiye.
"""

CATEGORIES = {
    "CLASSICAL": {
        "name": "Classical / Generic Medicine",
        "description": "Formulation aur method First-Schedule authoritative text (jaise Charaka Samhita) se liya gaya hai.",
        "ip_posture": "Traditional knowledge maana jaata hai. Patents Act Section 3(p) ke tehat patent milna mushkil hai. TKDL me prior-art check karo.",
        "regulatory": "Drugs & Cosmetics Act ke tehat classical/generic Ayurvedic drug licence chahiye."
    },
    "PROPRIETARY": {
        "name": "Proprietary / Patent Medicine",
        "description": "Naya combination/process hai, lekin classical ingredients/principles pe based hai.",
        "ip_posture": "Patent ke liye genuine chance hai agar novelty aur inventive step dikhaya ja sake.",
        "regulatory": "Proprietary Ayurvedic medicine licence chahiye (formula disclosure ke saath)."
    },
    "NEW_DRUG": {
        "name": "New / Non-Classical Drug",
        "description": "Safety aur effectiveness ka clinical proof available hai ya banaya ja raha hai.",
        "ip_posture": "Sabse strong patent potential — naya hai aur clinical evidence se backed hai.",
        "regulatory": "New Drugs & Clinical Trials Rules 2019 ke tehat trials aur approval chahiye."
    },
    "PHYTOPHARMACEUTICAL": {
        "name": "Phytopharmaceutical",
        "description": "Standardized herbal extract, defined composition, clinical validation ke saath.",
        "ip_posture": "Patent possible hai agar standardization aur efficacy proof ho.",
        "regulatory": "Phytopharmaceutical drug ke tehat separate regulatory pathway hai (New Drugs Rules 2019)."
    },
    "AYURVEDA_AAHAR": {
        "name": "Ayurveda-Aahar / Nutraceutical",
        "description": "Khane/peene wali cheez, supplement ya functional food.",
        "ip_posture": "Patent generally applicable nahi, trademark/trade-secret zyada relevant.",
        "regulatory": "FSSAI Ayurveda-Aahar regulations lagu hoti hain."
    },
    "COSMETIC": {
        "name": "Cosmetic",
        "description": "Bahar se lagane wali cheez (skin, hair, beauty use).",
        "ip_posture": "Patent kam common, design/trademark zyada relevant.",
        "regulatory": "Drugs & Cosmetics Act ka cosmetic chapter lagu hota hai."
    }
}


def classify_formulation(answers: dict) -> dict:
    """
    answers dictionary expect karta hai is format me:
    {
        "is_classical_text": bool,
        "is_edible": bool,
        "is_topical": bool,
        "has_clinical_proof": bool,
        "is_standardized_extract": bool
    }

    Return karta hai category ka poora info (dict).
    """
    if answers.get("is_classical_text"):
        key = "CLASSICAL"
    elif answers.get("is_edible"):
        key = "AYURVEDA_AAHAR"
    elif answers.get("is_topical"):
        key = "COSMETIC"
    elif answers.get("has_clinical_proof"):
        key = "NEW_DRUG"
    elif answers.get("is_standardized_extract"):
        key = "PHYTOPHARMACEUTICAL"
    else:
        key = "PROPRIETARY"

    result = CATEGORIES[key].copy()
    result["category_key"] = key
    return result


if __name__ == "__main__":
    test_answers = {
        "is_classical_text": True,
        "is_edible": False,
        "is_topical": False,
        "has_clinical_proof": False,
        "is_standardized_extract": False
    }
    result = classify_formulation(test_answers)
    print("Category:", result["name"])
    print("IP Posture:", result["ip_posture"])
    print("Regulatory:", result["regulatory"])