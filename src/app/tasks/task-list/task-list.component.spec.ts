import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListComponent } from './task-list.component';
import { CommonImportsModule } from 'src/app/shared/common-import';
import { AppModule } from 'src/app/app.module';
import { TaskService } from 'src/app/services/task.service';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { StateHistory, Task } from 'src/app/models/task';
import { of } from 'rxjs';
import { MESSAGES } from 'src/app/constants/message.constants';

const stateHistory: StateHistory[] = [
  {
    state: 'new',
    date: '2024-10-25',
  },
  {
    state: 'active',
    date: '2024-11-25',
  },
];

const task: Task = {
  id: '6d9v',
  title: 'Test demo',
  description: 'Test demo',
  completed: false,
  dueDate: new Date('2024-11-25'),
  stateHistory: stateHistory,
  notes: ['Test demo'],
};

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: TaskService;
  let confirmationService: ConfirmationService;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskListComponent],
      imports: [CommonImportsModule, AppModule],
      providers: [MessageService, TaskService, ConfirmationService],
    });
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    messageService = TestBed.inject(MessageService);
    taskService = TestBed.inject(TaskService);
    confirmationService = TestBed.inject(ConfirmationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadTasks and update tasks$', (done) => {
    const spy = spyOn(taskService, 'getTasks').and.returnValue(of([task]));
    component.loadTasks();
    expect(spy).toHaveBeenCalled();
    component.tasks$.subscribe((tasks) => {
      expect(tasks).toEqual([task]);
      done();
    });
  });

  it('should open modal task and initialize a new task', () => {
    component.openModalFormTask();

    expect(component.task).toEqual({
      title: '',
      description: '',
      dueDate: undefined,
      completed: false,
      notes: [],
      stateHistory: [],
    });
    expect(component.editMode).toBe(false);
    expect(component.showFormtask).toBe(true);
  });

  it('should open modal task and initialize a existing task', () => {
    component.openModalFormTask(task);
    expect(component.task).toBe(task);
    expect(component.editMode).toBe(true);
    expect(component.showFormtask).toBe(true);
  });

  it('should confirmDeleteTask() accept', () => {
    const deleteTaskSpy = spyOn(taskService, 'deleteTask').and.returnValue(of(null));
    const loadTasksSpy = spyOn(component, 'loadTasks');
    spyOn(messageService, 'add');
    spyOn(confirmationService, 'confirm').and.callFake(
      (confirmation: Confirmation) => confirmation.accept()
    );
    component.confirmDeleteTask(task);

    expect(deleteTaskSpy).toHaveBeenCalledWith(task.id);
    expect(loadTasksSpy).toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Successful elimination',
      detail: MESSAGES.successDelete,
      life: 5000,
    });
  });

  it('should confirmDeleteTask() cancel', () => {
    spyOn(messageService, 'add');
    spyOn(confirmationService, 'confirm').and.callFake(
      (confirmation: Confirmation) => confirmation.reject()
    );
    component.confirmDeleteTask(task);

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'warn',
      summary: 'Elimination cancelled',
      detail: MESSAGES.cancelDelete,
      life: 5000,
    });
  });

  it('should call markAsCompleted and update tasks$', (done) => {
    const updateTaskSpy = spyOn(taskService, 'updateTask').and.returnValue(of(null));
    const loadTasksSpy = spyOn(component, 'loadTasks');
    task.completed = true;
    component.markAsCompleted(task);

    expect(updateTaskSpy).toHaveBeenCalledWith(task.id, task);

    updateTaskSpy.calls.mostRecent().returnValue.subscribe(() => {
      expect(loadTasksSpy).toHaveBeenCalled();
      done();
    });
  });

  it('should call changePage', (done) => {
    component.changePage(2);
    expect(component.currentPage).toEqual(2);
    done();
  });

  it('should call changePage', (done) => {
    const loadTasksSpy = spyOn(component, 'loadTasks');
    component.updateTaskList(true);
    expect(loadTasksSpy).toHaveBeenCalled();
    expect(component.showFormtask).toEqual(false);
    done();
  });

  it('should call getMostRecentState and return most recent value', (done) => {
    const mostRecent = component.getMostRecentState(stateHistory);
    expect(mostRecent).toEqual(stateHistory[0]);
    done();
  });

  it('should call getMostRecentState without data', (done) => {
    const mostRecent = component.getMostRecentState(null);
    expect(mostRecent).toEqual(null);
    done();
  });
});
