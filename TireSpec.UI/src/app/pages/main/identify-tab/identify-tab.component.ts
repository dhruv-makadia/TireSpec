import { Component, input, output, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TireScanResponse, QuoteRequest } from '@models';
import { InputComponent } from '@shared/input/input.component';
import { ButtonComponent } from '@shared/button/button.component';
import { ActivatedRoute } from '@angular/router';

import { SuccessCountdownComponent } from '@shared/success-countdown/success-countdown.component';

@Component({
  selector: 'app-identify-tab',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    InputComponent,
    ButtonComponent,
    SuccessCountdownComponent,
  ],
  templateUrl: './identify-tab.component.html',
  styleUrl: './identify-tab.component.scss',
})
export class IdentifyTabComponent implements OnInit {
  readonly scanResult = input.required<TireScanResponse>();
  readonly capturedImage = input<string | null>(null);
  readonly isSharedSession = input<boolean>(false);
  readonly confirmed = output<QuoteRequest>();
  readonly confirmOnDesktop = output<QuoteRequest>();
  readonly rescan = output<void>();
  readonly countdownFinished = output<void>();

  readonly quoteSent = signal(false);

  form!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const data = this.scanResult();
    this.form = this.fb.group({
      brand: [data.brand, Validators.required],
      model: [data.model, Validators.required],
      tireSize: [data.tireSize, Validators.required],
      dotCode: [data.dotCode],
      dotYear: [data.dotYear],
      loadIndex: [data.loadIndex],
      speedRating: [data.speedRating],
    });
  }

  onConfirm(): void {
    if (this.form.valid) {
      const val = this.form.value;
      this.confirmed.emit({
        brand: val.brand!,
        model: val.model!,
        tireSize: val.tireSize!,
        dotCode: val.dotCode || '',
        dotYear: val.dotYear || '',
        loadIndex: val.loadIndex || '',
        speedRating: val.speedRating || '',
      });
    }
  }

  onConfirmOnDesktop(): void {
    if (this.form.valid) {
      const val = this.form.value;
      const quoteReq: QuoteRequest = {
        brand: val.brand!,
        model: val.model!,
        tireSize: val.tireSize!,
        dotCode: val.dotCode || '',
        dotYear: val.dotYear || '',
        loadIndex: val.loadIndex || '',
        speedRating: val.speedRating || '',
      };

      this.confirmOnDesktop.emit(quoteReq);
      this.quoteSent.set(true);
    }
  }

  onCountdownFinished(): void {
    this.countdownFinished.emit();
  }

  onRescan(): void {
    this.rescan.emit();
  }
}
