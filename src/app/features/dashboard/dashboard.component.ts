import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthorService } from '../../core/services/author.service';
import { BookService } from '../../core/services/book.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  authorsCount = 0;
  booksCount = 0;
  loading = true;
  error: string | null = null;

  constructor(
    private authorService: AuthorService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.authorService.getAll().subscribe({
      next: (authors) => {
        this.authorsCount = authors.length;
        this.loadBooks();
      },
      error: (err) => {
        this.error = 'Failed to load authors';
        this.loading = false;
        console.error(err);
      },
    });
  }

  loadBooks(): void {
    this.bookService.getAll().subscribe({
      next: (books) => {
        this.booksCount = books.length;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load books';
        this.loading = false;
        console.error(err);
      },
    });
  }
}
