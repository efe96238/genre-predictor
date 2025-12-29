# Genre Classifier (PyTorch + Log-Mel CNN)

A music genre classifier trained on log-mel spectrograms using a lightweight CNN in PyTorch. The project is implemented in a single Jupyter notebook.

## Overview
- Input: audio files (`.mp3`) organized by genre folders
- Preprocessing: resample to 22,050 Hz, mono, peak normalize, 10 s crop
- Features: log-mel spectrogram (128 mel bands)
- Model: 3-block CNN + global average pooling + linear classifier
- Output: genre probabilities (softmax)

## Requirements
- Python 3.10+ recommended
- CUDA-capable GPU recommended (training uses CUDA if available)

Python packages:
- torch
- numpy
- librosa
- scikit-learn

## Dataset layout
Place your dataset under `data/` with one folder per genre:

```
data/
  blues/
    *.mp3
  classical/
    *.mp3
  ...
```

The notebook discovers genres from the subfolder names under `data/`.

## Running
Open and run the notebook:

- `genre_classifier.ipynb`

The notebook will:
1. Scan `data/` for `.mp3` files and filter unreadable files
2. Split into train/test with stratification
3. Train the CNN and save the best checkpoint by test accuracy
4. Load the best checkpoint and run a small inference sanity check

## Training configuration (current notebook defaults)
- Sample rate: 22,050 Hz
- Clip length: 10 s (random crop for training, fixed crop for evaluation)
- Batch size: 16
- Optimizer: Adam (lr=1e-3)
- Loss: CrossEntropyLoss
- Epochs: 50
- Checkpoint: `models/final_model.pth`

Note: Ensure the `models/` directory exists before training, or create it in the notebook:
```bash
mkdir -p models
```

## Outputs
- Best model weights:
  - `models/final_model.pth`

## Inference (inside the notebook)
After training, the notebook loads `models/final_model.pth` and prints predicted genres with confidences for a test batch.

If you want portability across devices, load with:
```python
state = torch.load("models/final_model.pth", map_location=device)
model.load_state_dict(state)
```

## Notes
- If any audio file is shorter than the configured clip length, batching may fail due to variable feature shapes. The current notebook assumes clips are at least 10 seconds long.
- `.mp3` decoding support depends on your local audio backend; if you see load errors, convert files to `.wav` or ensure your environment supports mp3 decoding for librosa.
