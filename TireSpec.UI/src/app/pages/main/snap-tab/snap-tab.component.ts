import { Component, output, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeviceService } from '../../../services/device.service';
import { QrDialogComponent } from './qr-dialog/qr-dialog.component';
import { ManualEntryDialogComponent } from './manual-entry-dialog/manual-entry-dialog.component';
import { TireData } from '../../../models/api.models';

@Component({
  selector: 'app-snap-tab',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './snap-tab.component.html',
  styleUrl: './snap-tab.component.scss',
})
export class SnapTabComponent {
  readonly capturedImage = input<string | null>(null);
  readonly imageSelected = output<string>();
  readonly manualDataSubmitted = output<TireData>();
  readonly changeImage = output<void>();

  constructor(
    readonly device: DeviceService,
    private readonly dialog: MatDialog
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        this.imageSelected.emit(result);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  openQrDialog(): void {
    const dialogRef = this.dialog.open(QrDialogComponent, {
      width: '400px',
      panelClass: 'ts-dialog',
    });
    dialogRef.afterClosed().subscribe((imageDataUrl: string | undefined) => {
      if (imageDataUrl) {
        this.imageSelected.emit(imageDataUrl);
      }
    });
  }

  openManualEntry(): void {
    const dialogRef = this.dialog.open(ManualEntryDialogComponent, {
      width: '480px',
      panelClass: 'ts-dialog',
    });
    dialogRef.afterClosed().subscribe((data: TireData | undefined) => {
      if (data) {
        this.manualDataSubmitted.emit(data);
      }
    });
  }

  onChangeImage(): void {
    this.changeImage.emit();
  }
}
