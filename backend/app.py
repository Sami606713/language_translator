from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from utils import Language_Translation
import uvicorn

app = FastAPI()

class TranslationRequest(BaseModel):
    text: str
    dest_language: str

@app.get("/")
def home():
    return {"message": "Welcome to our translation app"}


@app.post("/translate")
async def translate_text(request: TranslationRequest):
    try:
        text=request.text
        target_language=request.dest_language

        translation=Language_Translation(text=text,target_language=target_language)
        response=translation.translate()

        if translation:
            return {    "original_text": text,
                        "translated_text": response
                    }

        else:
            raise HTTPException(status_code=400, detail="Translation failed.")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
