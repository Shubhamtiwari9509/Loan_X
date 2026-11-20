import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_MODEL_PATH = BASE_DIR / "models" / "creditwise_model.pkl"
MODEL_PATH = Path(os.getenv("MODEL_PATH", str(DEFAULT_MODEL_PATH)))

# Server configuration
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8001"))

# Model metadata
MODEL_VERSION = "1.0.0-creditwise-pipeline"
API_TITLE = "LoanX ML Inference Service"
API_VERSION = "1.0.0"
