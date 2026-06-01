"""
Seaweed Disease Detection System
Evaluation Script

Generates:
  - Classification report (precision, recall, F1 per class)
  - Confusion matrix
  - Grad-CAM visualization

Architecture : EfficientNet-B2
Framework    : PyTorch + TIMM
Author       : Md Saber Hossain
"""

import os
import json
import torch
import torch.nn as nn
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import cv2
from PIL import Image
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
from sklearn.metrics import classification_report, confusion_matrix
import timm


# ── Configuration ─────────────────────────────────────────────────────────────

DATA_DIR     = "data/dataset"
MODEL_PATH   = "best_model.pth"
CLASSES_PATH = "classes.json"
OUTPUT_DIR   = "assets"

IMG_SIZE = 288
DEVICE   = torch.device("cuda" if torch.cuda.is_available() else "cpu")

os.makedirs(OUTPUT_DIR, exist_ok=True)
print(f"Device: {DEVICE}")


# ── Load Classes ──────────────────────────────────────────────────────────────

CLASSES = json.load(open(CLASSES_PATH))
NUM_CLASSES = len(CLASSES)
print(f"Classes: {CLASSES}")


# ── Data Transform ────────────────────────────────────────────────────────────

val_transform = transforms.Compose([
    transforms.Resize(IMG_SIZE + 16),
    transforms.CenterCrop(IMG_SIZE),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225]),
])


# ── Dataset ───────────────────────────────────────────────────────────────────

dataset = datasets.ImageFolder(DATA_DIR, transform=val_transform)
loader  = DataLoader(dataset, batch_size=32,
                     shuffle=False, num_workers=4)
print(f"Total images: {len(dataset)}")


# ── Load Model ────────────────────────────────────────────────────────────────

model = timm.create_model("efficientnet_b2", pretrained=False,
                           num_classes=NUM_CLASSES)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model = model.to(DEVICE)
model.eval()
print("Model loaded.")


# ── Inference ─────────────────────────────────────────────────────────────────

all_preds  = []
all_labels = []

with torch.no_grad():
    for images, labels in loader:
        images = images.to(DEVICE)
        preds  = model(images).argmax(1).cpu()
        all_preds.extend(preds.tolist())
        all_labels.extend(labels.tolist())


# ── Classification Report ─────────────────────────────────────────────────────

print("\n=== Classification Report ===\n")
print(classification_report(all_labels, all_preds,
                             target_names=CLASSES))


# ── Confusion Matrix ──────────────────────────────────────────────────────────

cm = confusion_matrix(all_labels, all_preds)

plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt="d",
            xticklabels=CLASSES,
            yticklabels=CLASSES,
            cmap="Blues")
plt.title("Confusion Matrix — Seaweed Disease Detection", fontsize=13)
plt.ylabel("True Label")
plt.xlabel("Predicted Label")
plt.xticks(rotation=30, ha="right")
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, "confusion_matrix.png"), dpi=150)
plt.show()
print("Confusion matrix saved.")


# ── Grad-CAM ──────────────────────────────────────────────────────────────────

class GradCAM:
    """Gradient-weighted Class Activation Mapping."""

    def __init__(self, model, target_layer):
        self.model       = model
        self.gradients   = None
        self.activations = None

        target_layer.register_forward_hook(self._save_activation)
        target_layer.register_backward_hook(self._save_gradient)

    def _save_activation(self, module, input, output):
        self.activations = output

    def _save_gradient(self, module, grad_input, grad_output):
        self.gradients = grad_output[0]

    def generate(self, input_tensor, class_idx=None):
        output = self.model(input_tensor)
        if class_idx is None:
            class_idx = output.argmax(1).item()

        self.model.zero_grad()
        output[0, class_idx].backward()

        weights = self.gradients.mean(dim=(2, 3), keepdim=True)
        cam     = (weights * self.activations).sum(dim=1, keepdim=True)
        cam     = torch.relu(cam).squeeze().cpu().detach().numpy()
        cam     = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)
        return cam, class_idx


def visualize_gradcam(image_path, save_path="assets/gradcam.png"):
    """Generate and save Grad-CAM overlay for a given image."""
    img    = Image.open(image_path).convert("RGB")
    tensor = val_transform(img).unsqueeze(0).to(DEVICE)

    gradcam = GradCAM(model, model.blocks[-1])
    cam, idx = gradcam.generate(tensor)

    cam_resized = cv2.resize(cam, (IMG_SIZE, IMG_SIZE))
    heatmap     = cv2.applyColorMap(
        np.uint8(255 * cam_resized), cv2.COLORMAP_JET
    )
    original = np.array(img.resize((IMG_SIZE, IMG_SIZE)))
    overlay  = cv2.addWeighted(original, 0.6, heatmap, 0.4, 0)

    plt.figure(figsize=(12, 4))
    plt.subplot(1, 3, 1)
    plt.imshow(original); plt.title("Original"); plt.axis("off")
    plt.subplot(1, 3, 2)
    plt.imshow(cam_resized, cmap="jet")
    plt.title("Grad-CAM"); plt.axis("off")
    plt.subplot(1, 3, 3)
    plt.imshow(cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB))
    plt.title(f"Prediction: {CLASSES[idx]}"); plt.axis("off")
    plt.tight_layout()
    plt.savefig(save_path, dpi=150)
    plt.show()
    print(f"Grad-CAM saved. Predicted: {CLASSES[idx]}")


# Uncomment and provide an image path to generate Grad-CAM
# visualize_gradcam("path/to/your/image.jpg")