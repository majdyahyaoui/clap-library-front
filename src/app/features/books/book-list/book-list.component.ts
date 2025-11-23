import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService, Book } from '../../../core/services/book.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  loading = true;
  error: string | null = null;
  searchQuery = '';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getAll().subscribe({
      next: (books) => {
        this.books = books;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load books';
        this.loading = false;
        console.error(err);
      },
    });
  }

  deleteBook(id: number, title: string): void {
    if (confirm(`Delete "${title}"?`)) {
      this.bookService.delete(id).subscribe({
        next: () => {
          this.books = this.books.filter((b) => b.id !== id);
        },
        error: (err) => {
          this.error = 'Failed to delete book';
          console.error(err);
        },
      });
    }
  }
}
