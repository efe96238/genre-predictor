import torch
import os, sys

from utils import load_audio, fixed_crop, waveform_to_logmel
from model import GenreClassifier

#indexing
genres = ["blues", "classical", "country", "disco", "hiphop", "jazz", "metal", "pop", "reggae", "rock"]
label_to_idx = {label: i for i, label in enumerate(genres)}
idx_to_label = {i: label for label, i in label_to_idx.items()}

#hyperparameters
DEVICE = "cpu"
SAMPLE_RATE = 22050
CLIP_SECONDS = 10
CLIP_SAMPLES = CLIP_SECONDS * SAMPLE_RATE

def resource_path(rel):
  if getattr(sys, "frozen", False):
    return os.path.join(sys._MEIPASS, rel)
  return os.path.join(os.path.dirname(__file__), rel)

MODEL_PATH = resource_path(os.path.join("models", "model.pth"))

#load model
model = GenreClassifier()
state = torch.load(MODEL_PATH, map_location=DEVICE)
model.load_state_dict(state)
model.to(DEVICE)
model.eval()

#infere
def predict_file(path: str):
  y, sr = load_audio(path)
  y = fixed_crop(y, CLIP_SAMPLES)

  log_mel = waveform_to_logmel(y, sr)
  log_mel = (log_mel - log_mel.mean()) / (log_mel.std() + 1e-9)

  x = torch.tensor(log_mel, dtype=torch.float32).unsqueeze(0).unsqueeze(0).to(DEVICE)

  with torch.inference_mode():
    logits = model(x)
    probs = torch.softmax(logits, dim=1).squeeze(0)
  
  pred_i = torch.argmax(probs).item()

  return {
    "predicted": idx_to_label[pred_i],
    "probs": {idx_to_label[i]: float(probs[i].item()) for i in range(len(genres))}
  }
