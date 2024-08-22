import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-battery-level',
  standalone: true,
  imports: [],
  templateUrl: './battery-level.component.html',
  styleUrl: './battery-level.component.css'
})
export class BatteryLevelComponent implements OnChanges {
  @Input() battery: number = 0;
  needleStartRotation: number = 30;  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['battery']) {
      this.updateNeedle();
    }
  }

  updateNeedle(): void {
    let xTranslation: number = 0
    let yTranslation: number = 0
    let rotation: number = 0
    const needle = document.getElementById("battery-level-needle-svg");
    const path = document.getElementById("battery-level-path");
    
    rotation += this.needleStartRotation;

    if (path instanceof SVGPathElement) {
      const pathStartPoint = 72;
      const pathEndPoint = 377;
      const currentPoint = pathStartPoint + (pathEndPoint - pathStartPoint) * this.battery / 100
      const pathPoint = path.getPointAtLength(currentPoint);
      xTranslation = pathPoint.x;
      yTranslation = pathPoint.y;

      const nextPoint = path.getPointAtLength((pathEndPoint - pathStartPoint) * (this.battery + 1) / 100);
      const angle = Math.atan2(nextPoint.y - pathPoint.y, nextPoint.x - pathPoint.x) * 180 / Math.PI;
      rotation += angle;
    }

    if (needle) { 
      needle.style.transform = `translate(${xTranslation}px, ${yTranslation}px) rotate(${rotation}deg)`;
    }
  }
}