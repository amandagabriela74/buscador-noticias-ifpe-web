import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { NewsItem } from './models/news.model';
import { NewsSectionComponent } from './components/news-section/news-section.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { PaginationComponent } from './components/app-pagination/app.pagination';
import { SearchService } from './services/search.service';
import { NewsService } from './services/news.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppHeaderComponent,
    SearchBarComponent,
    NewsSectionComponent,
    PaginationComponent,
  ],
})
export class AppComponent implements OnInit {
  latestFeatured$: Observable<NewsItem | null>;
  latestSide$: Observable<NewsItem[]>;
  allNews$: Observable<NewsItem[]>;
  searchForm = new FormGroup({
    query: new FormControl('', { nonNullable: true }),
  });
  private readonly currentList$ = new BehaviorSubject<NewsItem[]>([]);
  private readonly currentPage$ = new BehaviorSubject<number>(1);
  private readonly itemsPerPage = 6;
  currentPage = 1;
  totalPages = 1;
  isSearching = false;
  hasSearch = false;

  constructor(
    private readonly newsService: NewsService,
    private readonly searchService: SearchService
  ) {
    const all$ = this.currentList$.asObservable();

    this.latestFeatured$ = all$.pipe(map((items) => items[0] ?? null));
    this.latestSide$ = all$.pipe(map((items) => items.slice(1, 3)));
    
    this.allNews$ = combineLatest([all$, this.currentPage$]).pipe(
      map(([items, page]) => {
        this.currentPage = page;
        if (this.hasSearch) {
          return this.getPageItems(items);
        }
        return this.getPageItems(items.slice(3));
      })
    );

    this.newsService.getAll().subscribe((items) => {
      if (!this.hasSearch) {
        this.currentList$.next(items ?? []);
        this.updateTotalPages(items ?? []);
        this.currentPage$.next(1);
      }
    });
  }

  ngOnInit(): void {
    this.newsService.load();
  }

  onSearch(): void {
    const term = this.searchForm.controls.query.value.trim();

    if (!term) {
      this.hasSearch = false;
      this.newsService.getAll().subscribe(items => {
        this.currentList$.next(items ?? []);
        this.updateTotalPages(items ?? []);
        this.currentPage$.next(1);
      });
      return;
    }

    this.hasSearch = true;
    this.isSearching = true;
    this.currentPage$.next(1);

    this.searchService.search(term).subscribe({
      next: (items) => {
        this.currentList$.next(items ?? []);
        this.updateTotalPages(items ?? []);
      },
      error: () => this.currentList$.next([]),
      complete: () => (this.isSearching = false),
    });
  }
  resetSearch(): void {
  this.searchForm.reset({ query: '' });
  this.hasSearch = false;
  this.isSearching = false;
  this.currentPage$.next(1);

  this.newsService.getAll().subscribe(items =>
    this.currentList$.next(items ?? [])
  );
}


  onPageChange(page: number): void {
    this.currentPage$.next(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private getPageItems(items: NewsItem[]): NewsItem[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return items.slice(start, end);
  }

  private updateTotalPages(items: NewsItem[]): void {
    if (this.hasSearch) {
      this.totalPages = Math.ceil(items.length / this.itemsPerPage);
    } else {
      const itemsForPagination = items.length > 3 ? items.length - 3 : 0;
      this.totalPages = Math.ceil(itemsForPagination / this.itemsPerPage);
    }
  }

  trackById(_index: number, item: NewsItem): string {
    return item.id;
  }
}

