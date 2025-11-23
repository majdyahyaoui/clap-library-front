import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { BookService, Book } from '../../../core/services/book.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBook(parseInt(id, 10));
    }
  }

  loadBook(id: number): void {
    this.bookService.getById(id).subscribe({
      next: (book) => {
        this.book = book;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load book';
        this.loading = false;
        console.error(err);
      },
    });
  }

  deleteBook(): void {
    if (this.book && confirm('Are you sure you want to delete this book?')) {
      this.bookService.delete(this.book.id!).subscribe({
        next: () => {
          window.location.href = '/books';
        },
        error: (err) => {
          this.error = 'Failed to delete book';
          console.error(err);
        },
      });
    }
  }
}
