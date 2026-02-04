import librosa
import numpy as np

#loading audios
SAMPLE_RATE = 22050

def load_audio(path):
  y, sr = librosa.load(path, sr=SAMPLE_RATE, mono=True)

  #peak normalization
  peak = np.max(np.abs(y))
  if peak > 0:
    y = y / peak

  return y, sr

#data augmentation 10s clips
CLIP_SECONDS = 10
CLIP_SAMPLES = CLIP_SECONDS * SAMPLE_RATE

#for testing
def fixed_crop(y, clip_samples):
  return y[:clip_samples]

#mel spectogram
N_FFT = 2048 #size of fft window
HOP_LENGTH = 512 #step between fft windows
N_MELS = 128 #number of mel freq bands

def waveform_to_logmel(y, sr):
  mel = librosa.feature.melspectrogram(y=y, sr=sr, n_fft=N_FFT, hop_length=HOP_LENGTH, n_mels=N_MELS, power=2.0)
  log_mel = librosa.power_to_db(mel, ref=np.max)

  return log_mel