from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pipeline import run_pipeline

app = FastAPI(title="VedaIP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)


class FormulationAnswers(BaseModel):
    is_classical_text: bool
    is_edible: bool
    is_topical: bool
    has_clinical_proof: bool
    is_standardized_extract: bool


@app.get("/")
def root():
    return {"status": "VedaIP API is running"}


@app.post("/classify-and-advise")
def classify_and_advise(answers: FormulationAnswers):
    result = run_pipeline(answers.dict())
    return result