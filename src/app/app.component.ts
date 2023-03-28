import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { HelperClass } from './helperClass';

interface Pole {
  YAboveHorizon: number,
  YBelowHorizon: number,
  x: number
}

interface OriginalPole {
  floorLocationX: number,
  floorLocationY: number,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'shooterFromScratch';

  // its important myCanvas matches the variable name in the template
  @ViewChild('gameCanvas')
  canvas: ElementRef<HTMLCanvasElement> | null = null;

  ctx: CanvasRenderingContext2D | null = null;
  readonly horizonHeight: number = 250;
  readonly middleWidth: number = 250;

  playerPositionX: number = 0;
  playerPositionY: number = 0;

  ngAfterViewInit(): void {
    this.ctx = this.canvas!.nativeElement.getContext('2d');
    //this.drawBackground();
    //this.drawMiddle();
    //this.drawPolygon({ YAboveHorizon: 100, YBelowHorizon: 100, x: 100 }, { YAboveHorizon: 50, YBelowHorizon: 50, x: 200 });
    this.renderGame();
  }

  renderGame(){
    let ctx = this.canvas!.nativeElement.getContext('2d');
    ctx?.clearRect(0,0,500,500);
    this.drawBackground();
    this.drawMiddle();
    this.renderProjectedPolygon({floorLocationX: -80, floorLocationY: 100},{floorLocationX: 80, floorLocationY: 100});

  }

  originalPoleToProjectedPole(OriginalPole: OriginalPole): Pole {
    let lengthFromPosition = HelperClass.Length(
        OriginalPole.floorLocationX
      , OriginalPole.floorLocationY
      , this.playerPositionX
      , this.playerPositionY);
      console.log(lengthFromPosition);
      return {
        YAboveHorizon: 5000 / lengthFromPosition
      , YBelowHorizon: 5000 / lengthFromPosition
      , x: this.middleWidth - OriginalPole.floorLocationX * (100 / lengthFromPosition)};
  }

  drawMiddle(){
    let ctx = this.ctx;
    ctx!.strokeStyle = 'black';
    ctx!.beginPath();
    ctx!.moveTo(0 ,this.horizonHeight);
    ctx!.lineTo(500, this.horizonHeight);
    ctx!.closePath();
    ctx!.stroke();
  }

  drawBackground(){
    let ctx = this.ctx;
    ctx!.fillStyle = 'grey';
    ctx!.fillRect(0,0,500,500);
  }

  renderProjectedPolygon(OriginalPole1: OriginalPole,OriginalPole2: OriginalPole){
    let pole1 = this.originalPoleToProjectedPole(OriginalPole1);
    //console.log(pole1);
    let pole2 = this.originalPoleToProjectedPole(OriginalPole2);
    //console.log(pole2);
    this.drawPolygon(pole1, pole2);
  }

  drawPolygon(leftPole: Pole, rightPole: Pole) {
    let ctx = this.ctx;
    ctx!.strokeStyle = 'black';
    ctx!.fillStyle = 'white';
    ctx!.beginPath();
    ctx!.moveTo(leftPole.x, this.horizonHeight + leftPole.YAboveHorizon);
    ctx!.lineTo(leftPole.x, this.horizonHeight -leftPole.YBelowHorizon);
    ctx!.lineTo(rightPole.x, this.horizonHeight - rightPole.YBelowHorizon);
    ctx!.lineTo(rightPole.x, this.horizonHeight + rightPole.YAboveHorizon);
    ctx!.closePath();
    ctx!.stroke();
    ctx!.fill();

  }

  constructor() {
    this.init();
  }

  lambdafoo = (ev: KeyboardEvent) => {
    if(this.playerPositionY < 100)
    this.playerPositionY += 1;
    this.renderGame();
    console.log(ev);
  }

  init() {
    window.addEventListener('keydown', this.lambdafoo )
  }
}
