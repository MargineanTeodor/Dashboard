import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HeaderComponent } from './header/header.component';
import { ClusterComponent } from './cluster/cluster.component';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from './webSocket/web-socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, ClusterComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements OnInit, OnDestroy {
  title: string = 'dashboard';
  speedSliderValue: number = 0;
  batterySliderValue: number = 0;
  instantConsumptionSliderValue: number = 0;
  memoryUsageSliderValue: number = 0;
  mapXSliderValue: number = 0;
  mapYSliderValue: number = 0;
  cursorRotationSliderValue: number = 0;
  carPositionSliderValue: number = 0;
  
  private memorySubscription: Subscription | undefined;
  private connectSubscription: Subscription | undefined;
  private cpuSubscription: Subscription | undefined;
  private diskSubscription: Subscription | undefined; 
  public memoryUsage: number | undefined;
  public cpuUsage: number | undefined;
  public diskUsage: number | undefined;
  constructor( private  webSocketService: WebSocketService) { }

  ngOnInit() {
    // Listen for memory usage updates
    this.memorySubscription = this.webSocketService.receiveMemoryUsage().subscribe(
      (message) => {
        console.log('Memory usage from server:', message);
        this.memoryUsage = message.data;
      },
      (error) => {
        console.error('Error receiving memory usage:', error);
      }
    );

    // Listen for CPU core usage updates
    this.cpuSubscription = this.webSocketService.receiveCpuUsage().subscribe(
      (message) => {
        console.log('CPU core usage from server:', message);
        this.cpuUsage = message.data;
      },
      (error) => {
        console.error('Error receiving CPU core usage:', error);
      }
    );

    // Listen for disk usage updates
    this.diskSubscription = this.webSocketService.receiveDiskUsage().subscribe(
      (message) => {
        console.log('Disk usage from server:', message);
        this.diskUsage = message.data;
      },
      (error) => {
        console.error('Error receiving disk usage:', error);
      }
    );
  }

  ngOnDestroy() {
    // Unsubscribe from all observables to avoid memory leaks
    if (this.memorySubscription) {
      this.memorySubscription.unsubscribe();
    }
    if (this.cpuSubscription) {
      this.cpuSubscription.unsubscribe();
    }
    if (this.diskSubscription) {
      this.diskSubscription.unsubscribe();
    }

    // Disconnect the WebSocket
    this.webSocketService.disconnectSocket();
  }

  sendMessage(message: string) {
    this.webSocketService.connectSocket(message);
  }
}
