import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from './todo.model';
import { environment } from '../environments/environment';



/** Talks to the Spring Boot API. In dev, /api is proxied to http://localhost:8080. */
@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/todos`;

  list(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseUrl);
  }

  create(title: string): Observable<Todo> {
    return this.http.post<Todo>(this.baseUrl, { title });
  }

  update(todo: Todo, title: string): Observable<Todo> {
    return this.http.put<Todo>(`${this.baseUrl}/${todo.id}`, { title, completed: todo.completed });
  }

  toggle(id: number): Observable<Todo> {
    return this.http.patch<Todo>(`${this.baseUrl}/${id}/toggle`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  clearCompleted(): Observable<{ deleted: number }> {
    return this.http.delete<{ deleted: number }>(`${this.baseUrl}/completed`);
  }
}
