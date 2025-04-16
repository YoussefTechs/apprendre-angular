import { Component } from '@angular/core';
import { Note } from '../note.model';
import { StorageService } from '../storage.service';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notes',
  standalone: true,
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
  imports: [NgFor, NgIf, DatePipe, FormsModule]
})
export class NotesComponent {
  notes: Note[] = [];
  tags: { id: string; name: string; color: string }[] = [];

  editing: Note | null = null;
  activeTagFilter: string | null = null;

  newChecklistItem: string = '';

  newNote: Note = {
    id: '',
    title: '',
    content: '',
    tags: [],
    createdAt: '',
    textColor: '#000000',
    type: 'text', 
    checklist: [] 
  };

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.notes = this.storageService.getNotes().map(note => ({
      ...note,
      textColor: note.textColor || '#000000',
      type: note.type || 'text',
      checklist: note.checklist || []
    }));
    this.tags = this.storageService.getTags();
  }

  get filteredNotes(): Note[] {
    if (!this.activeTagFilter) return this.notes;
    return this.notes.filter(note => note.tags.includes(this.activeTagFilter!));
  }

  setTagFilter(tagId: string | null): void {
    this.activeTagFilter = tagId;
  }

  createOrUpdateNote(): void {
    if (!this.newNote.title.trim() || (this.newNote.type === 'text' && !this.newNote.content.trim())) {
      alert('Le titre et le contenu sont obligatoires.');
      return;
    }

    if (this.editing) {
      const updatedNote: Note = {
        ...this.newNote,
        id: this.editing.id,
        createdAt: this.editing.createdAt
      };

      const index = this.notes.findIndex(n => n.id === updatedNote.id);
      if (index !== -1) {
        this.notes[index] = updatedNote;
      }
      this.storageService.saveNotes(this.notes);
      this.editing = null;
    } else {
      const note: Note = {
        ...this.newNote,
        id: this.storageService.generateUniqueId(),
        createdAt: new Date().toISOString()
      };
      this.notes.push(note);
      this.storageService.saveNotes(this.notes);
    }

    this.resetForm();
  }

  resetForm(): void {
    this.newNote = {
      id: '',
      title: '',
      content: '',
      tags: [],
      createdAt: '',
      textColor: '#000000',
      type: 'text',
      checklist: []
    };
    this.newChecklistItem = '';
    this.editing = null;
  }

  deleteNote(noteId: string): void {
    const updatedNotes = this.notes.filter(note => note.id !== noteId);
    this.storageService.saveNotes(updatedNotes);
    this.notes = updatedNotes;
  }

  editNote(note: Note): void {
    this.editing = note;
    this.newNote = {
      ...note,
      checklist: [...(note.checklist || [])]
    };
  }

  toggleTag(tagId: string): void {
    const index = this.newNote.tags.indexOf(tagId);
    if (index === -1) {
      this.newNote.tags.push(tagId);
    } else {
      this.newNote.tags.splice(index, 1);
    }
  }

  getTagById(id: string) {
    return this.tags.find(tag => tag.id === id);
  }

  addChecklistItem(): void {
    const label = this.newChecklistItem.trim();
    if (label) {
      this.newNote.checklist.push({ label, checked: false });
      this.newChecklistItem = '';
    }
  }

  removeChecklistItem(index: number): void {
    this.newNote.checklist.splice(index, 1);
  }
}
