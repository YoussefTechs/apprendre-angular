import { Injectable } from '@angular/core';
import { Tag } from './tag.model';
import { Note } from './note.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private tagsKey = 'tags';
  private notesKey = 'notes';

  private tags: Tag[] = [
    { id: 1, name: 'Urgent', color: '#ff0000' },
    { id: 2, name: 'Travail', color: '#00ff00' },
    { id: 3, name: 'Personnel', color: '#0000ff' }
  ];

  constructor() {}

  
  public getTags(): { id: string; name: string; color: string }[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const tags = localStorage.getItem(this.tagsKey);
      return tags
        ? JSON.parse(tags)
        : this.tags.map(tag => ({
            ...tag,
            id: tag.id.toString()
          }));
    }
    return this.tags.map(tag => ({
      ...tag,
      id: tag.id.toString()
    }));
  }

  public saveTags(tags: { id: string; name: string; color: string }[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.tagsKey, JSON.stringify(tags));
    }
  }

  public addTag(tag: { id: string; name: string; color: string }): void {
    const tags = this.getTags();
    tags.push(tag);
    this.saveTags(tags);
  }

  public deleteTag(tagId: string): void {
    const tags = this.getTags();
    const updatedTags = tags.filter(tag => tag.id !== tagId);
    this.saveTags(updatedTags);
  }

  public updateTag(updatedTag: { id: string; name: string; color: string }): void {
    const tags = this.getTags();
    const index = tags.findIndex(tag => tag.id === updatedTag.id);
    if (index !== -1) {
      tags[index] = updatedTag;
      this.saveTags(tags);
    }
  }

  // Méthodes pour les notes
  public getNotes(): Note[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const notes = localStorage.getItem(this.notesKey);
      return notes ? JSON.parse(notes) : [];
    }
    return [];
  }
  
  public saveNotes(notes: Note[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.notesKey, JSON.stringify(notes));
    }
  }
  
  public addNote(note: Note): void {
    const notes = this.getNotes();
    notes.push(note);
    this.saveNotes(notes);
  }
  
  
  public generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  public getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}