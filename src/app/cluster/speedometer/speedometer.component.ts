import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-speedometer',
  standalone: true,
  imports: [],
  templateUrl: './speedometer.component.html',
  styleUrl: './speedometer.component.css'
})
export class SpeedometerComponent implements OnChanges {
  @Input() speed: number = 0;
  needleStartRotation: number = -30;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['speed']) {
      this.updateNeedle();
    }
  }

  updateNeedle(): void {
    let xTranslation: number = 0
    let yTranslation: number = 0
    let rotation: number = 0
    const needle = document.getElementById("speedometer-needle-svg");
    const path = document.getElementById("speedometer-path");

    rotation += this.needleStartRotation;

    if (path instanceof SVGPathElement) {
      const pathStartPoint = 72;
      const pathEndPoint = 377;
      const currentPoint = pathStartPoint + (pathEndPoint - pathStartPoint) * this.speed / 100
      const pathPoint = path.getPointAtLength(currentPoint);
      xTranslation = pathPoint.x;
      yTranslation = pathPoint.y;

      const nextPoint = path.getPointAtLength((pathEndPoint - pathStartPoint) * (this.speed + 1) / 100);
      const angle = Math.atan2(nextPoint.y - pathPoint.y, nextPoint.x - pathPoint.x) * 180 / Math.PI;
      rotation += angle;
    }

    if (needle) { 
      needle.style.transform = `translate(${xTranslation}px, ${yTranslation}px) rotate(${rotation}deg)`;
    }
  }
}