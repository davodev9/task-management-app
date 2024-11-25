import { TestBed } from '@angular/core/testing';

import { TaskService } from './task.service';
import { CommonImportsModule } from '../shared/common-import';
import { AppModule } from '../app.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StateHistory, Task } from '../models/task';

const stateHistory: StateHistory = {
  state: 'new',
  date: '2024-11-25'
};

const task: Task = {
  id: '6d9v',
  title: 'Test demo',
  description: 'Test demo',
  completed: false,
  dueDate: new Date('2024-11-25'),
  stateHistory: [stateHistory],
  notes: ['Test demo']
}


describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonImportsModule, AppModule, HttpClientTestingModule]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be get tasks and resolve get', () => {
    service.getTasks().subscribe();
    const req = httpMock.expectOne({ method: 'GET' });
    expect(req.request.method).toBe('GET');
    req.flush('GET');
  });

  it('should be add task and resolve post', () => {
    service.addTask(task).subscribe();
    const req = httpMock.expectOne({ method: 'POST' });
    expect(req.request.method).toBe('POST');
    req.flush('POST');
  });

  it('should be delete task and resolve delete', () => {
    service.deleteTask(task.id).subscribe();
    const req = httpMock.expectOne({ method: 'DELETE' });
    expect(req.request.method).toBe('DELETE');
    req.flush('DELETE');
  });

  it('should be put task and resolve put', () => {
    service.updateTask(task.id, task).subscribe();
    const req = httpMock.expectOne({ method: 'PUT' });
    expect(req.request.method).toBe('PUT');
    req.flush('PUT');
  });
});
