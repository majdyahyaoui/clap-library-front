import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { BookService, Book } from '../../../core/services/book.service';
import { AuthorService, Author } from '../../../core/services/author.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css'],
})
export class BookFormComponent implements OnInit {
  book: Book = {
    title: '',
    isbn: '',
    publicationYear: new Date().getFullYear(),
    author: {
      id: 0,
      firstName: '',
      lastName: '',
    },
  };
  authors: Author[] = [];
  selectedAuthorId: number = 0;
  isEditing = false;
  loading = false;
  loadingAuthors = true;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAuthors();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loadBook(parseInt(id, 10));
    }
  }

  loadAuthors(): void {
    this.authorService.getAll().subscribe({
      next: (authors) => {
        this.authors = authors;
        this.loadingAuthors = false;
      },
      error: (err) => {
        this.error = 'Failed to load authors';
        this.loadingAuthors = false;
        console.error(err);
      },
    });
  }

  loadBook(id: number): void {
    this.loading = true;
    this.bookService.getById(id).subscribe({
      next: (book) => {
        this.book = book;
        this.selectedAuthorId = book.author.id;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load book';
        this.loading = false;
        console.error(err);
      },
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) return;

    // Update author reference
    const selectedAuthor = this.authors.find(
      (a) => a.id === this.selectedAuthorId
    );
    if (selectedAuthor) {
      this.book.author = {
        id: selectedAuthor.id!,
        firstName: selectedAuthor.firstName,
        lastName: selectedAuthor.lastName,
      };
    }

    this.loading = true;
    const operation = this.isEditing
      ? this.bookService.update(this.book.id!, this.book)
      : this.bookService.create(this.book);

    operation.subscribe({
      next: (result) => {
        this.success = `Book ${
          this.isEditing ? 'updated' : 'created'
        } successfully!`;
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/books', result.id]);
        }, 1000);
      },
      error: (err) => {
        this.error = 'Failed to save book';
        this.loading = false;
        console.error(err);
      },
    });
  }

  validateForm(): boolean {
    if (!this.book.title.trim()) {
      this.error = 'Title is required';
      return false;
    }
    if (!this.book.isbn.trim()) {
      this.error = 'ISBN is required';
      return false;
    }
    if (
      !this.book.publicationYear ||
      this.book.publicationYear < 1000 ||
      this.book.publicationYear > new Date().getFullYear()
    ) {
      this.error = 'Invalid publication year';
      return false;
    }
    if (this.selectedAuthorId === 0) {
      this.error = 'Author is required';
      return false;
    }
    return true;
  }
}
