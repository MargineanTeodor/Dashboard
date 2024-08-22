import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
@Injectable({
 providedIn: 'root',
})
export class WebSocketService {
 private webSocket: Socket;
 constructor() {
  this.webSocket = new Socket({
   url: "http://192.168.88.35:5005",
   options: {},
  });
 }

   // Method to start connection/handshake with the server
   connectSocket(message: any) {
    this.webSocket.emit('message', message);
  }

  // Method to receive memory usage updates
  receiveMemoryUsage(): Observable<any> {
    return this.webSocket.fromEvent('memory_channel');
  }

  // Method to receive CPU usage updates
  receiveCpuUsage(): Observable<any> {
    return this.webSocket.fromEvent('cpu_channel');
  }

  // Method to receive disk usage updates
  receiveDiskUsage(): Observable<any> {
    return this.webSocket.fromEvent('disk_channel');
  }

  // Method to receive the initial connection confirmation
  onConnect(): Observable<any> {
    console.log("connected ")
    return this.webSocket.fromEvent('after connect');
  }

  // Method to end the WebSocket connection
  disconnectSocket() {
    this.webSocket.disconnect();
  }
}