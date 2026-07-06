import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../../shared/header/header.component';
import { StepProgressComponent } from '../../shared/step-progress/step-progress.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { SnapTabComponent } from './snap-tab/snap-tab.component';
import { IdentifyTabComponent } from './identify-tab/identify-tab.component';
import { QuoteTabComponent } from './quote-tab/quote-tab.component';
import { SessionService } from '../../services/session.service';
import { TireScanService } from '../../services/tire-scan.service';
import { QuoteService } from '../../services/quote.service';
import {
  TireData,
  TireScanResponse,
  QuoteRequest,
  QuoteResponse,
} from '../../models/api.models';

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
  ],
  templateUrl: './main.page.html',
  styleUrl: './main.page.scss',
})
export class MainPage implements OnInit {
  readonly currentStep = signal(1);
  readonly loading = signal(false);
  readonly sessionReady = signal(false);
  readonly capturedImage = signal<string | null>(null);
  readonly scanResult = signal<TireScanResponse | null>(null);
  readonly quoteResult = signal<QuoteResponse | null>(null);
  readonly errorMessage = signal<string | null>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sessionService: SessionService,
    private readonly tireScanService: TireScanService,
    private readonly quoteService: QuoteService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const guid = params.get('guid');
      if (!guid) {
        this.errorMessage.set('Missing GUID. Please provide a valid access link.');
        return;
      }
      this.initSession(guid);
    });
  }

  private initSession(guid: string): void {
    this.loading.set(true);
    this.sessionService.createSession(guid).subscribe({
      next: () => {
        this.loading.set(false);
        this.sessionReady.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        const message = err?.error?.message || 'Failed to create session. Invalid or expired access link.';
        this.errorMessage.set(message);
      },
    });
  }

  onImageSelected(imageDataUrl: string): void {
    this.capturedImage.set(imageDataUrl);
  }

  onChangeImage(): void {
    this.capturedImage.set(null);
  }

  onIdentifyTire(): void {
    this.loading.set(true);
    this.tireScanService
      .scanTire({ imageDataUrl: this.capturedImage() })
      .subscribe({
        next: (result) => {
          this.loading.set(false);
          this.scanResult.set(result);
          this.currentStep.set(2);
        },
        error: () => {
          this.loading.set(false);
          this.snackBar.open('Failed to scan tire. Please try again.', 'OK', { duration: 4000 });
        },
      });
  }

  onManualDataSubmitted(tireData: TireData): void {
    this.loading.set(true);
    this.tireScanService
      .scanTire({ manualData: tireData })
      .subscribe({
        next: (result) => {
          this.loading.set(false);
          this.scanResult.set(result);
          this.currentStep.set(2);
        },
        error: () => {
          this.loading.set(false);
          this.snackBar.open('Failed to process tire data. Please try again.', 'OK', { duration: 4000 });
        },
      });
  }

  onTireConfirmed(quoteRequest: QuoteRequest): void {
    this.loading.set(true);
    this.quoteService.getQuote(quoteRequest).subscribe({
      next: (result) => {
        this.loading.set(false);
        this.quoteResult.set(result);
        this.currentStep.set(3);
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
  }

  onRestart(): void {
    this.capturedImage.set(null);
    this.scanResult.set(null);
    this.quoteResult.set(null);
    this.currentStep.set(1);
  }
}
