import os
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from inference import predict_file

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/health")
def health():
  return {"ok": True}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
  fname = (file.filename or "").lower()
  if not fname.endswith((".wav", ".mp3")):
    raise HTTPException(status_code=400, detail="Only .wav or .mp3 supported")
  
  suffix = ".wav" if fname.endswith(".wav") else ".mp3"
  tmp_path = None

  try:
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
      tmp_path = tmp.name
      tmp.write(await file.read())

    out = predict_file(tmp_path)
    return {"filename": file.filename, **out}
  
  finally:
    if tmp_path and os.path.exists(tmp_path):
      try:
        os.remove(tmp_path)
      except:
        pass