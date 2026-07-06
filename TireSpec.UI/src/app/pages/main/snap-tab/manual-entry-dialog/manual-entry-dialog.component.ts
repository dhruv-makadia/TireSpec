import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TireData } from '../../../../models/api.models';

@Component({
  selector: 'app-manual-entry-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './manual-entry-dialog.component.html',
  styleUrl: './manual-entry-dialog.component.scss',
})
export class ManualEntryDialogComponent {
  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<ManualEntryDialogComponent>
  ) {
    this.form = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      tireSize: ['', Validators.required],
      dotCode: [''],
      dotYear: [''],
      loadIndex: [''],
      speedRating: [''],
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value as TireData);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
