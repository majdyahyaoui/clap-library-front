import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthorService, Author } from '../../../core/services/author.service';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
  ],
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.css'],
})
export class AuthorListComponent implements OnInit {
  authors: Author[] = [];
  displayedColumns: string[] = ['name', 'actions'];
  loading = true;
  error: string | null = null;
  searchQuery = '';

  constructor(private authorService: AuthorService) {}

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.authorService.getAll().subscribe({
      next: (authors) => {
        this.authors = authors;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load authors';
        this.loading = false;
        console.error(err);
      },
    });
  }

  deleteAuthor(id: number, firstName: string, lastName: string): void {
    if (confirm(`Delete ${firstName} ${lastName}?`)) {
      this.authorService.delete(id).subscribe({
        next: () => {
          this.authors = this.authors.filter((a) => a.id !== id);
        },
        error: (err) => {
          this.error = 'Failed to delete author';
          console.error(err);
        },
      });
    }
  }
}
