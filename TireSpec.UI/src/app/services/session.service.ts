import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@env';
import { CreateSessionRequest, CreateSessionResponse } from '@models';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/sessions`;
  private readonly cookieName = 'tirespec_token';

  constructor(private readonly http: HttpClient) {}

  createSession(websiteId: string): Observable<CreateSessionResponse> {
    const body: CreateSessionRequest = { websiteId };
    return this.http
      .post<CreateSessionResponse>(`${this.apiUrl}/create`, body)
      .pipe(tap((response) => this.storeToken(response.jwt)));
  }

  getToken(): string | null {
    const match = new RegExp(new RegExp(`(?:^|; )${this.cookieName}=([^;]*)`)).exec(
      document.cookie,
    );
    return match ? decodeURIComponent(match[1]) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  clearToken(): void {
    document.cookie = `${this.cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
  }

  storeToken(jwt: string): void {
    let cookieStr = `${this.cookieName}=${encodeURIComponent(jwt)}; path=/; SameSite=Strict`;
    const expireDate = new Date();
    expireDate.setMinutes(expireDate.getMinutes() + environment.LifetimeMinutes);
    cookieStr += `; expires=${expireDate.toUTCString()}`;
    document.cookie = cookieStr;
  }
}
