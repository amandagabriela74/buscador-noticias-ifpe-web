import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsItem } from '../../models/news.model';

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class NewsCardComponent {
  @Input({ required: true }) item!: NewsItem;
  @Input() variant: 'default' | 'featured' | 'compact' = 'default';
}
