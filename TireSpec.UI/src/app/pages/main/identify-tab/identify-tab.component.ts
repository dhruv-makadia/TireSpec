import { Component, input, output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TireScanResponse, QuoteRequest } from '../../../models/api.models';

@Component({
  selector: 'app-identify-tab',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './identify-tab.component.html',
  styleUrl: './identify-tab.component.scss',
})
export class IdentifyTabComponent implements OnInit {
  readonly scanResult = input.required<TireScanResponse>();
  readonly confirmed = output<QuoteRequest>();
  readonly rescan = output<void>();

  readonly conditions = ['Unknown', 'New', 'Good', 'Fair', 'Poor'];
  form!: FormGroup;

  constructor(private readonly fb: FormBuilder) {}

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
      condition: ['Unknown'],
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

  onRescan(): void {
    this.rescan.emit();
  }
}
