import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { MESSAGES } from 'src/app/constants/message.constants';
import { StateHistory, Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks$ = new BehaviorSubject<Task[]>([]);
  showFormtask: boolean = false;
  editMode: boolean = false;
  task: Task | undefined;
  currentPage = 1;
  tasksPerPage = 5;

  constructor(private taskService: TaskService, private confirmationService: ConfirmationService, private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks$.next(tasks);
    });
  }

  get paginatedTasks() {
    const start = (this.currentPage - 1) * this.tasksPerPage;
    return this.tasks$.value.slice(start, start + this.tasksPerPage);
  }

  openModalFormTask(task?: Task){
    if(task === undefined){
      task = {
        title:'',
        description: '',
        dueDate: undefined,
        completed: false,
        notes: [],
        stateHistory: []
      };
      this.editMode = false;
    }else{
      this.editMode = true
    }
    this.task = task;
    this.showFormtask = true;
  }

  confirmDeleteTask(task: Task){
    this.confirmationService.confirm({
      header: 'Delete process',
      message: `¿Are you sure you want to delete "${task.title}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.taskService.deleteTask(task.id!).subscribe(() => {
          this.loadTasks();
        });
        this.messageService.add({
          severity: 'success',
          summary: 'Successful elimination',
          detail: MESSAGES.successDelete,
          life: 5000,
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Elimination cancelled',
          detail: MESSAGES.cancelDelete,
          life: 5000,
        });
      },
    });
  }

  markAsCompleted(task: any): void {
    const updatedTask = { ...task, completed: true };
    this.taskService.updateTask(task.id, updatedTask).subscribe(() => {
      this.loadTasks();
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  updateTaskList($event: any){
    if($event){
      this.loadTasks();
    }
    this.showFormtask = false;
  }

  getMostRecentState(stateHistory: StateHistory[]): StateHistory | null {
    if (!stateHistory || stateHistory.length === 0) {
      return null;
    }
    return stateHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }
}
