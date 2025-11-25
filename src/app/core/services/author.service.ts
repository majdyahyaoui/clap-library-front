import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Author {
  id?: number;
  lastName: string;
  firstName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private apiUrl = `${environment.apiUrl}/api/authors`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Author[]> {
    return this.http.get<Author[]>(this.apiUrl);
  }

  getById(id: number): Observable<Author> {
    return this.http.get<Author>(`${this.apiUrl}/${id}`);
  }

  create(author: Author): Observable<Author> {
    return this.http.post<Author>(this.apiUrl, author);
  }

  update(id: number, author: Author): Observable<Author> {
    return this.http.put<Author>(`${this.apiUrl}/${id}`, author);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(firstName: string): Observable<Author[]> {
    return this.http.get<Author[]>(
      `${this.apiUrl}/search?firstName=${firstName}`
    );
  }
}
