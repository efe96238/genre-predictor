import torch
from torch import nn

class GenreClassifier(nn.Module):
  def __init__(self):
    super().__init__()
    self.block_1 = nn.Sequential(
      nn.Conv2d(in_channels=1, out_channels=32, kernel_size=3, padding=1),
      nn.BatchNorm2d(num_features=32),
      nn.ReLU(),
      nn.Conv2d(in_channels=32, out_channels=32, kernel_size=3, padding=1),
      nn.BatchNorm2d(num_features=32),
      nn.ReLU(),
      nn.MaxPool2d(kernel_size=2)
      )
    self.block_2 = nn.Sequential(
      nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1),
      nn.BatchNorm2d(num_features=64),
      nn.ReLU(),
      nn.Conv2d(in_channels=64, out_channels=64, kernel_size=3, padding=1),
      nn.BatchNorm2d(num_features=64),
      nn.ReLU(),
      nn.MaxPool2d(kernel_size=2)
      )
    self.block_3 = nn.Sequential(
      nn.Conv2d(in_channels=64, out_channels=128, kernel_size=3, padding=1),
      nn.BatchNorm2d(num_features=128),
      nn.ReLU(),
      nn.Conv2d(in_channels=128, out_channels=128, kernel_size=3, padding=1),
      nn.BatchNorm2d(num_features=128),
      nn.ReLU(),
      nn.MaxPool2d(kernel_size=2)
      )
    self.classifier = nn.Sequential(
      nn.AdaptiveAvgPool2d((1, 1)),
      nn.Flatten(),
      nn.Dropout(p=0.4),
      nn.Linear(in_features=128, out_features=10)
    )
  
  def forward(self, x):
    x = self.block_1(x)
    x = self.block_2(x)
    x = self.block_3(x)
    x = self.classifier(x)
    return x
