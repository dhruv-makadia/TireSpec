import { Component, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { QuoteResponse, TireScanResponse } from '@models';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { TireSpecsComponent } from '@shared/tire-specs/tire-specs.component';
import { ButtonComponent } from '@shared/button/button.component';
import { CheckboxComponent } from '@shared/checkbox/checkbox.component';

@Component({
  selector: 'app-quote-tab',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    TireSpecsComponent,
    ButtonComponent,
    CheckboxComponent,
  ],
  templateUrl: './quote-tab.component.html',
  styleUrl: './quote-tab.component.scss',
})
export class QuoteTabComponent {
  readonly quoteData = input.required<QuoteResponse>();
  readonly scanData = input.required<TireScanResponse>();
  readonly capturedImage = input<string | null>(null);
  readonly restart = output<void>();

  readonly selectedTires = signal<Set<string>>(new Set());
  readonly expandedTires = signal<Set<string>>(new Set());

  constructor(private readonly dialog: MatDialog) {}

  toggleSelection(id: string): void {
    const current = new Set(this.selectedTires());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedTires.set(current);
  }

  isSelected(id: string): boolean {
    return this.selectedTires().has(id);
  }

  toggleDetails(id: string): void {
    const current = new Set(this.expandedTires());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.expandedTires.set(current);
  }

  isExpanded(id: string): boolean {
    return this.expandedTires().has(id);
  }

  openContactDialog(): void {
    if (this.selectedTires().size === 0) {
      return;
    }
    this.dialog.open(ContactDialogComponent, {
      width: '420px',
      panelClass: 'ts-dialog',
    });
  }

  shareQuote(): void {
    const data = this.scanData();
    const quotes = this.quoteData().recommendations;
    const quoteLines = quotes.map((q, i) => i + 1 + '. ' + q.name + ' - ' + q.price);
    const text = `TireSpec Quote\nTire: ${data.brand} ${data.model} (${data.tireSize})\n\nRecommended:\n${quoteLines.join('\n')}`;

    if (navigator.share) {
      navigator.share({ title: 'TireSpec Quote', text });
    } else {
      navigator.clipboard.writeText(text);
    }
  }

  onRestart(): void {
    this.restart.emit();
  }
}
