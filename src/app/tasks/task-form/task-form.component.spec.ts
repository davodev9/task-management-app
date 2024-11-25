import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFormComponent } from './task-form.component';
import { CommonImportsModule } from 'src/app/shared/common-import';
import { AppModule } from 'src/app/app.module';
import { TaskService } from 'src/app/services/task.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StateService } from 'src/app/services/state.service';
import { State } from 'src/app/models/state';
import { BehaviorSubject, of } from 'rxjs';
import { StateHistory, Task } from 'src/app/models/task';
import { FormControl, FormGroup } from '@angular/forms';
import { UtilityService } from 'src/app/services/utility.service';
import { MESSAGES } from 'src/app/constants/message.constants';

const states: State[] = [
  {
    id: 'a4d5',
    name: 'new',
  },
  {
    id: 'e8f4',
    name: 'active',
  },
];

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

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskService: TaskService;
  let stateService: StateService;
  let confirmationService: ConfirmationService;
  let messageService: MessageService;
  let utilityService: UtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskFormComponent],
      imports: [CommonImportsModule, AppModule],
    });
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    messageService = TestBed.inject(MessageService);
    taskService = TestBed.inject(TaskService);
    stateService = TestBed.inject(StateService);
    confirmationService = TestBed.inject(ConfirmationService);
    utilityService = TestBed.inject(UtilityService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadStates and update states$', (done) => {
    const spy = spyOn(stateService, 'getStates').and.returnValue(of(states));
    component.loadStates();
    expect(spy).toHaveBeenCalled();
    component.states$.subscribe((tasks) => {
      expect(tasks).toEqual(states);
      done();
    });
  });

  it('should initialize form values correctly', () => {
    const getMostRecentStateRecordSpy = spyOn(
      component,
      'getMostRecentStateRecord'
    ).and.returnValue(states[1]);
    component.task = task;
    component.formTask = new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      dueDate: new FormControl(''),
      state: new FormControl(''),
    });

    component.initializeValues();

    expect(component.formTask.get('title')?.value).toBe(component.task.title);
    expect(component.formTask.get('description')?.value).toBe(
      component.task.description
    );
    expect(component.formTask.get('dueDate')?.value).toBe(
      new Date(component.task.dueDate).toISOString().split('T')[0]
    );
    expect(component.formTask.get('state')?.value).toBe(states[1]);
    expect(component.notes).toEqual(component.task.notes);
  });

  it('should call loadStates and update states$', () => {
    const initializeValuesMock = spyOn(component, 'initializeValues');
    component.editMode = true;
    component.initDialog();
    expect(initializeValuesMock).toHaveBeenCalled();
  });

  it('should call getMostRecentStateRecord and return most recent value', (done) => {
    const mostRecent = component.getMostRecentStateRecord(
      task.stateHistory,
      states
    );
    expect(mostRecent).toEqual(states[1]);
    done();
  });

  it('should call getMostRecentStateRecord and return null value', (done) => {
    const mostRecent = component.getMostRecentStateRecord(stateHistory, null);
    expect(mostRecent).toEqual(null);
    done();
  });

  it('should call addNote', (done) => {
    component.notes = task.notes;
    component.note = 'Test demo';
    component.addNote();
    expect(component.notes.length).toEqual(2);
    done();
  });

  it('should call generateRandomString', (done) => {
    const spy = spyOn(utilityService, 'generateRandomString').and.returnValue(
      'a8d9'
    );
    component.generateRandomString();
    expect(spy).toHaveBeenCalled();
    done();
  });

  it('should call cancelProcess', (done) => {
    component.cancelProcess();
    expect(component.showFormtask).toEqual(false);
    done();
  });

  it('should call formatDateToISO from date', (done) => {
    const today = new Date('2024-11-25');
    const date = component.formatDateToISO(today);
    expect(date).toEqual('2024-11-25');
    done();
  });

  it('should call formatDateToISO from string', (done) => {
    const today = '2024-11-25';
    const date = component.formatDateToISO(today);
    expect(date).toEqual('2024-11-25');
    done();
  });

  it('should call formatDateToISO from null', (done) => {
    const today = 20241125;
    const date = component.formatDateToISO(today);
    expect(date).toEqual(null);
    done();
  });

  it('should addTask create mode', () => {
    const formatDateToISOSpy = spyOn(component, 'formatDateToISO').and.returnValue('2024-11-25');
    const generateRandomStringSpy = spyOn(utilityService, 'generateRandomString').and.returnValue('a8d9');
    spyOn(messageService, 'add');
    const addTaskSpy = spyOn(taskService, 'addTask').and.returnValue(of(task));

    component.task = task;
    component.notes = task.notes;
    component.editMode = false;

    component.formTask = new FormGroup({
      title: new FormControl('Test demo'),
      description: new FormControl('Test demo'),
      dueDate: new FormControl('2024-11-25'),
      state: new FormControl(states[0]),
    });

    component.states$ = new BehaviorSubject(states);
    component.addTask();

    expect(formatDateToISOSpy).toHaveBeenCalled();
    expect(generateRandomStringSpy).toHaveBeenCalled();
    expect(addTaskSpy).toHaveBeenCalled();

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Successful create',
      detail: MESSAGES.successCreate,
      life: 5000,
    });
  });

  it('should addTask edit mode', () => {
    const formatDateToISOSpy = spyOn(component, 'formatDateToISO').and.returnValue('2024-11-25');
    spyOn(messageService, 'add');
    const updateTaskSpy = spyOn(taskService, 'updateTask').and.returnValue(of(task));

    component.task = task;
    component.notes = task.notes;
    component.editMode = true;

    component.formTask = new FormGroup({
      title: new FormControl('Test demo'),
      description: new FormControl('Test demo'),
      dueDate: new FormControl('2024-11-25'),
      state: new FormControl(states[0]),
    });

    component.states$ = new BehaviorSubject(states);
    component.addTask();

    expect(formatDateToISOSpy).toHaveBeenCalled();
    expect(updateTaskSpy).toHaveBeenCalled();

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Successful update',
      detail: MESSAGES.successUpdate,
      life: 5000,
    });
  });
});
