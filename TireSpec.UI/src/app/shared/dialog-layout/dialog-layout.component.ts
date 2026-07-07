import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dialog-layout',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  templateUrl: './dialog-layout.component.html',
  styleUrl: './dialog-layout.component.scss',
})
export class DialogLayoutComponent {
  readonly title = input.required<string>();
  readonly icon = input<string | undefined>(undefined);
  readonly subtitle = input<string | undefined>(undefined);
  readonly alignActions = input<'start' | 'center' | 'end'>('end');
}
