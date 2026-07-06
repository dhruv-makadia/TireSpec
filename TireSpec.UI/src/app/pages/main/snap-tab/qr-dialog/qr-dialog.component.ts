import { Component, OnInit, OnDestroy, ElementRef, viewChild, signal } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as QRCode from 'qrcode';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../../../environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { DialogLayoutComponent } from '../../../../shared/dialog-layout/dialog-layout.component';
import { ButtonComponent } from '../../../../shared/button/button.component';

@Component({
  selector: 'app-qr-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DialogLayoutComponent,
    ButtonComponent,
  ],
  templateUrl: './qr-dialog.component.html',
  styleUrl: './qr-dialog.component.scss',
})
export class QrDialogComponent implements OnInit, OnDestroy {
  readonly qrCanvas = viewChild<ElementRef<HTMLCanvasElement>>('qrCanvas');
  private hubConnection: signalR.HubConnection | null = null;
  readonly status = signal<'generating' | 'waiting' | 'connected' | 'received'>('generating');
  private sessionKey = '';

  constructor(private readonly dialogRef: MatDialogRef<QrDialogComponent>) {}

  ngOnInit(): void {
    this.sessionKey = this.generateSessionKey();
    this.setupSignalR();
    // QR generation happens after view init
    setTimeout(() => this.generateQR(), 100);
  }

  ngOnDestroy(): void {
    this.hubConnection?.stop();
  }

  private generateSessionKey(): string {
    return uuidv4();
  }

  private async generateQR(): Promise<void> {
    const canvas = this.qrCanvas()?.nativeElement;
    if (!canvas) return;

    const captureUrl = `${environment.appBaseUrl}/capture?key=${this.sessionKey}`;
    await QRCode.toCanvas(canvas, captureUrl, {
      width: 200,
      margin: 2,
      color: { dark: '#1a2332', light: '#ffffff' },
    });
    this.status.set('waiting');
  }

  private setupSignalR(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.hubBaseUrl}/capture`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('CaptureStatus', (data: { status: string }) => {
      if (data.status === 'connected') {
        this.status.set('connected');
      }
    });

    this.hubConnection.on('TirePhotoCaptured', (data: { imageDataUrl: string }) => {
      this.status.set('received');
      setTimeout(() => this.dialogRef.close(data.imageDataUrl), 500);
    });

    this.hubConnection.start().then(() => {
      this.hubConnection?.invoke('JoinSession', this.sessionKey);
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
