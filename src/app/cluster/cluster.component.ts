import { Component, Input } from '@angular/core';

import { SpeedometerComponent } from './speedometer/speedometer.component';
import { BatteryLevelComponent } from './battery-level/battery-level.component';
import { MapComponent } from './map/map.component';
import { CarComponent } from './car/car.component';
import { InstantConsumptionComponent } from './instant-consumption/instant-consumption.component';
import { MemoryUsageComponent } from "./memory-usage/memory-usage.component";

@Component({
  selector: 'app-cluster',
  standalone: true,
  imports: [SpeedometerComponent, BatteryLevelComponent, MapComponent, CarComponent, InstantConsumptionComponent, MemoryUsageComponent],
  templateUrl: './cluster.component.html',
  styleUrl: './cluster.component.css'
})
export class ClusterComponent {
  @Input() speed: number = 0;
  @Input() battery: number = 0;
  @Input() instantConsumption: number = 0;
  @Input() memoryUsage: number = 0;
  @Input() mapX: number = 0;
  @Input() mapY: number = 0;
  @Input() cursorRotation: number = 0;
  @Input() carPosition: number = 0;

  getRealSpeed(): number {
    return Math.round(this.speed * 60 / 100);
  }
}