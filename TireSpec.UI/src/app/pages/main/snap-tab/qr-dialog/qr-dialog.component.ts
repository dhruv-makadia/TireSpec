import { Component, OnInit, ElementRef, viewChild, signal } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as QRCode from 'qrcode';
import { environment } from '@env';
import { DialogLayoutComponent } from '@shared/dialog-layout/dialog-layout.component';
import { ButtonComponent } from '@shared/button/button.component';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '@services';

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
export class QrDialogComponent implements OnInit {
  readonly qrCanvas = viewChild<ElementRef<HTMLCanvasElement>>('qrCanvas');
  readonly status = signal<'generating' | 'waiting'>('generating');

  constructor(
    private readonly dialogRef: MatDialogRef<QrDialogComponent>,
    private readonly sessionService: SessionService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // QR generation happens after view init
    setTimeout(() => this.generateQR(), 100);
  }

  private async generateQR(): Promise<void> {
    const canvas = this.qrCanvas()?.nativeElement;
    if (!canvas) return;

    const guid = this.route.snapshot.queryParamMap.get('guid') || '';
    const token = this.sessionService.getToken(guid) || '';
    const captureUrl = `${environment.appBaseUrl}/?guid=${guid}&token=${token}`;

    await QRCode.toCanvas(canvas, captureUrl, {
      width: 200,
      margin: 2,
      color: { dark: '#1a2332', light: '#ffffff' },
    });
    this.status.set('waiting');
  }

  close(): void {
    this.dialogRef.close();
  }
}
