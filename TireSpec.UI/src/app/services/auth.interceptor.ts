import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '@services';
import { environment } from '@env';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionService);

  // Only attach token for requests to our API
  if (!req.url.startsWith(environment.apiBaseUrl)) {
    return next(req);
  }

  const token = session.getToken();
  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(authReq);
  }

  return next(req);
};
