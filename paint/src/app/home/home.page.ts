import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, ToastController, ModalController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {


  // canvas section
  @ViewChild('imageCanvas') canvas: any;
  canvasElement: any;

  saveX: number;
  saveY: number;

  // color section
  colorPallete = [
    '#000000', '#ffffff', '#ffe119', '#4363d8',
    '#f58231', '#911eb4', '#46f0f0', '#f032e6',
    '#bcf60c', '#fabebe', '#008080', '#e6beff',
    '#9a6324', '#fffac8', '#800000', '#aaffc3',
    '#808000', '#ffd8b1', '#000075', '#808080'
  ];
    selectedColor = this.colorPallete[0];
  // brush section
  brushThickness = 5;

  // boolean section
  isCanvasBlank = true;
  isBrushSettingsOpened = false;

  // cords of last touched point of the screen
  lastTouch = null;

  constructor(
    private platform: Platform,
    public toastController: ToastController,
    public modalController: ModalController,
    private screenOrientation: ScreenOrientation
  ) {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
  }

  ngOnInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = this.platform.width();
    this.canvasElement.height = this.platform.height() - 56;
  }

  drawCircle(x: number, y: number) {
    const canvas = this.canvasElement.getContext('2d');

    canvas.strokeStyle = this.selectedColor;
    canvas.lineWidth = this.brushThickness + 1;

    canvas.beginPath();
    canvas.arc(x, y, this.brushThickness, 0, 2 * Math.PI, true);
    canvas.stroke();
  }

  startDrawing(event) {
    const canvasPosition = this.canvasElement.getBoundingClientRect();

    this.saveX = event.touches[0].pageX - canvasPosition.x;
    this.saveY = event.touches[0].pageY - canvasPosition.y;

    this.drawCircle(this.saveX, this.saveY);

    if (this.isCanvasBlank) {
      this.isCanvasBlank = false;
    }
  }

  stopDrawing(event) {
    const canvasPosition = this.canvasElement.getBoundingClientRect();
    const currentX = this.lastTouch.pageX - canvasPosition.x;
    const currentY = this.lastTouch.pageY - canvasPosition.y;

    this.drawCircle(currentX, currentY);
  }

  moved(event) {
    const canvasPosition = this.canvasElement.getBoundingClientRect();

    const ctx = this.canvasElement.getContext('2d');
    const currentX = event.touches[0].pageX - canvasPosition.x;
    const currentY = event.touches[0].pageY - canvasPosition.y;
    this.lastTouch = event.touches[0];

    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.selectedColor;
    ctx.lineWidth = this.brushThickness;

    ctx.beginPath();
    ctx.moveTo(this.saveX, this.saveY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();

    ctx.stroke();

    this.saveX = currentX;
    this.saveY = currentY;
  }

  async clearCanvas() {
    const context = this.canvasElement.getContext('2d');

    context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.lastTouch = null;
    this.isCanvasBlank = true;

    const toast = await this.toastController.create({
      message: 'Canvas got cleared!',
      duration: 2000,
    });
    toast.present();
  }

  openBrushSettings() {
    this.isBrushSettingsOpened = true;
  }

  closeBrushSettings() {
    this.isBrushSettingsOpened = false;
  }

  changeBrushThickness(event) {
    this.brushThickness = event.detail.value;
  }

  changeBrushColor(color) {
    this.selectedColor = color;
  }

}
