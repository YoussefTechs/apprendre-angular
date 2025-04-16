export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  textColor: string;
  type: 'text' | 'checklist'; 
  checklist: { label: string; checked: boolean }[]; 
}
