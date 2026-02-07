import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { NewsItem } from '../models/news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private readonly baseUrl = 'http://localhost:8000/noticias';
  private readonly newsSubject = new BehaviorSubject<NewsItem[]>([]);
  readonly news$ = this.newsSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<NewsItem[]> {
    return this.news$;
  }

  load(): void {
    this.http
      .get<NewsItem[]>(this.baseUrl)
      .subscribe({
        next: (items) => this.newsSubject.next(items ?? []),
        error: () => this.newsSubject.next([]),
      });
  }
}
