import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [],
  templateUrl: './car.component.html',
  styleUrl: './car.component.css'
})
export class CarComponent implements OnChanges {
  @Input() position: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['position']) {
      this.updateCar();
    }
  }

  updateCar(): void {
    const car = document.getElementById("car-image-svg") as HTMLElement;
    if (car) {
      const xTranslation = this.position * 0.5;
      car.style.transform = `translateX(${xTranslation}px)`;

      const leftLine = document.getElementById("car-road-line-left") as HTMLElement;      
      const rightLine = document.getElementById("car-road-line-right") as HTMLElement;

      if (xTranslation > 40) {
        rightLine.style.stroke = "red";
      }
      else if (xTranslation > 25) { 
        rightLine.style.stroke = "orange";
      }
      else {
        rightLine.style.stroke = "white";
      }

      
      if (xTranslation < -40) {
        leftLine.style.stroke = "red";
      }
      else if (xTranslation < -25) { 
        leftLine.style.stroke = "orange";
      }
      else {
        leftLine.style.stroke = "white";
      }
    }
  }
}



