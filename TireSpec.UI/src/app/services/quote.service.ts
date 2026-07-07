import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { QuoteRequest, QuoteResponse } from '@models';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/quotes`;

  constructor(private readonly http: HttpClient) {}

  getQuote(request: QuoteRequest): Observable<QuoteResponse> {
    return this.http.post<QuoteResponse>(this.apiUrl, request);
  }
}
