# Genre Predictor

A desktop application for predicting the genre of an audio file using a trained neural network model.

The app is built with **Electron (Vite + React)** for the UI and a **Python FastAPI backend**, bundled together as a **portable Windows executable**.

## Features
- Load `.mp3` or `.wav` files (file picker or drag & drop)
- Predicts music genre with confidence percentages
- Fully offline after download
- Portable `.exe` (no installation required)

## Tech Stack
- Frontend: Electron, Vite, React
- Backend: Python, FastAPI
- ML: PyTorch (log-mel spectrogram based CNN)

## Usage
1. Download the latest portable `.exe` from the **Releases** page
2. Run the application
3. Select or drag an audio file
4. Click **Predict** to see genre probabilities

## Notes
- The backend runs locally as part of the app
- No data is uploaded or sent over the network
- Older experimental versions are kept in the `old/` folder for reference

## Notes About the Model
- The CNN is trained with the GTZAN dataset
- Note that the model might not be very accurate
- Training and testing accuracy was around 80-85% so far, which can be considered good for the GTZAN dataset because of its small size and mislabeled tracks
- I did not create this model for perfect, production quality accuracy but rather learning and research, however I do plan to improve it to that grade at some point

## Future Plans
- Train it with a more accurate, bigger dataset for better results
- Confusion Matrix evaluation

## License
MIT



