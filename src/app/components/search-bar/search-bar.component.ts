import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() isSearching = false;
  @Output() submitSearch = new EventEmitter<void>();

  onSubmit(): void {
    this.submitSearch.emit();
  }
}
