import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CalendarComponent} from './calendar.component';
import { CalendarDayComponent } from './calendar-day/calendar-day.component';
import { CalendarWeekComponent } from './calendar-week/calendar-week.component';
import { CalendarMonthComponent } from './calendar-month/calendar-month.component';
import { CalendarScheduleComponent } from './calendar-schedule/calendar-schedule.component';


const routes: Routes = [
  {path: '', component: CalendarComponent,
  children: [
      {path: '', component: CalendarMonthComponent},
      {path: 'month', component: CalendarMonthComponent},
      {path: 'week', component: CalendarWeekComponent},
      {path: 'day', component: CalendarDayComponent},
      {path: 'schedule', component: CalendarScheduleComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CalendarRoutingModule {
}
