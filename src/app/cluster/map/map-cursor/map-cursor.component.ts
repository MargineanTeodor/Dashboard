import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-map-cursor',
  standalone: true,
  imports: [],
  templateUrl: './map-cursor.component.html',
  styleUrl: './map-cursor.component.css'
})
export class MapCursorComponent implements OnChanges {
  @Input() cursorRotation: number = 0;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cursorRotation']) {
      this.updateRotation();
    }
  }

  updateRotation(): void {
    const cursor = document.getElementById("map-cursor-arrow") as HTMLElement;
    if (cursor) {
      cursor.style.transform = `rotate(${this.cursorRotation}deg)`;
    }
  }
}
