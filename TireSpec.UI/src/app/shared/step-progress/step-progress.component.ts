import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-step-progress',
  standalone: true,
  imports: [MatIconModule, MatStepperModule],
  templateUrl: './step-progress.component.html',
  styleUrl: './step-progress.component.scss',
})
export class StepProgressComponent {
  readonly currentStep = input<number>(1);

  readonly steps = [
    { label: 'Point', number: 1 },
    { label: 'Snap', number: 2 },
    { label: 'Quote', number: 3 },
  ];

  readonly selectedIndex = computed(() => {
    // 1-indexed currentStep mapped to 0-indexed selectedIndex, capped at index of last step.
    const step = this.currentStep();
    return Math.max(0, Math.min(step - 1, this.steps.length - 1));
  });

  isStepCompleted(stepNumber: number): boolean {
    const step = this.currentStep();
    return stepNumber < step;
  }
}
