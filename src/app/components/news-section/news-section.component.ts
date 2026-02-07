import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsItem } from '../../models/news.model';
import { NewsCardComponent } from '../news-card/news-card.component';

@Component({
  selector: 'app-news-section',
  templateUrl: './news-section.component.html',
  styleUrls: ['./news-section.component.scss'],
  standalone: true,
  imports: [CommonModule, NewsCardComponent],
})
export class NewsSectionComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle = '';
  @Input() layout: 'latest' | 'grid' = 'grid';
  @Input() featured: NewsItem | null = null;
  @Input() items: NewsItem[] = [];
  @Input() trackBy?: (index: number, item: NewsItem) => string;
}
