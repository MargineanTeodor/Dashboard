import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-instant-consumption',
  standalone: true,
  imports: [],
  templateUrl: './instant-consumption.component.html',
  styleUrl: './instant-consumption.component.css'
})
export class InstantConsumptionComponent implements OnChanges {
  @Input() instant: number = 0;
  needleStartRotation: number = 55;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['instant']) {
      this.updateNeedle();
    }
  }

  updateNeedle(): void {
    let xTranslation: number = 0
    let yTranslation: number = 0
    let rotation: number = 0
    const needle = document.getElementById("instant-consumption-needle-svg");
    const path = document.getElementById("instant-consumption-path");

    rotation += this.needleStartRotation;

    if (path instanceof SVGPathElement) {
      const pathStartPoint = 60.4;
      const pathEndPoint = 155.5;
      
      const currentPoint = pathStartPoint + (pathEndPoint - pathStartPoint) * this.instant / 100
      const pathPoint = path.getPointAtLength(currentPoint);
      xTranslation = pathPoint.x;
      yTranslation = pathPoint.y;

      const nextPoint = path.getPointAtLength((pathEndPoint - pathStartPoint) * (this.instant + 1) / 100);
      const angle = Math.atan2(nextPoint.y - pathPoint.y, nextPoint.x - pathPoint.x) * 180 / Math.PI * 0.5;
      rotation += angle;
    }

    if (needle) { 
      needle.style.transform = `translate(${xTranslation}px, ${yTranslation}px) rotate(${rotation}deg)`;
    }
  }
}