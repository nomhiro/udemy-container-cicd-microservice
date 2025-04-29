export interface Todo {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}  