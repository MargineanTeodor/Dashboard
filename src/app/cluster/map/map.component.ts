import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { MapCursorComponent } from './map-cursor/map-cursor.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MapCursorComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnChanges{
  @Input() mapX: number = 0;
  @Input() mapY: number = 0;
  @Input() cursorRotation: number = 0;

  mapSize = 3000; // image size in pixels (4000 x 4000/aspec ratio)
  screenSize = {"width": 600, "height": 300}; // screen size in pixels
  mapWidth: number = 0;
  mapHeight: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mapX'] || changes['mapY']) {
      this.updateMap();
    }
  }

  onLoad(image: HTMLImageElement): void {
    const imageContainer = document.getElementById("map-track-image-container") as HTMLElement;
    
    imageContainer.style.width = `${this.screenSize["width"]}px`;
    imageContainer.style.height = `${this.screenSize["height"]}px`;

    this.mapWidth = image.width;
    this.mapHeight = image.height;

    const aspectRatio = image.width / image.height;
    const map = document.getElementById("map-track-image") as HTMLElement;

    if (map) {
      this.mapWidth = this.mapSize;
      this.mapHeight = this.mapSize / aspectRatio;
      map.style.width = `${this.mapWidth}px`;
      map.style.height = `${this.mapHeight}px`;
    }
  }
  
  updateMap(): void {
    const map = document.getElementById("map-track-image") as HTMLElement;
    if (map) {
      const top = (this.mapY * this.mapHeight) / 100 - (this.screenSize["height"] / 2);
      const left = (this.mapX * this.mapWidth) / 100 - (this.screenSize["width"] / 2);

      map.style.top = `${-top}px`;
      map.style.left = `${-left}px`;
    }
  }
}
