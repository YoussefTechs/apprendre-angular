import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent {
  @Input() id: string = ''; 
  @Input() name: string = ''; 
  @Input() color: string = ''; 

  editTag(): void {
    const newName = window.prompt('Modifier le nom du tag :', this.name);
    if (newName && newName.trim() !== '') {
      this.name = newName.trim();

    }
  }
  
 
}