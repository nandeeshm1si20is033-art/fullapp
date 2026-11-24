import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Filter, Todo } from './todo.model';
import { TodoService } from './todo.service';
import { AutofocusDirective } from './autofocus.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, DatePipe, AutofocusDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private readonly api = inject(TodoService);

  readonly todos = signal<Todo[]>([]);
  readonly filter = signal<Filter>('all');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly editingId = signal<number | null>(null);

  draft = '';
  editText = '';
  readonly today = new Date();

  readonly filters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'To do' },
    { value: 'completed', label: 'Done' },
  ];

  readonly visible = computed(() => {
    const f = this.filter();
    return this.todos().filter((t) => (f === 'all' ? true : f === 'active' ? !t.completed : t.completed));
  });
  readonly remaining = computed(() => this.todos().filter((t) => !t.completed).length);
  readonly doneCount = computed(() => this.todos().length - this.remaining());

  ngOnInit(): void {
    this.api.list().subscribe({
      next: (todos) => {
        this.todos.set(todos);
        this.loading.set(false);
      },
      error: () => this.fail('Could not reach the server.'),
    });
  }

  add(): void {
    const title = this.draft.trim();
    if (!title) return;
    this.api.create(title).subscribe({
      next: (todo) => {
        this.todos.update((list) => [todo, ...list]);
        this.draft = '';
      },
      error: () => this.fail('Could not add the task.'),
    });
  }

  toggle(todo: Todo): void {
    this.api.toggle(todo.id).subscribe({
      next: (updated) => this.replace(updated),
      error: () => this.fail('Could not update the task.'),
    });
  }

  remove(todo: Todo): void {
    this.api.delete(todo.id).subscribe({
      next: () => this.todos.update((list) => list.filter((t) => t.id !== todo.id)),
      error: () => this.fail('Could not delete the task.'),
    });
  }

  startEdit(todo: Todo): void {
    this.editingId.set(todo.id);
    this.editText = todo.title;
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  commitEdit(todo: Todo): void {
    if (this.editingId() !== todo.id) return;
    this.editingId.set(null);
    const title = this.editText.trim();
    if (!title) {
      this.remove(todo);
      return;
    }
    if (title === todo.title) return;
    this.api.update(todo, title).subscribe({
      next: (updated) => this.replace(updated),
      error: () => this.fail('Could not save your edit.'),
    });
  }

  clearCompleted(): void {
    this.api.clearCompleted().subscribe({
      next: () => this.todos.update((list) => list.filter((t) => !t.completed)),
      error: () => this.fail('Could not clear finished tasks.'),
    });
  }

  private replace(updated: Todo): void {
    this.todos.update((list) => list.map((t) => (t.id === updated.id ? updated : t)));
  }

  private fail(message: string): void {
    this.loading.set(false);
    this.error.set(message);
    setTimeout(() => this.error.set(null), 5000);
  }
}
