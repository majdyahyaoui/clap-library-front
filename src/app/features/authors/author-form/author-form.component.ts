import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthorService, Author } from '../../../core/services/author.service';

@Component({
  selector: 'app-author-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.css'],
})
export class AuthorFormComponent implements OnInit {
  author: Author = {
    firstName: '',
    lastName: '',
  };
  isEditing = false;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private authorService: AuthorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loadAuthor(parseInt(id, 10));
    }
  }

  loadAuthor(id: number): void {
    this.loading = true;
    this.authorService.getById(id).subscribe({
      next: (author) => {
        this.author = author;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load author';
        this.loading = false;
        console.error(err);
      },
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) return;

    this.loading = true;
    const operation = this.isEditing
      ? this.authorService.update(this.author.id!, this.author)
      : this.authorService.create(this.author);

    operation.subscribe({
      next: (result) => {
        this.success = `Author ${
          this.isEditing ? 'updated' : 'created'
        } successfully!`;
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/authors', result.id]);
        }, 1000);
      },
      error: (err) => {
        this.error = 'Failed to save author';
        this.loading = false;
        console.error(err);
      },
    });
  }

  validateForm(): boolean {
    if (!this.author.firstName.trim()) {
      this.error = 'First name is required';
      return false;
    }
    if (!this.author.lastName.trim()) {
      this.error = 'Last name is required';
      return false;
    }
    return true;
  }
}
