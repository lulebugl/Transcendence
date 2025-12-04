
import * as GUI from '@babylonjs/gui';

export function createPointBar(width: string, height: string, color: string, backColor: string, left: number, right: number): any {
  const infoBox = new GUI.Rectangle();
  infoBox.width = width;
  infoBox.height = height;
  infoBox.color = color;
  infoBox.thickness = 2;
  infoBox.background = backColor;
  infoBox.alpha = 0.6;
  infoBox.isPointerBlocker = false;
  infoBox.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  infoBox.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  infoBox.top = 30;
  infoBox.left = left;
  //   infoBox.right = right;
  infoBox.cornerRadius = 25;
  return infoBox;
}

export function addText(scoreBox: any, color: string, size: number): any {
  const scoreText = new GUI.TextBlock("scoreText");
  scoreText.color = color;
  scoreText.fontSize = size;
  scoreText.text = "0";
  scoreBox.addControl(scoreText);
  return scoreText;
}

export function updatePoint(score: any, point: number): any {
  score.text = String(point);
}

export function createExitGame(): any {
  const playButton = GUI.Button.CreateSimpleButton("HomeButton", "HOME");
  playButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  playButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  //   playButton.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  //   playButton.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  playButton.width = "50px";
  playButton.height = "50px";
  playButton.color = "black";
  playButton.background = "#FFF";
  playButton.cornerRadius = 12;
  playButton.thickness = 2;
  playButton.fontSize = 10;
  playButton.top = 25;
  playButton.left = 30;
  return playButton;
}




export function createStartGame(): any {
  const playButton = GUI.Button.CreateSimpleButton("HomeButton", "START");
  playButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  playButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  //   playButton.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  //   playButton.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  playButton.width = "50px";
  playButton.height = "50px";
  playButton.color = "black";
  playButton.background = "#ff0000ff";
  playButton.cornerRadius = 12;
  playButton.thickness = 2;
  playButton.fontSize = 10;
  playButton.top = 25;
  playButton.left = 30;
  playButton.left = 30;
  return playButton;
}

export function createTimerBlock(): GUI.TextBlock {
  const timerText = new GUI.TextBlock("timerText");
  timerText.color = "white";
  timerText.fontSize = 150;
  timerText.text = "";
  timerText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  timerText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  timerText.shadowColor = "black";
  timerText.shadowBlur = 10;
  return timerText;
}