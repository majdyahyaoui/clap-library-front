import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Book {
  id?: number;
  title: string;
  isbn: string;
  publicationYear: number;
  author: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/api/books`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  create(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  update(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(title: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/search?title=${title}`);
  }

  getByAuthor(authorId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/author/${authorId}`);
  }
}
