import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../../../services/contact.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './contact-dialog.component.html',
  styleUrl: './contact-dialog.component.scss',
})
export class ContactDialogComponent {
  form: FormGroup;
  submitting = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<ContactDialogComponent>,
    private readonly contactService: ContactService,
    private readonly snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: [''],
      phoneNumber: ['', Validators.required],
      email: [''],
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.submitting = true;
      this.contactService.submitContact({
        name: this.form.value.name || undefined,
        phoneNumber: this.form.value.phoneNumber!,
        email: this.form.value.email || undefined,
      }).subscribe({
        next: (response) => {
          this.submitting = false;
          this.snackBar.open(response.message, 'OK', { duration: 4000 });
          this.dialogRef.close(true);
        },
        error: () => {
          this.submitting = false;
          this.snackBar.open('Failed to send request. Please try again.', 'OK', { duration: 4000 });
        },
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
