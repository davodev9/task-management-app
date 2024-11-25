import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { MESSAGES } from 'src/app/constants/message.constants';
import { State } from 'src/app/models/state';
import { StateHistory, Task } from 'src/app/models/task';
import { StateService } from 'src/app/services/state.service';
import { TaskService } from 'src/app/services/task.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  states$ = new BehaviorSubject<State[]>([]);
  @Input() task: Task;
  @Input() showFormtask: boolean;
  @Input() editMode: boolean;
  @Output() messageEvent = new EventEmitter<boolean>();
  formTask!: FormGroup;
  note: string = '';
  notes: string[] = [];
  changeDetectorRef: ChangeDetectorRef;

  constructor(
    private taskService: TaskService,
    private stateService: StateService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private utilityService: UtilityService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.changeDetectorRef = _changeDetectorRef;
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const date = new Date(control.value);
    const today = new Date();
    if (date < today) {
      return { pastDate: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.formTask = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', [Validators.required].concat(this.editMode ? [] : [this.futureDateValidator])],
      state: [null],
    });
    this.loadStates();
  }

  initDialog() {
    if (this.editMode) {
      this.initializeValues();
    }
  }

  loadStates(): void {
    this.stateService.getStates().subscribe((states) => {
      this.states$.next(states);
    });
  }

  initializeValues() {
    this.formTask.get('title').setValue(this.task.title);
    this.formTask.get('description').setValue(this.task.description);
    this.formTask.get('dueDate').setValue(new Date(this.task.dueDate).toISOString().split('T')[0]);
    this.formTask.get('state').setValue(this.getMostRecentStateRecord(this.task.stateHistory, this.states$.value));
    this.notes = this.task.notes;
    this.changeDetectorRef.detectChanges();
  }

  getMostRecentStateRecord(
    stateHistory: StateHistory[], states: State[]): State | null {
    if ( !stateHistory || stateHistory.length === 0 || !states ||
      states.length === 0) {
      return null;
    }
    const mostRecentStateName = stateHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.state;
    return states.find((state) => state.name === mostRecentStateName) || null;
  }

  addNote() {
    this.notes.push(this.note);
    this.note = '';
  }

  formatDateToISO(date: any): any | null {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    } else if (typeof date === 'string') {
      return date;
    }
    return null;
  }

  addTask() {
    this.task.title = this.formTask.get('title').value;
    this.task.description = this.formTask.get('description').value;

    this.task.completed = false;
    this.task.dueDate = this.formatDateToISO(this.formTask.get('dueDate').value);
    this.task.notes = this.notes;

    if (this.editMode) {
      this.task.stateHistory.push({
        state: this.formTask.get('state').value.name,
        date: new Date().toISOString().split('T')[0],
      });

      this.taskService.updateTask(this.task.id, this.task).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful update',
            detail: MESSAGES.successUpdate,
            life: 5000,
          });
        },
        (error) => {
          console.error('Update failed:', error);
          this.messageService.add({
            severity: 'error',
            summary: MESSAGES.errorUpdate,
            detail: MESSAGES.errorUpdateDetail,
            life: 5000,
          });
        }
      );
    } else {
      if(this.task.notes.length <= 0){
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation notes.',
          detail: MESSAGES.emptyNotes,
          life: 5000,
        });
        return;
      }
      this.task.stateHistory.push({
        state: this.states$.value.find((state) => state.name === 'new').name,
        date: new Date().toISOString().split('T')[0],
      });
      this.task.id = this.generateRandomString();
      this.taskService.addTask(this.task).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful create',
            detail: MESSAGES.successCreate,
            life: 5000,
          });
        },
        (error) => {
          console.error('Create failed:', error);
          this.messageService.add({
            severity: 'error',
            summary: MESSAGES.errorCreate,
            detail: MESSAGES.errorCreateDetail,
            life: 5000,
          });
        }
      );
    }
    this.changeDetectorRef.markForCheck();
    this.messageEvent.emit(true);
  }

  cancelProcess() {
    this.showFormtask = false;
    this.messageEvent.emit(false);
    this.changeDetectorRef.detectChanges();
  }

  generateRandomString(): string {
    return this.utilityService.generateRandomString();
  }
}
