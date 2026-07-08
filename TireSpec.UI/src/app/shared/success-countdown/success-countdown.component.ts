import { Component, OnInit, OnDestroy, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-success-countdown',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './success-countdown.component.html',
  styleUrl: './success-countdown.component.scss',
})
export class SuccessCountdownComponent implements OnInit, OnDestroy {
  readonly title = input<string>('Quote Sent Successfully!');
  readonly seconds = input<number>(5);
  readonly countdownFinished = output<void>();

  readonly countdown = signal(5);
  private timer: any;

  ngOnInit(): void {
    this.countdown.set(this.seconds());
    this.timer = setInterval(() => {
      this.countdown.update((c) => c - 1);
      if (this.countdown() <= 0) {
        clearInterval(this.timer);
        this.countdownFinished.emit();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
