import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '@services';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DialogLayoutComponent } from '@shared/dialog-layout/dialog-layout.component';
import { InputComponent } from '@shared/input/input.component';
import { ButtonComponent } from '@shared/button/button.component';

@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    DialogLayoutComponent,
    InputComponent,
    ButtonComponent,
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
    private readonly snackBar: MatSnackBar,
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
      this.contactService
        .submitContact({
          name: this.form.value.name || undefined,
          phoneNumber: this.form.value.phoneNumber!,
          email: this.form.value.email || undefined,
        })
        .subscribe({
          next: (response) => {
            this.submitting = false;
            this.snackBar.open(response.message, 'OK', { duration: 4000 });
            this.dialogRef.close(true);
          },
          error: () => {
            this.submitting = false;
            this.snackBar.open('Failed to send request. Please try again.', 'OK', {
              duration: 4000,
            });
          },
        });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
