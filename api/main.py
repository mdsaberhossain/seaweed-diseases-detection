from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn as nn
from torchvision import transforms
import timm
import json
import io
from PIL import Image

# ── Config ────────────────────────────────────────────────────────────────────
DEVICE     = torch.device("cpu")
IMG_SIZE   = 288
CLASSES    = json.load(open("classes.json"))

# ── Model ─────────────────────────────────────────────────────────────────────
model = timm.create_model('efficientnet_b2', pretrained=False, num_classes=len(CLASSES))
model.load_state_dict(torch.load("best_model_2.pth", map_location=DEVICE))
model.eval()

# ── Transform ─────────────────────────────────────────────────────────────────
transform = transforms.Compose([
    transforms.Resize(IMG_SIZE + 16),
    transforms.CenterCrop(IMG_SIZE),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="Seaweed Disease Detector API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Seaweed Disease Detector API v2 is running ✅"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read and preprocess image
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = transform(image).unsqueeze(0)

    # Inference
    with torch.no_grad():
        output = model(tensor)
        probabilities = torch.softmax(output, dim=1)[0]

    # Top 3 results
    top3_indices = torch.topk(probabilities, 3).indices.tolist()
    top3 = [
        {
            "class": CLASSES[i],
            "confidence": round(probabilities[i].item() * 100, 1)
        }
        for i in top3_indices
    ]

    # Low confidence warning
    top_confidence = top3[0]["confidence"]
    warning = None
    if top_confidence < 60:
        warning = "Low confidence — result may be unreliable"

    return {
        "disease": top3[0]["class"],
        "confidence": top_confidence,
        "top3": top3,
        "warning": warning
    }

@app.get("/classes")
def get_classes():
    return {"classes": CLASSES}