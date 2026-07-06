import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private readonly mobileBreakpoint = 768;
  readonly isMobile = signal(this.checkMobile());

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.isMobile.set(this.checkMobile()));
    }
  }

  private checkMobile(): boolean {
    if (typeof window === 'undefined') return false;

    const userAgent = navigator.userAgent || navigator.vendor;
    const isMobileUA = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isSmallScreen = window.innerWidth < this.mobileBreakpoint;

    return isMobileUA || isSmallScreen;
  }
}
