import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { calendarComponent, EventDialog } from './calendar.component';


const routes: Routes = [{ path: '', component: calendarComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CalendarRoutingModule { }
