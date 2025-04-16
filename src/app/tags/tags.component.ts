import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { NgFor, NgIf } from '@angular/common';
import { TagComponent } from '../tag/tag.component';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-tags',
  standalone: true, 
  imports: [NgFor, NgIf, FormsModule, TagComponent],
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent {
  loaded: boolean = false;
  tags: { id: string; name: string; color: string }[] = [];
  editing: { id: string | null; name: string; color: string } | null = null;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.tags = this.storageService.getTags(); 
  }

  loadTags(): void {
    if (!this.loaded) {
      this.tags = this.storageService.getTags(); 
      this.loaded = true;
    }
  }

  dialogAddTag(): void {
    const tagName = window.prompt('Entrez le nom du nouveau tag :');
    if (tagName && tagName.trim() !== '') {
      const newTag = {
        id: this.storageService.generateUniqueId(),
        name: tagName.trim(),
        color: this.storageService.getRandomColor()
      };
      this.storageService.addTag(newTag); 
      this.tags = this.storageService.getTags(); 
    }
  }

  deleteTag(tag: { id: string; name: string; color: string }): void {
    this.storageService.deleteTag(tag.id); 
    this.tags = this.storageService.getTags(); 
  }

  startEditing(tag: { id: string | null; name: string; color: string }): void {
    this.editing = { ...tag };
  }

  saveTag(): void {
    if (this.editing) {
      if (!this.editing.name || !this.editing.name.trim()) {
        alert('Le nom du tag ne peut pas être vide.');
        return;
      }

      if (this.editing.id === null) {
        const newTag = {
          ...this.editing,
          id: this.storageService.generateUniqueId()
        };
        this.storageService.addTag(newTag); 
      } else {
        const tags = this.tags.map(tag =>
          tag.id === this.editing?.id
            ? { id: this.editing.id, name: this.editing.name, color: this.editing.color }
            : tag
        );
        this.storageService.saveTags(tags); 
      }
      this.tags = this.storageService.getTags();
      this.cancelEditing(); 
    }
  }

  cancelEditing(): void {
    this.editing = null;
  }
}
