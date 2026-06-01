"""
Seaweed Disease Detection System
Training Script

Architecture : EfficientNet-B2 (pretrained on ImageNet)
Dataset      : 6-class seaweed disease dataset (1,919 images)
Framework    : PyTorch + TIMM
Author       : Md Saber Hossain
"""

import os
import json
import copy
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split
from torch.optim.lr_scheduler import CosineAnnealingLR
from torchvision import datasets, transforms
import timm
import matplotlib.pyplot as plt


# ── Configuration ─────────────────────────────────────────────────────────────

DATA_DIR    = "data/dataset"       # path to dataset root folder
MODEL_PATH  = "best_model.pth"     # path to save best model
CLASSES_PATH = "classes.json"      # path to save class names

IMG_SIZE    = 288                  # EfficientNet-B2 native resolution
BATCH_SIZE  = 32
EPOCHS      = 30
WARMUP_EPOCHS = 5                  # freeze backbone for first N epochs
LR_HEAD     = 1e-3                 # learning rate during warm-up
LR_FULL     = 1e-4                 # learning rate after unfreezing
VAL_SPLIT   = 0.15                 # fraction of data used for validation
DEVICE      = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print(f"Device: {DEVICE}")


# ── Data Transforms ───────────────────────────────────────────────────────────

train_transform = transforms.Compose([
    transforms.RandomResizedCrop(IMG_SIZE, scale=(0.6, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomVerticalFlip(),
    transforms.RandomRotation(20),
    transforms.ColorJitter(brightness=0.3, contrast=0.3,
                           saturation=0.2, hue=0.05),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225]),
    transforms.RandomErasing(p=0.1),
])

val_transform = transforms.Compose([
    transforms.Resize(IMG_SIZE + 16),
    transforms.CenterCrop(IMG_SIZE),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225]),
])


# ── Dataset ───────────────────────────────────────────────────────────────────

full_dataset = datasets.ImageFolder(DATA_DIR, transform=train_transform)
CLASSES      = full_dataset.classes
NUM_CLASSES  = len(CLASSES)

print(f"Classes ({NUM_CLASSES}): {CLASSES}")
json.dump(CLASSES, open(CLASSES_PATH, "w"))

n_val   = int(len(full_dataset) * VAL_SPLIT)
n_train = len(full_dataset) - n_val
train_subset, val_subset = random_split(full_dataset, [n_train, n_val])

# Fix validation transform (avoids a common PyTorch bug)
val_dataset           = copy.deepcopy(full_dataset)
val_dataset.transform = val_transform
from torch.utils.data import Subset
val_subset = Subset(val_dataset, val_subset.indices)

train_loader = DataLoader(train_subset, batch_size=BATCH_SIZE,
                          shuffle=True,  num_workers=4, pin_memory=True)
val_loader   = DataLoader(val_subset,   batch_size=BATCH_SIZE,
                          shuffle=False, num_workers=4, pin_memory=True)

print(f"Training samples  : {n_train}")
print(f"Validation samples: {n_val}")


# ── Model ─────────────────────────────────────────────────────────────────────

model = timm.create_model("efficientnet_b2", pretrained=True,
                           num_classes=NUM_CLASSES)
model = model.to(DEVICE)

# Freeze backbone for warm-up phase
for name, param in model.named_parameters():
    if "classifier" not in name:
        param.requires_grad = False

total_params    = sum(p.numel() for p in model.parameters())
trainable_params = sum(p.numel() for p in model.parameters()
                       if p.requires_grad)
print(f"Total parameters    : {total_params:,}")
print(f"Trainable parameters: {trainable_params:,}")


# ── Training Loop ─────────────────────────────────────────────────────────────

criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
optimizer = torch.optim.AdamW(
    filter(lambda p: p.requires_grad, model.parameters()),
    lr=LR_HEAD, weight_decay=1e-4
)
scheduler = CosineAnnealingLR(optimizer, T_max=EPOCHS)

best_val_acc   = 0.0
train_losses   = []
val_accuracies = []

print("\nStarting training...\n")

for epoch in range(1, EPOCHS + 1):

    # Unfreeze full backbone after warm-up
    if epoch == WARMUP_EPOCHS + 1:
        print("\n--- Unfreezing full backbone ---\n")
        for param in model.parameters():
            param.requires_grad = True
        optimizer = torch.optim.AdamW(
            model.parameters(), lr=LR_FULL, weight_decay=1e-4
        )
        scheduler = CosineAnnealingLR(
            optimizer, T_max=EPOCHS - WARMUP_EPOCHS
        )

    # Training
    model.train()
    running_loss = 0.0
    correct = total = 0

    for images, labels in train_loader:
        images, labels = images.to(DEVICE), labels.to(DEVICE)
        optimizer.zero_grad()
        outputs = model(images)
        loss    = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item()
        correct      += (outputs.argmax(1) == labels).sum().item()
        total        += labels.size(0)

    train_acc  = round(100 * correct / total, 1)
    avg_loss   = running_loss / len(train_loader)

    # Validation
    model.eval()
    val_correct = val_total = 0

    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            val_correct += (model(images).argmax(1) == labels).sum().item()
            val_total   += labels.size(0)

    val_acc = round(100 * val_correct / val_total, 1)

    train_losses.append(avg_loss)
    val_accuracies.append(val_acc)

    # Save best model
    if val_acc > best_val_acc:
        best_val_acc = val_acc
        torch.save(model.state_dict(), MODEL_PATH)
        print(f"Epoch {epoch:02d}/{EPOCHS} | "
              f"Loss: {avg_loss:.4f} | "
              f"Train: {train_acc}% | "
              f"Val: {val_acc}% | saved")
    else:
        print(f"Epoch {epoch:02d}/{EPOCHS} | "
              f"Loss: {avg_loss:.4f} | "
              f"Train: {train_acc}% | "
              f"Val: {val_acc}%")

    scheduler.step()

print(f"\nTraining complete. Best validation accuracy: {best_val_acc}%")


# ── Training Curves ───────────────────────────────────────────────────────────

plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.plot(train_losses, color="#E24B4A", linewidth=2)
plt.title("Training Loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.grid(True, alpha=0.3)

plt.subplot(1, 2, 2)
plt.plot(val_accuracies, color="#1D9E75", linewidth=2)
plt.axhline(y=best_val_acc, color="#E24B4A", linestyle="--",
            label=f"Best: {best_val_acc}%")
plt.title("Validation Accuracy")
plt.xlabel("Epoch")
plt.ylabel("Accuracy (%)")
plt.legend()
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig("assets/training_curves.png", dpi=150)
plt.show()
print("Training curves saved.")