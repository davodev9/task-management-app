import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  updateTask(id: string, task: Task): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task,{
      headers: { 'Content-Type': 'application/json' }
   });
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
