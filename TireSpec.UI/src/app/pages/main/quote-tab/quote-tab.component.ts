import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { QuoteResponse, TireScanResponse } from '../../../models/api.models';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';

@Component({
  selector: 'app-quote-tab',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './quote-tab.component.html',
  styleUrl: './quote-tab.component.scss',
})
export class QuoteTabComponent {
  readonly quoteData = input.required<QuoteResponse>();
  readonly scanData = input.required<TireScanResponse>();
  readonly restart = output<void>();

  constructor(private readonly dialog: MatDialog) {}

  openContactDialog(): void {
    this.dialog.open(ContactDialogComponent, {
      width: '420px',
      panelClass: 'ts-dialog',
    });
  }

  shareQuote(): void {
    const data = this.scanData();
    const quotes = this.quoteData().recommendations;
    const text = `TireSpec Quote\nTire: ${data.brand} ${data.model} (${data.tireSize})\n\nRecommended:\n${quotes.map((q, i) => `${i + 1}. ${q.name} - ${q.price}`).join('\n')}`;

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
