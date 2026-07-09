import { Component, OnInit, OnDestroy, signal, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '@shared/header/header.component';
import { StepProgressComponent } from '@shared/step-progress/step-progress.component';
import { FooterComponent } from '@shared/footer/footer.component';
import { SnapTabComponent } from './snap-tab/snap-tab.component';
import { IdentifyTabComponent } from './identify-tab/identify-tab.component';
import { QuoteTabComponent } from './quote-tab/quote-tab.component';
import { SessionService, TireScanService, QuoteService, DeviceService } from '@services';
import { ButtonComponent } from '@shared/button/button.component';
import { TireData, TireScanResponse, QuoteRequest, QuoteResponse } from '@models';
import * as signalR from '@microsoft/signalr';
import { environment } from '@env';
import { SuccessCountdownComponent } from '@shared/success-countdown/success-countdown.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    HeaderComponent,
    StepProgressComponent,
    FooterComponent,
    SnapTabComponent,
    IdentifyTabComponent,
    QuoteTabComponent,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    ButtonComponent,
    SuccessCountdownComponent,
  ],
  templateUrl: './main.page.html',
  styleUrl: './main.page.scss',
})
export class MainPage implements OnInit {
  readonly currentStep = signal(1);
  readonly stepperStep = signal(1);
  readonly loading = signal(false);
  readonly sessionReady = signal(false);
  readonly capturedImage = signal<string | null>(null);
  readonly scanResult = signal<TireScanResponse | null>(null);
  readonly quoteResult = signal<QuoteResponse | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly isDesktopLocked = signal(false);
  readonly isSharedSession = signal(false);
  readonly manualQuoteSent = signal(false);
  private hubConnection: signalR.HubConnection | null = null;
  private tokenForHub = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sessionService: SessionService,
    private readonly tireScanService: TireScanService,
    private readonly quoteService: QuoteService,
    private readonly snackBar: MatSnackBar,
    readonly device: DeviceService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const guid = params.get('guid');
    const token = params.get('token');

