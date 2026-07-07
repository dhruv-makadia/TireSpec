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
  readonly capturedImage = input<string | null>(null);

  readonly steps = [
    { label: 'SNAP', number: 1 },
    { label: 'IDENTIFY', number: 2 },
    { label: 'QUOTE', number: 3 },
  ];

  readonly selectedIndex = computed(() => {
    const step = this.currentStep();
    const hasImage = !!this.capturedImage();
    if (step === 1) {
      return hasImage ? 1 : 0;
    }
    return step - 1;
  });

  isStepCompleted(stepNumber: number): boolean {
    const step = this.currentStep();
    const hasImage = !!this.capturedImage();
    if (stepNumber === 1) {
      return hasImage || step > 1;
    }
    if (stepNumber === 2) {
      return step > 2;
    }
    return false;
  }
}
