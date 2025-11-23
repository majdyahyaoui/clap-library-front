import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthorListComponent } from './features/authors/author-list/author-list.component';
import { AuthorDetailComponent } from './features/authors/author-detail/author-detail.component';
import { AuthorFormComponent } from './features/authors/author-form/author-form.component';
import { BookListComponent } from './features/books/book-list/book-list.component';
import { BookDetailComponent } from './features/books/book-detail/book-detail.component';
import { BookFormComponent } from './features/books/book-form/book-form.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'authors',
    component: AuthorListComponent,
  },
  {
    path: 'authors/new',
    component: AuthorFormComponent,
  },
  {
    path: 'authors/:id',
    component: AuthorDetailComponent,
  },
  {
    path: 'authors/:id/edit',
    component: AuthorFormComponent,
  },
  {
    path: 'books',
    component: BookListComponent,
  },
  {
    path: 'books/new',
    component: BookFormComponent,
  },
  {
    path: 'books/:id',
    component: BookDetailComponent,
  },
  {
    path: 'books/:id/edit',
    component: BookFormComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
