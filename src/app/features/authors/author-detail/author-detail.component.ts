import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AuthorService, Author } from '../../../core/services/author.service';
import { BookService, Book } from '../../../core/services/book.service';

@Component({
  selector: 'app-author-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './author-detail.component.html',
  styleUrls: ['./author-detail.component.css'],
})
export class AuthorDetailComponent implements OnInit {
  author: Author | null = null;
  books: Book[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private authorService: AuthorService,
    private bookService: BookService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAuthor(parseInt(id, 10));
    }
  }

  loadAuthor(id: number): void {
    this.authorService.getById(id).subscribe({
      next: (author) => {
        this.author = author;
        this.loadBooks(id);
      },
      error: (err) => {
        this.error = 'Failed to load author';
        this.loading = false;
        console.error(err);
      },
    });
  }

  loadBooks(authorId: number): void {
    this.bookService.getByAuthor(authorId).subscribe({
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

  deleteAuthor(): void {
    if (
      this.author &&
      confirm('Are you sure you want to delete this author?')
    ) {
      this.authorService.delete(this.author.id!).subscribe({
        next: () => {
          window.location.href = '/authors';
        },
        error: (err) => {
          this.error = 'Failed to delete author';
          console.error(err);
        },
      });
    }
  }
}
