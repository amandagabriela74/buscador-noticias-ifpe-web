import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { NewsItem , SearchResponse} from '../models/news.model';


@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly baseUrl = 'http://localhost:8000/buscar';

  constructor(private readonly http: HttpClient) {}

  search(query: string): Observable<NewsItem[]> {
    const url = `${this.baseUrl}?q=${encodeURIComponent(query)}`;

    return this.http
      .get<SearchResponse>(url)
      .pipe(
        map(response => response.resultados ?? [])
      );
  }
}
