import { StorageService } from './storage.service';
import { Note } from './note.model';

// Fonction de test pour vérifier si TypeScript reconnaît la méthode getNotes()
const testFunction = (service: StorageService) => {
  const notes: Note[] = service.getNotes();
  return notes;
};

// Rien d'autre n'est nécessaire, ce fichier ne sera pas exécuté
// Il sert uniquement à voir si TypeScript détecte une erreur lors de la compilation