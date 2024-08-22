import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-memory-usage',
  standalone: true,
  imports: [],
  templateUrl: './memory-usage.component.html',
  styleUrl: './memory-usage.component.css'
})
export class MemoryUsageComponent implements OnChanges {
  @Input() usage: number = 0;
  needleStartRotation: number = 35;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usage']) {
      this.updateNeedle();
    }
  }

  updateNeedle(): void {
    let xTranslation: number = 0
    let yTranslation: number = 0
    let rotation: number = 0
    const needle = document.getElementById("memory-usage-needle-svg");
    const path = document.getElementById("memory-usage-path");

    rotation += this.needleStartRotation;

    if (path instanceof SVGPathElement) {
      const pathStartPoint = 60.8;
      const pathEndPoint = 150.8;
      
      const currentPoint = pathStartPoint + (pathEndPoint - pathStartPoint) * this.usage / 100
      const pathPoint = path.getPointAtLength(currentPoint);
      xTranslation = pathPoint.x;
      yTranslation = pathPoint.y;

      const nextPoint = path.getPointAtLength((pathEndPoint - pathStartPoint) * (this.usage + 1) / 100);
      const angle = Math.atan2(nextPoint.y - pathPoint.y, nextPoint.x - pathPoint.x) * 180 / Math.PI * 0.5;
      rotation += angle;
    }

    if (needle) { 
      needle.style.transform = `translate(${xTranslation}px, ${yTranslation}px) rotate(${rotation}deg)`;
    }
  }
}