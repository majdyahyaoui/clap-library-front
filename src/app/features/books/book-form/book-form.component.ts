import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BookService, Book } from '../../../core/services/book.service';
import { AuthorService, Author } from '../../../core/services/author.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css'],
})
export class BookFormComponent implements OnInit {
  book: Book = {
    title: '',
    price: 0,
    publicationDate: new Date().toISOString().split('T')[0],
    authorId: 0,
  };
  publicationDateObj: Date = new Date(); // For datepicker
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
        this.selectedAuthorId = book.authorId;
        // Convert string date to Date object for datepicker
        this.publicationDateObj = new Date(book.publicationDate);
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

    // Set author ID
    this.book.authorId = this.selectedAuthorId;

    // Convert Date object to string format YYYY-MM-DD
    this.book.publicationDate = this.publicationDateObj
      .toISOString()
      .split('T')[0];

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
    if (!this.book.price || this.book.price <= 0) {
      this.error = 'Price must be a positive number';
      return false;
    }
    if (!this.publicationDateObj) {
      this.error = 'Publication date is required';
      return false;
    }
    if (this.selectedAuthorId === 0) {
      this.error = 'Author is required';
      return false;
    }
    return true;
  }
}