    if (token && guid) {
      this.isSharedSession.set(true);
      this.sessionService.storeToken(token, guid);
      this.sessionReady.set(true);
      this.tokenForHub = token;
      this.setupSignalR(token);

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { token: null },
        queryParamsHandling: 'merge',
      });
    } else if (guid) this.initSession(guid);
    else this.errorMessage.set('Missing GUID. Please provide a valid access link.');
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (this.hubConnection) {
      if (this.tokenForHub)
        this.hubConnection.invoke('LeaveSession', this.tokenForHub).catch(() => {});

      this.hubConnection.stop();
    }
  }

  private initSession(guid: string): void {
    this.loading.set(true);
    this.sessionService.createSession(guid).subscribe({
      next: () => {
        this.loading.set(false);
        this.sessionReady.set(true);

        const token = this.sessionService.getToken(guid);
        if (token) {
          this.tokenForHub = token;
          this.setupSignalR(this.tokenForHub);
        }
      },
      error: (err) => {
        this.loading.set(false);
        const message =
          err?.error?.message || 'Failed to create session. Invalid or expired access link.';
        this.errorMessage.set(message);
      },
    });
  }

  private setupSignalR(sessionId: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.hubBaseUrl}/capture`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('CaptureStatus', (data: { status: string; connectionId?: string }) => {
      if (
        data.status === 'connected' &&
        !this.isSharedSession() &&
        data.connectionId !== this.hubConnection?.connectionId
      ) {
        this.isDesktopLocked.set(true);
        this.dialog.closeAll();
      }

      if (
        data.status === 'disconnected' &&
        this.isSharedSession() &&
        data.connectionId !== this.hubConnection?.connectionId
      ) {
        this.isSharedSession.set(false);
        this.snackBar.open('Desktop disconnected.', 'OK', {
          duration: 4000,
        });
      }
    });

    this.hubConnection.on('QuoteRequestTriggered', (data: { quoteRequest: QuoteRequest }) => {
      if (!this.isSharedSession()) {
        this.isDesktopLocked.set(false);
        this.scanResult.set({
          imageDataUrl: this.capturedImage(),
          brand: data.quoteRequest.brand,
          model: data.quoteRequest.model,
          tireSize: data.quoteRequest.tireSize,
          dotCode: data.quoteRequest.dotCode,
          dotYear: data.quoteRequest.dotYear,
          loadIndex: data.quoteRequest.loadIndex,
          speedRating: data.quoteRequest.speedRating,
        });
        this.onTireConfirmed(data.quoteRequest);
      }
    });

    this.hubConnection
      .start()
      .then(() => {
        this.hubConnection?.invoke('JoinSession', sessionId);
      })
      .catch(() => {});
  }

  onConfirmOnDesktop(quoteRequest: QuoteRequest): void {
    if (this.hubConnection && this.tokenForHub) {
      this.hubConnection
        .invoke('TriggerQuoteOnDesktop', this.tokenForHub, quoteRequest)
        .then(() => {
          // Handled on mobile page to show countdown/success UI
        })
        .catch(() => {
          this.snackBar.open('Failed to send quote request.', 'OK', { duration: 3000 });
        });
    }
  }

  onForceNewSession(): void {
    this.sessionService.clearToken();
    const guid = this.route.snapshot.queryParamMap.get('guid') || '';
    window.location.href = `${window.location.origin}/?guid=${guid}`;
  }

  onImageSelected(imageDataUrl: string): void {
    this.capturedImage.set(imageDataUrl);
    this.stepperStep.set(2);
  }

  onChangeImage(): void {
    this.capturedImage.set(null);
    this.stepperStep.set(1);
  }

  onIdentifyTire(): void {
    this.loading.set(true);
    this.tireScanService.scanTire({ imageDataUrl: this.capturedImage() }).subscribe({
      next: (result) => {
        this.loading.set(false);
        this.scanResult.set(result);
        this.currentStep.set(2);
        this.stepperStep.set(3);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Failed to scan tire. Please try again.', 'OK', { duration: 4000 });
      },
    });
  }

  onManualDataSubmitted(tireData: TireData): void {
    if (this.isSharedSession()) {
      this.onConfirmOnDesktop(tireData);
      this.manualQuoteSent.set(true);
      return;
    }

    this.loading.set(true);
    this.quoteService.getQuote(tireData).subscribe({
      next: (result) => {
        this.loading.set(false);
        this.quoteResult.set(result);
        this.scanResult.set({
          imageDataUrl: null,
          brand: tireData.brand,
          model: tireData.model,
          tireSize: tireData.tireSize,
          dotCode: tireData.dotCode,
          dotYear: tireData.dotYear,
          loadIndex: tireData.loadIndex,
          speedRating: tireData.speedRating,
        });
        this.currentStep.set(3);
        this.stepperStep.set(4);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Failed to get quote. Please try again.', 'OK', {
          duration: 4000,
        });
      },
    });
  }

  onCountdownFinished(): void {
    const guid = this.route.snapshot.queryParamMap.get('guid') || '';
    window.location.href = `${window.location.origin}/?guid=${guid}`;
  }

  onTireConfirmed(quoteRequest: QuoteRequest): void {
    this.loading.set(true);
    this.quoteService.getQuote(quoteRequest).subscribe({
      next: (result) => {
        this.loading.set(false);
        this.quoteResult.set(result);
        this.currentStep.set(3);
        this.stepperStep.set(4);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Failed to get quote. Please try again.', 'OK', { duration: 4000 });
      },
    });
  }

  onRescan(): void {
    this.capturedImage.set(null);
    this.scanResult.set(null);
    this.currentStep.set(1);
    this.stepperStep.set(1);
  }

  onRestart(): void {
    this.capturedImage.set(null);
    this.scanResult.set(null);
    this.quoteResult.set(null);
    this.currentStep.set(1);
    this.stepperStep.set(1);
  }
}
