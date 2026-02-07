import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NewsItem } from './models/news.model';
import { NewsSectionComponent } from './components/news-section/news-section.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
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
  isSearching = false;
  hasSearch = false;

  constructor(
    private readonly newsService: NewsService,
    private readonly searchService: SearchService
  ) {
    const all$ = this.currentList$.asObservable();

    this.latestFeatured$ = all$.pipe(map((items) => items[0] ?? null));
    this.latestSide$ = all$.pipe(map((items) => items.slice(1, 3)));
    this.allNews$ = all$;

    this.newsService.getAll().subscribe((items) => {
      if (!this.hasSearch) {
        this.currentList$.next(items ?? []);
      }
    });
  }

  ngOnInit(): void {
    this.newsService.load();
  }

  onSearch(): void {
    const term = this.searchForm.controls.query.value.trim();
    this.hasSearch = true;

    this.isSearching = true;
    this.searchService.search(term).subscribe({
      next: (items) => this.currentList$.next(items ?? []),
      error: () => this.currentList$.next([]),
      complete: () => {
        this.isSearching = false;
      },
    });
  }

  trackById(_index: number, item: NewsItem): string {
    return item.id;
  }
}
