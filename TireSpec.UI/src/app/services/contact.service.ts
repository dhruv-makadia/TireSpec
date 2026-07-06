import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ContactRequest, ContactResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/contact`;

  constructor(private readonly http: HttpClient) {}

  submitContact(request: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.apiUrl, request);
  }
}
