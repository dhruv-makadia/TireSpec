import { TestBed, ComponentFixture } from '@angular/core/testing';
import { StepProgressComponent } from './step-progress.component';
import { By } from '@angular/platform-browser';
import { MatStepper } from '@angular/material/stepper';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('StepProgressComponent', () => {
  let component: StepProgressComponent;
  let fixture: ComponentFixture<StepProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepProgressComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StepProgressComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedIndex to 0 and not complete SNAP when currentStep is 1 and capturedImage is null', async () => {
    fixture.componentRef.setInput('currentStep', 1);
    fixture.componentRef.setInput('capturedImage', null);
    fixture.detectChanges();
    await fixture.whenStable();

    const stepperDebug = fixture.debugElement.query(By.directive(MatStepper));
    const stepper = stepperDebug.componentInstance as MatStepper;
    expect(stepper.selectedIndex).toBe(0);

    const steps = stepper.steps.toArray();
    expect(steps[0].completed).toBe(false);
    expect(steps[1].completed).toBe(false);
    expect(steps[2].completed).toBe(false);
  });

  it('should set selectedIndex to 1 and complete SNAP when currentStep is 1 and capturedImage is set', async () => {
    fixture.componentRef.setInput('currentStep', 1);
    fixture.componentRef.setInput('capturedImage', 'data:image/png;base64,abc');
    fixture.detectChanges();
    await fixture.whenStable();

    const stepperDebug = fixture.debugElement.query(By.directive(MatStepper));
    const stepper = stepperDebug.componentInstance as MatStepper;
    expect(stepper.selectedIndex).toBe(1);

    const steps = stepper.steps.toArray();
    expect(steps[0].completed).toBe(true);
    expect(steps[1].completed).toBe(false);
    expect(steps[2].completed).toBe(false);
  });

  it('should set selectedIndex to 1 and complete SNAP when currentStep is 2', async () => {
    fixture.componentRef.setInput('currentStep', 2);
    fixture.componentRef.setInput('capturedImage', null);
    fixture.detectChanges();
    await fixture.whenStable();

    const stepperDebug = fixture.debugElement.query(By.directive(MatStepper));
    const stepper = stepperDebug.componentInstance as MatStepper;
    expect(stepper.selectedIndex).toBe(1);

    const steps = stepper.steps.toArray();
    expect(steps[0].completed).toBe(true);
    expect(steps[1].completed).toBe(false);
    expect(steps[2].completed).toBe(false);
  });

  it('should set selectedIndex to 2 and complete SNAP & IDENTIFY when currentStep is 3', async () => {
    fixture.componentRef.setInput('currentStep', 3);
    fixture.componentRef.setInput('capturedImage', null);
    fixture.detectChanges();
    await fixture.whenStable();

    const stepperDebug = fixture.debugElement.query(By.directive(MatStepper));
    const stepper = stepperDebug.componentInstance as MatStepper;
    expect(stepper.selectedIndex).toBe(2);

    const steps = stepper.steps.toArray();
    expect(steps[0].completed).toBe(true);
    expect(steps[1].completed).toBe(true);
    expect(steps[2].completed).toBe(false);
  });
});
