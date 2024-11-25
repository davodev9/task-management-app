import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CardModule } from 'primeng/card';
import { HttpClientModule } from "@angular/common/http";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import {CalendarModule} from 'primeng/calendar';

@NgModule({
  exports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    ToastModule,
    TableModule,
    CardModule,
    SelectButtonModule,
    DropdownModule,
    DialogModule,
    ConfirmDialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    TooltipModule,
    CalendarModule
  ],
  imports: [HttpClientModule]
})
export class CommonImportsModule {}
