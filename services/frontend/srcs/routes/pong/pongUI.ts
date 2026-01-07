
import * as GUI from '@babylonjs/gui';

export class PongUIManager {
  private advancedTexture: GUI.AdvancedDynamicTexture;
  private scoreTextLeft: GUI.TextBlock;
  private scoreTextRight: GUI.TextBlock;
  private timerText: GUI.TextBlock;
  private drawText: GUI.TextBlock;
  // private exitButton: GUI.Button; // Commented out as per previous user edit preference

  constructor() {
    this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Create UI elements
    const barPointRight = this.createPointBar("100px", "60px", "pink", "black", 75);
    const barPointLeft = this.createPointBar("100px", "60px", "white", "black", -75);

    this.scoreTextRight = this.addText(barPointRight, "white", 35);
    this.scoreTextLeft = this.addText(barPointLeft, "white", 35);

    // this.exitButton = this.createExitGame();
    this.timerText = this.createTimerBlock();
    this.drawText = this.createTimerBlock();

    // Add controls to texture
    this.advancedTexture.addControl(barPointRight);
    this.advancedTexture.addControl(barPointLeft);
    // this.advancedTexture.addControl(this.exitButton);
    this.advancedTexture.addControl(this.timerText);
    this.advancedTexture.addControl(this.drawText);
  }

  /*
  public onExitGame(callback: () => void) {
    this.exitButton.onPointerUpObservable.add(callback);
  }
  */

  public updateLeftScore(score: number) {
    this.scoreTextLeft.text = String(score);
  }

  public updateRightScore(score: number) {
    this.scoreTextRight.text = String(score);
  }

  public updateTimer(count: number) {
    if (count > 0) {
      this.timerText.text = count.toString();
      this.timerText.isVisible = true;
    } else {
      this.timerText.isVisible = false;
    }
  }

  public setTimerText(text: string) {
    this.timerText.text = text;
    this.timerText.isVisible = true;
  }

  public setDrawText(text: string) {
    this.drawText.text = text;
    this.drawText.isVisible = true;
  }

  public hideTimer() {
    this.timerText.isVisible = false;
  }

  public showPause(isPaused: boolean) {
    if (isPaused) {
      this.timerText.text = "PAUSE";
      this.timerText.isVisible = true;
    } else {
      this.timerText.isVisible = false;
    }
  }

  public dispose() {
    this.advancedTexture.dispose();
  }

  private createPointBar(width: string, height: string, color: string, backColor: string, left: number): GUI.Rectangle {
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
    infoBox.cornerRadius = 25;
    return infoBox;
  }

  private addText(scoreBox: GUI.Rectangle, color: string, size: number): GUI.TextBlock {
    const scoreText = new GUI.TextBlock("scoreText");
    scoreText.color = color;
    scoreText.fontSize = size;
    scoreText.text = "0";
    scoreBox.addControl(scoreText);
    return scoreText;
  }

  private createTimerBlock(): GUI.TextBlock {
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

  /*
  private createExitGame(): GUI.Button {
    const playButton = GUI.Button.CreateSimpleButton("HomeButton", "HOME");
    playButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    playButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
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
  */
}