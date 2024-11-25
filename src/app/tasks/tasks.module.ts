import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { TaskListComponent } from './task-list/task-list.component';
import { CommonImportsModule } from 'src/app/shared/common-import';
import { TaskFormComponent } from './task-form/task-form.component';


@NgModule({
  declarations: [
    TasksComponent,
    TaskListComponent,
    TaskFormComponent
  ],
  imports: [
    CommonModule,
    CommonImportsModule,
    TasksRoutingModule
  ],
})
export class TasksModule { }
