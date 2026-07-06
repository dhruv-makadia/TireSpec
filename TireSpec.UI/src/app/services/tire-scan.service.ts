import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TireScanRequest, TireScanResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class TireScanService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/tire-scan`;

  constructor(private readonly http: HttpClient) {}

  scanTire(request: TireScanRequest): Observable<TireScanResponse> {
    return this.http.post<TireScanResponse>(this.apiUrl, request);
  }
}
