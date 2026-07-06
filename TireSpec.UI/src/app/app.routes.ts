import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/main/main.page').then((m) => m.MainPage),
  },
  {
    path: 'capture',
    loadComponent: () =>
      import('./pages/capture/capture.page').then((m) => m.CapturePage),
  },
];
