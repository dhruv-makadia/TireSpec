import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
})
export class BannerComponent {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly icon = input.required<string>();
  readonly type = input<'success' | 'confirm' | 'info'>('info');
}
