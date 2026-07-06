import { Component, input } from '@angular/core';
import { TireScanResponse } from '../../models/api.models';

@Component({
  selector: 'app-tire-specs',
  standalone: true,
  templateUrl: './tire-specs.component.html',
  styleUrl: './tire-specs.component.scss',
})
export class TireSpecsComponent {
  readonly scanData = input.required<TireScanResponse>();
}
