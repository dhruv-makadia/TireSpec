import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as signalR from '@microsoft/signalr';
import { environment } from '@env';
import { HeaderComponent } from '@shared/header/header.component';
import { FooterComponent } from '@shared/footer/footer.component';
import { BannerComponent } from '@shared/banner/banner.component';
import { ButtonComponent } from '@shared/button/button.component';

@Component({
  selector: 'app-capture-page',
  standalone: true,
  imports: [
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    HeaderComponent,
    FooterComponent,
    BannerComponent,
    ButtonComponent,
  ],
  templateUrl: './capture.page.html',
  styleUrl: './capture.page.scss',
})
export class CapturePage implements OnInit, OnDestroy {
  private hubConnection: signalR.HubConnection | null = null;
  private sessionKey = '';

  readonly status = signal<'connecting' | 'ready' | 'captured' | 'sent' | 'error'>('connecting');
  readonly capturedImage = signal<string | null>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.sessionKey = params.get('key') || '';
      if (!this.sessionKey) {
        this.status.set('error');
        return;
      }
      this.connectHub();
    });
  }

  ngOnDestroy(): void {
    if (this.hubConnection) {
      this.hubConnection.invoke('LeaveSession', this.sessionKey).catch(() => {});
      this.hubConnection.stop();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.capturedImage.set(e.target?.result as string);
        this.status.set('captured');
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  async sendPhoto(): Promise<void> {
    const image = this.capturedImage();
    if (!image || !this.hubConnection) return;

    try {
      await this.hubConnection.invoke('SubmitPhoto', this.sessionKey, image);
      this.status.set('sent');
      this.snackBar.open('Photo sent to desktop!', 'OK', { duration: 3000 });
    } catch {
      this.snackBar.open('Failed to send photo. Please try again.', 'OK', { duration: 4000 });
    }
  }

  retake(): void {
    this.capturedImage.set(null);
    this.status.set('ready');
  }

  private connectHub(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.hubBaseUrl}/capture`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.hubConnection?.invoke('JoinSession', this.sessionKey);
        this.status.set('ready');
      })
      .catch(() => {
        this.status.set('error');
      });
  }
}
